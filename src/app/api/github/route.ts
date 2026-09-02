import { Octokit } from "@octokit/rest";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const OWNER = process.env.GITHUB_OWNER || "";
const REPO = process.env.GITHUB_REPO || "";
const BRANCH = "master";

function getOctokit() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return null;
  return new Octokit({ auth: token });
}

// ---------- helpers ----------

async function getFile(path: string) {
  const octokit = getOctokit();
  if (!OWNER || !REPO || !octokit) return null;
  try {
    const { data } = await octokit.repos.getContent({ owner: OWNER, repo: REPO, path, ref: BRANCH });
    if (!Array.isArray(data) && data.type === "file" && "content" in data) {
      return { content: Buffer.from(data.content, "base64").toString("utf-8"), sha: data.sha };
    }
  } catch (e: any) {
    if (e.status === 404) return null;
    console.error(`Error getting file ${path}:`, e.message);
  }
  return null;
}

async function commitFile(path: string, content: string, message: string, sha?: string): Promise<void> {
  const octokit = getOctokit();
  if (!OWNER || !REPO || !octokit) throw new Error("Missing GitHub credentials");
  
  // Retry up to 3 times on SHA conflicts (409)
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      let currentSha = sha;
      if (attempt > 0) {
        // Re-fetch the latest SHA on retry
        const latest = await getFile(path);
        currentSha = latest?.sha;
      }
      await octokit.repos.createOrUpdateFileContents({
        owner: OWNER,
        repo: REPO,
        path,
        message,
        content: Buffer.from(content).toString("base64"),
        branch: BRANCH,
        ...(currentSha ? { sha: currentSha } : {}),
      });
      return; // success
    } catch (err: any) {
      if (err.status === 409 && attempt < 2) {
        console.warn(`[github api] SHA conflict on ${path}, retrying (attempt ${attempt + 1})...`);
        continue;
      }
      throw err;
    }
  }
}

async function uploadImage(base64Data: string, mimeType: string, projectId: string, filename: string) {
  const path = `public/projects/${projectId}/${filename}`;
  // Strip the data URL prefix if present
  const raw = base64Data.replace(/^data:[^;]+;base64,/, "");
  const existing = await getFile(path);
  const octokit = getOctokit();
  if (!octokit) throw new Error("Missing GitHub credentials");
  await octokit.repos.createOrUpdateFileContents({
    owner: OWNER,
    repo: REPO,
    path,
    message: `feat: upload image for project ${projectId}`,
    content: raw,
    branch: BRANCH,
    ...(existing ? { sha: existing.sha } : {}),
  });
  return `/projects/${projectId}/${filename}`;
}

const DATA_PATH = "public/data/projects.json";
const PROFILE_PATH = "public/data/profile.json";

