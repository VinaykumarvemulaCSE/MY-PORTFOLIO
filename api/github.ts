import { Octokit } from "@octokit/rest";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const OWNER = process.env.GITHUB_OWNER!;
const REPO = process.env.GITHUB_REPO!;
const BRANCH = "master";

// ---------- helpers ----------

async function getFile(path: string) {
  try {
    const { data } = await octokit.repos.getContent({ owner: OWNER, repo: REPO, path, ref: BRANCH });
    if ("content" in data) {
      return { content: Buffer.from(data.content, "base64").toString("utf-8"), sha: data.sha };
    }
  } catch (e: any) {
    if (e.status === 404) return null;
    throw e;
  }
  return null;
}

async function commitFile(path: string, content: string, message: string, sha?: string) {
  await octokit.repos.createOrUpdateFileContents({
    owner: OWNER,
    repo: REPO,
    path,
    message,
    content: Buffer.from(content).toString("base64"),
    branch: BRANCH,
    ...(sha ? { sha } : {}),
  });
}

async function uploadImage(base64Data: string, mimeType: string, projectId: string, filename: string) {
  const path = `public/projects/${projectId}/${filename}`;
  // Strip the data URL prefix if present
  const raw = base64Data.replace(/^data:[^;]+;base64,/, "");
  const existing = await getFile(path);
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

// ---------- main handler ----------

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Allow CORS for local dev
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  const DATA_PATH = "public/data/projects.json";

  try {
    // ---------- GET: list projects ----------
    if (req.method === "GET") {
      const file = await getFile(DATA_PATH);
      const projects = file ? JSON.parse(file.content) : [];
      return res.status(200).json(projects);
    }

    // ---------- POST: create / update ----------
    if (req.method === "POST") {
      const body = req.body as {
        id?: string;
        title: string;
        description: string;
        tech: string[];
        live: boolean;
        liveLink?: string;
        githubLink?: string;
        status: string;
        imageBase64?: string;
        imageMime?: string;
        imageFilename?: string;
      };

      const id = body.id || `project-${Date.now()}`;

      // Upload image if provided
      let coverImage = "";
      if (body.imageBase64 && body.imageFilename) {
        coverImage = await uploadImage(body.imageBase64, body.imageMime || "image/png", id, body.imageFilename);
      }

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
        coverImage: coverImage || (isUpdate !== -1 ? projects[isUpdate].coverImage : ""),
        gallery: [],
        createdAt: isUpdate !== -1 ? projects[isUpdate].createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (isUpdate !== -1) {
        // Update in place
        projects[isUpdate] = newProject;
      } else {
        // FILO: newest first
        projects.unshift(newProject);
      }

      await commitFile(
        DATA_PATH,
        JSON.stringify(projects, null, 2),
        `feat: ${isUpdate !== -1 ? "update" : "add"} project "${body.title}"`,
        file?.sha
      );

      return res.status(200).json({ success: true, project: newProject });
    }

    // ---------- DELETE ----------
    if (req.method === "DELETE") {
      const { id } = req.body as { id: string };
      const file = await getFile(DATA_PATH);
      if (!file) return res.status(404).json({ error: "projects.json not found" });

      let projects: any[] = JSON.parse(file.content);
      projects = projects.filter((p: any) => p.id !== id);

      await commitFile(
        DATA_PATH,
        JSON.stringify(projects, null, 2),
        `feat: remove project "${id}"`,
        file.sha
      );

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err: any) {
    console.error("[github api]", err);
    return res.status(500).json({ error: err.message });
  }
}
