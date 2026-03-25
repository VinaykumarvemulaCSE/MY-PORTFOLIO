import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { FiPlus, FiEdit, FiTrash, FiLogOut, FiX, FiUploadCloud, FiRefreshCw } from "react-icons/fi";

const ADMIN_EMAIL = "kumarvinay072007@gmail.com";
const ADMIN_PASS = "Vinay@123";

// Relative API endpoint — works locally (via Vite proxy) and on Vercel
const API_URL = "/api/github";

interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  live: boolean;
  liveLink: string;
  githubLink: string;
  status: "Live" | "In Progress" | "Coming Soon";
  coverImage: string;
  createdAt: string;
  updatedAt: string;
}

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem("portfolio_admin_auth") === "true");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"Live" | "In Progress" | "Coming Soon">("Live");
  const [tech, setTech] = useState<string[]>([]);
  const [techInput, setTechInput] = useState("");
  const [liveLink, setLiveLink] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [live, setLive] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState("");

  const loadProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      // Bypass cache so we always get the latest JSON
      const res = await fetch(`${API_URL}?t=${Date.now()}`);
      if (!res.ok) throw new Error(await res.text());
      setProjects(await res.json());
    } catch (err: any) {
      toast.error("Failed to load projects: " + err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { if (isAuthenticated) loadProjects(); }, [isAuthenticated, loadProjects]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
      setIsAuthenticated(true);
      localStorage.setItem("portfolio_admin_auth", "true");
      toast.success("Welcome back!");
    } else {
      toast.error("Invalid credentials");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("portfolio_admin_auth");
  };

  const resetForm = () => {
    setTitle(""); setDescription(""); setStatus("Live"); setTech([]);
    setTechInput(""); setLiveLink(""); setGithubLink(""); setLive(false);
    setImageFile(null); setPreviewImage(""); setIsEditing(null);
  };

  const handleEdit = (p: Project) => {
    setIsEditing(p.id);
    setTitle(p.title); setDescription(p.description); setStatus(p.status);
    setTech(p.tech || []); setLiveLink(p.liveLink || "");
    setGithubLink(p.githubLink || ""); setLive(p.live);
    setImageFile(null); setPreviewImage(p.coverImage || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project? This is permanent.")) return;
    try {
      const res = await fetch(API_URL, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error(await res.text());
      toast.success("Project deleted. Vercel rebuilding…");
      await loadProjects();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete");
    }
  };

  const handleAddTech = (e: React.KeyboardEvent<HTMLInputElement> | React.FocusEvent) => {
    if ("key" in e && e.key !== "Enter") return;
    e.preventDefault();
    const val = techInput.trim();
    if (val && !tech.includes(val)) setTech([...tech, val]);
    setTechInput("");
  };

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return toast.error("Title is required");
    setIsSaving(true);

    try {
      let imageBase64: string | undefined;
      let imageFilename: string | undefined;
      let imageMime: string | undefined;

      if (imageFile) {
        toast.loading("Encoding image…", { id: "img" });
        imageBase64 = await fileToBase64(imageFile);
        imageFilename = imageFile.name.replace(/\s+/g, "_");
        imageMime = imageFile.type;
        toast.dismiss("img");
      }

      toast.loading("Committing to GitHub…", { id: "commit" });

      const payload = {
        id: isEditing ?? undefined,
        title, description, tech, live, liveLink, githubLink, status,
        ...(imageBase64 ? { imageBase64, imageFilename, imageMime } : {}),
      };

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      toast.dismiss("commit");
      if (!res.ok) throw new Error(await res.text());

      toast.success(isEditing ? "Project updated! Vercel deploying…" : "Project deployed! Vercel rebuilding…");
      resetForm();
      await loadProjects();
    } catch (err: any) {
      toast.dismiss("img"); toast.dismiss("commit");
      toast.error(err.message || "Something went wrong");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-sm border-border/50 shadow-xl">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-bold font-heading text-gradient">Admin Access</CardTitle>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="border border-border/50 rounded-lg p-2 bg-secondary/20 space-y-1.5">
                <Input type="email" placeholder="Email" className="border-0 bg-transparent focus-visible:ring-0 shadow-none text-sm" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <div className="h-px bg-border/50 mx-2" />
                <Input type="password" placeholder="Password" className="border-0 bg-transparent focus-visible:ring-0 shadow-none text-sm" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full font-semibold">Login to Dashboard</Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background/50 p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8 pb-20">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border/30">
          <div>
            <h1 className="text-3xl font-heading font-bold">Admin <span className="text-gradient">Panel</span></h1>
            <p className="text-muted-foreground text-sm mt-1">Projects are committed directly to GitHub → Auto-deployed</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={loadProjects} disabled={isLoading} className="text-muted-foreground">
              <FiRefreshCw className={`mr-2 ${isLoading ? "animate-spin" : ""}`} size={14} /> Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout} className="text-muted-foreground">
              <FiLogOut className="mr-2" size={14} /> Logout
            </Button>
          </div>
        </div>

        {/* Form */}
        <Card className="border-primary/20 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              {isEditing ? <FiEdit className="text-primary" /> : <FiPlus className="text-primary" />}
              {isEditing ? `Editing: ${title}` : "Deploy New Project"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form id="project-form" onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* LEFT */}
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label className="font-semibold">Project Title *</Label>
                    <Input value={title} onChange={(e) => setTitle(e.target.value)} required className="glass" placeholder="Blood-Line" />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-semibold">Description *</Label>
                    <Textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={4} className="glass resize-none" placeholder="What did you build and why?" />
                  </div>

                  {/* Tech Stack — button-like tags */}
                  <div className="space-y-2">
                    <Label className="font-semibold">Tech Stack</Label>
                    <div className="p-3 bg-secondary/20 border border-border/50 rounded-xl space-y-3">
                      <div className="flex flex-wrap gap-2 min-h-[28px]">
                        {tech.map((t) => (
                          <span key={t} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-semibold group cursor-default">
                            {t}
                            <button type="button" onClick={() => setTech(tech.filter((x) => x !== t))}
                              className="text-primary/50 hover:text-primary transition-colors"><FiX size={11} /></button>
                          </span>
                        ))}
                        {tech.length === 0 && <span className="text-xs text-muted-foreground/60">No tech added yet</span>}
                      </div>
                      <Input value={techInput} onChange={(e) => setTechInput(e.target.value)}
                        onKeyDown={handleAddTech} onBlur={handleAddTech}
                        placeholder="Type tech and press Enter (e.g. React.js)"
                        className="h-9 text-sm bg-background/50" />
                    </div>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="space-y-5">
                  {/* Drag-and-drop image upload */}
                  <div className="space-y-2">
                    <Label className="font-semibold">Cover Screenshot</Label>
                    <div
                      className="border-2 border-dashed border-border/60 hover:border-primary/50 transition-colors rounded-xl overflow-hidden min-h-[160px] flex flex-col items-center justify-center text-center relative bg-secondary/10 cursor-pointer"
                      onClick={() => document.getElementById("img-upload")?.click()}
                    >
                      {previewImage || imageFile ? (
                        <div className="absolute inset-0 w-full h-full">
                          <img src={imageFile ? URL.createObjectURL(imageFile) : previewImage} alt="Preview" className="w-full h-full object-cover opacity-70" />
                          <div className="absolute inset-0 flex items-center justify-center bg-background/80 opacity-0 hover:opacity-100 transition-opacity">
                            <span className="text-sm font-semibold flex items-center gap-2"><FiUploadCloud /> Change Image</span>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                            <FiUploadCloud size={22} />
                          </div>
                          <p className="text-sm text-muted-foreground"><span className="font-semibold text-foreground">Click to upload</span><br />PNG, JPG, WebP — max 5 MB</p>
                        </>
                      )}
                      <input id="img-upload" type="file" accept="image/*" className="hidden"
                        onChange={(e) => { if (e.target.files?.[0]) { setImageFile(e.target.files[0]); setPreviewImage(""); } }} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="font-semibold">Status</Label>
                      <select value={status} onChange={(e) => setStatus(e.target.value as any)}
                        className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-primary/40 focus:outline-none">
                        <option value="Live">Live</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Coming Soon">Coming Soon</option>
                      </select>
                    </div>
                    <div className="space-y-2 flex flex-col justify-end">
                      <Label className="font-semibold">Is Live?</Label>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="live-toggle" checked={live} onChange={(e) => setLive(e.target.checked)}
                          className="w-4 h-4 accent-primary cursor-pointer" />
                        <label htmlFor="live-toggle" className="text-sm cursor-pointer">{live ? "Yes, it's live" : "Not deployed yet"}</label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="font-semibold">Live URL</Label>
                    <Input placeholder="https://..." value={liveLink} onChange={(e) => setLiveLink(e.target.value)} className="glass" />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-semibold">GitHub Repo URL</Label>
                    <Input placeholder="https://github.com/..." value={githubLink} onChange={(e) => setGithubLink(e.target.value)} className="glass" />
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="bg-secondary/10 border-t border-border/50 p-4 flex justify-end gap-3 rounded-b-xl">
            {isEditing && <Button type="button" variant="outline" onClick={resetForm} disabled={isSaving}>Cancel Edit</Button>}
            <Button type="submit" form="project-form" disabled={isSaving} className="px-8">
              {isSaving ? "Committing…" : isEditing ? "Save Changes" : "Deploy Project"}
            </Button>
          </CardFooter>
        </Card>

        {/* Projects List */}
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold font-heading">Manage Projects</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
              {projects.length} Total
            </span>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12"><div className="w-7 h-7 rounded-full border-2 border-primary border-t-transparent animate-spin" /></div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {projects.map((p) => (
                <Card key={p.id} className="group overflow-hidden border-border/50 hover:border-primary/30 transition-colors">
                  {p.coverImage ? (
                    <div className="w-full h-36 overflow-hidden relative">
                      <img src={p.coverImage} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                      <span className={`absolute bottom-2 left-2 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${p.status === "Live" ? "bg-primary/90 text-primary-foreground" : "bg-black/50 text-white"}`}>
                        {p.status}
                      </span>
                    </div>
                  ) : (
                    <div className="w-full h-36 bg-secondary/30 flex items-center justify-center">
                      <span className="text-muted-foreground/40 text-sm">No screenshot</span>
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1 truncate">{p.title}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{p.description}</p>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {(p.tech || []).slice(0, 4).map((t) => (
                        <span key={t} className="text-[10px] border border-border bg-secondary/30 px-1.5 py-0.5 rounded text-muted-foreground">{t}</span>
                      ))}
                      {(p.tech || []).length > 4 && (
                        <span className="text-[10px] border border-border bg-secondary/30 px-1.5 py-0.5 rounded text-muted-foreground">+{p.tech.length - 4}</span>
                      )}
                    </div>
                    <div className="flex items-center justify-end gap-1 pt-3 border-t border-border/50">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(p)} className="h-8 text-muted-foreground hover:text-primary gap-1.5">
                        <FiEdit size={13} /> Edit
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(p.id)} className="h-8 text-muted-foreground hover:text-destructive gap-1.5">
                        <FiTrash size={13} /> Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
              {projects.length === 0 && (
                <div className="col-span-full py-16 text-center border-2 border-dashed border-border/50 rounded-2xl">
                  <p className="text-muted-foreground">No projects yet. Deploy your first one above!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