function isAuthenticated(request: Request) {
  const authHeader = request.headers.get("authorization");
  const adminPass = process.env.ADMIN_PASSWORD;
  
  // If no password is set in env, block everything for security
  if (!adminPass) return false;
  if (!authHeader) return false;
  
  const token = authHeader.replace("Bearer ", "");
  return token === adminPass;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  try {
    if (type === "profile") {
      const file = await getFile(PROFILE_PATH);
      const profile = file ? JSON.parse(file.content) : null;
      return NextResponse.json(profile);
    }
    const file = await getFile(DATA_PATH);
    const projects = file ? JSON.parse(file.content) : [];
    return NextResponse.json(projects);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Login route
    if (body.action === "login") {
      const adminEmail = process.env.ADMIN_EMAIL;
      const adminPass = process.env.ADMIN_PASSWORD;
      
      if (!adminEmail || !adminPass) {
        return NextResponse.json({ error: "Server misconfiguration: Admin credentials not set" }, { status: 500 });
      }

      if (body.email === adminEmail && body.password === adminPass) {
        return NextResponse.json({ success: true, token: adminPass });
      }
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Require authentication for all other routes
    if (!isAuthenticated(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Profile image upload route
    if (body.action === "upload_profile_image") {
      const raw = body.imageBase64.replace(/^data:[^;]+;base64,/, "");
      const path = "public/profile.png";
      const existing = await getFile(path);
      await commitFile(path, raw, "feat: update profile photo", existing?.sha);
      return NextResponse.json({ success: true, url: "/profile.png" });
    }

    // Resume PDF upload route
    if (body.action === "upload_resume") {
      const raw = body.pdfBase64.replace(/^data:[^;]+;base64,/, "");
      const path = "public/resume.pdf";
      const existing = await getFile(path);
      await commitFile(path, raw, "feat: update resume PDF", existing?.sha);
      return NextResponse.json({ success: true, url: "/resume.pdf" });
    }

    // Profile settings save route
    if (body.action === "save_profile") {
      const file = await getFile(PROFILE_PATH);
      let existingProfile = {};
      if (file && file.content) {
        try {
          existingProfile = JSON.parse(file.content);
        } catch (e) {}
      }
      
      const mergedProfile = { ...existingProfile, ...body.profile };
      
      await commitFile(
        PROFILE_PATH,
        JSON.stringify(mergedProfile, null, 2),
        "feat: update profile configuration",
        file?.sha
      );
      return NextResponse.json({ success: true, profile: mergedProfile });
    }

    // Single image upload route
    if (body.action === "upload_image") {
      const url = await uploadImage(body.imageBase64, body.imageMime || "image/png", body.projectId, body.imageFilename);
      return NextResponse.json({ success: true, url });
    }

    // Reorder project route
    if (body.action === "reorder_project") {
      const file = await getFile(DATA_PATH);
      if (!file) return NextResponse.json({ error: "projects.json not found" }, { status: 404 });
      
      let projects: any[] = JSON.parse(file.content);
      const { id, direction } = body;
      
      const idx = projects.findIndex((p: any) => p.id === id);
      if (idx === -1) return NextResponse.json({ error: "project not found" }, { status: 404 });
      
      if (direction === "up" && idx > 0) {
        const temp = projects[idx];
        projects[idx] = projects[idx - 1];
        projects[idx - 1] = temp;
      } else if (direction === "down" && idx < projects.length - 1) {
        const temp = projects[idx];
        projects[idx] = projects[idx + 1];
        projects[idx + 1] = temp;
      }

      await commitFile(
        DATA_PATH,
        JSON.stringify(projects, null, 2),
        `feat: reorder project "${id}" ${direction}`,
        file.sha
      );

      return NextResponse.json({ success: true, projects });
    }

    // Project saving route
    if (body.action === "save_project") {
      const id = body.id;
      const file = await getFile(DATA_PATH);
      let projects: any[] = file ? JSON.parse(file.content) : [];

      const isUpdate = projects.findIndex((p: any) => p.id === id);
      const newProject = {
        id,
        title: body.title,
        description: body.description,
        tech: body.tech,
        live: body.live,
        liveLink: body.liveLink || "",
        githubLink: body.githubLink || "",
        status: body.status,
        featured: body.featured !== undefined ? body.featured : (isUpdate !== -1 ? projects[isUpdate].featured : false),
        difficulty: body.difficulty !== undefined ? body.difficulty : (isUpdate !== -1 ? projects[isUpdate].difficulty : "Production Grade"),
        timeInvestment: body.timeInvestment !== undefined ? body.timeInvestment : (isUpdate !== -1 ? projects[isUpdate].timeInvestment : ""),
        coverImage: body.coverImage !== undefined ? body.coverImage : (isUpdate !== -1 ? projects[isUpdate].coverImage : ""),
        gallery: body.gallery !== undefined ? body.gallery : (isUpdate !== -1 ? projects[isUpdate].gallery : []),
        caseStudy: body.caseStudy !== undefined ? (body.caseStudy === null ? undefined : body.caseStudy) : (isUpdate !== -1 ? projects[isUpdate].caseStudy : undefined),
        createdAt: isUpdate !== -1 ? projects[isUpdate].createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (isUpdate !== -1) {
        projects[isUpdate] = newProject;
      } else {
        projects.unshift(newProject);
      }

      await commitFile(
        DATA_PATH,
        JSON.stringify(projects, null, 2),
        `feat: ${isUpdate !== -1 ? "update" : "add"} project "${body.title}"`,
        file?.sha
      );

      return NextResponse.json({ success: true, project: newProject });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err: any) {
    console.error("[github api]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { id } = body;
    const file = await getFile(DATA_PATH);
    if (!file) return NextResponse.json({ error: "projects.json not found" }, { status: 404 });

    let projects: any[] = JSON.parse(file.content);
    projects = projects.filter((p: any) => p.id !== id);

    await commitFile(
      DATA_PATH,
      JSON.stringify(projects, null, 2),
      `feat: remove project "${id}"`,
      file.sha
    );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
