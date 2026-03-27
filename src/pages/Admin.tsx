import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { FiPlus, FiEdit, FiTrash, FiLogOut, FiX, FiUploadCloud, FiRefreshCw, FiEye, FiEyeOff, FiLock, FiMail } from "react-icons/fi";
import { TECH_ICONS, getAllTechNames } from "../constants/techIcons";

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
  gallery: string[];
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
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

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
  // Gallery: files selected but not yet uploaded
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  // Gallery: existing URLs (when editing a project that already has a gallery)
  const [existingGallery, setExistingGallery] = useState<string[]>([]);

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    
    // Tiny delay to make the login feel "validated" and perfect
    await new Promise(r => setTimeout(r, 800));

    if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
      setIsAuthenticated(true);
      localStorage.setItem("portfolio_admin_auth", "true");
      toast.success("Welcome back, Vinay!");
    } else {
      toast.error("Invalid credentials. Please check your email and password.");
    }
    setIsLoggingIn(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("portfolio_admin_auth");
  };

  const resetForm = () => {
    setTitle(""); setDescription(""); setStatus("Live"); setTech([]);
    setTechInput(""); setLiveLink(""); setGithubLink(""); setLive(false);
    setImageFile(null); setPreviewImage(""); setGalleryFiles([]); setExistingGallery([]);
    setIsEditing(null);
  };

  const handleEdit = (p: Project) => {
    setIsEditing(p.id);
    setTitle(p.title); setDescription(p.description); setStatus(p.status);
    setTech(p.tech || []); setLiveLink(p.liveLink || "");
    setGithubLink(p.githubLink || ""); setLive(p.live);
    setImageFile(null); setPreviewImage(p.coverImage || "");
    setGalleryFiles([]); setExistingGallery(p.gallery || []);
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

    const id = isEditing || `project-${Date.now()}`;

    try {
      let coverImageUrl = isEditing ? previewImage : "";
      if (imageFile) {
        toast.loading("Uploading cover image (1/1)...", { id: "img" });
        const b64 = await fileToBase64(imageFile);
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "upload_image",
            projectId: isEditing ?? id,
            imageBase64: b64,
            imageMime: imageFile.type,
            imageFilename: imageFile.name.replace(/\s+/g, "_"),
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to upload cover");
        coverImageUrl = data.url;
        toast.dismiss("img");
      }

      // 2) Upload gallery images sequentially
      const newGalleryUrls: string[] = [];
      let currentGalleryIdx = 1;
      for (const f of galleryFiles) {
        toast.loading(`Uploading gallery image (${currentGalleryIdx}/${galleryFiles.length})...`, { id: "gal" });
        const b64 = await fileToBase64(f);
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "upload_image",
            projectId: isEditing ?? id,
            imageBase64: b64,
            imageMime: f.type,
            imageFilename: `gallery/${f.name.replace(/\s+/g, "_")}`,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || `Failed to upload gallery image ${currentGalleryIdx}`);
        newGalleryUrls.push(data.url);
        currentGalleryIdx++;
      }
      toast.dismiss("gal");

      // Combine existing gallery with newly uploaded ones
      const finalGallery = [...existingGallery, ...newGalleryUrls];

      toast.loading("Committing project metadata to GitHub…", { id: "commit" });

      const payload = {
        action: "save_project",
        id: isEditing ?? id,
        title, description, tech, live, liveLink, githubLink, status,
        coverImage: coverImageUrl,
        gallery: finalGallery,
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
      <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px]" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Card className="glass border-border/40 shadow-2xl relative z-10 overflow-hidden rounded-[2rem]">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
            
            <CardHeader className="text-center pt-10 pb-6">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center mb-4 border border-primary/20">
                <FiLock className="text-primary" size={28} />
              </div>
              <CardTitle className="text-3xl font-bold font-heading">
                Admin <span className="text-primary">Portal</span>
              </CardTitle>
              <p className="text-muted-foreground text-sm mt-2">Secure access to your portfolio dashboard</p>
            </CardHeader>

            <form onSubmit={handleLogin} className="pb-8">
              <CardContent className="space-y-5 px-8">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Email Address</Label>
                  <div className="relative group">
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                    <Input 
                      type="email" 
                      placeholder="admin@example.com" 
                      className="h-12 pl-12 bg-background/40 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all rounded-xl" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      required 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Password</Label>
                  <div className="relative group">
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                    <Input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••" 
                      className="h-12 pl-12 pr-12 bg-background/40 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all rounded-xl" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      required 
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors p-1"
                    >
                      {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="px-8 pt-2">
                <Button 
                  type="submit" 
                  disabled={isLoggingIn}
                  className="w-full h-12 rounded-xl font-bold text-base bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-[0.98] relative overflow-hidden group"
                >
                  {isLoggingIn ? (
                    <div className="flex items-center gap-2">
                      <FiRefreshCw className="animate-spin" size={18} />
                      <span>Authenticating...</span>
                    </div>
                  ) : (
                    <span className="flex items-center gap-2">
                      Unlock Dashboard <FiLock size={16} className="group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
          <p className="text-center text-xs text-muted-foreground mt-8">
            &copy; {new Date().getFullYear()} Vinay Kumar Vemula. All rights reserved.
          </p>
        </motion.div>
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
                    <div className="flex items-center justify-between">
                      <Label className="font-semibold">Tech Stack</Label>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Select or type</span>
                    </div>
                    <div className="p-3 bg-secondary/10 border border-border/50 rounded-xl space-y-3">
                      <div className="flex flex-wrap gap-2 min-h-[28px]">
                        {tech.map((t) => {
                          const iconInfo = TECH_ICONS[t];
                          return (
                            <span key={t} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-background border border-border/50 text-foreground text-xs font-semibold group cursor-default shadow-sm border-primary/20">
                              {iconInfo && <iconInfo.icon size={12} style={{ color: iconInfo.color }} />}
                              {t}
                              <button type="button" onClick={() => setTech(tech.filter((x) => x !== t))}
                                className="text-muted-foreground hover:text-destructive transition-colors ml-1"><FiX size={11} /></button>
                            </span>
                          );
                        })}
                        {tech.length === 0 && <span className="text-xs text-muted-foreground/60">No tech added yet</span>}
                      </div>

                      <div className="relative">
                        <Input value={techInput} onChange={(e) => setTechInput(e.target.value)}
                          onKeyDown={handleAddTech}
                          placeholder="Search or add technology..."
                          className="h-9 text-sm bg-background/50 pr-8" />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                          <FiPlus size={14} />
                        </div>
                      </div>

                      {/* Tech Suggestions Grid */}
                      <div className="bg-background/40 rounded-lg p-2 max-h-40 overflow-y-auto custom-scrollbar border border-border/30">
                        <div className="flex flex-wrap gap-1.5">
                          {getAllTechNames()
                            .filter(t => !tech.includes(t) && t.toLowerCase().includes(techInput.toLowerCase()))
                            .map(t => {
                              const info = TECH_ICONS[t];
                              return (
                                <button
                                  key={t}
                                  type="button"
                                  onClick={() => { setTech([...tech, t]); setTechInput(""); }}
                                  className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-secondary/30 hover:bg-primary/20 border border-transparent hover:border-primary/30 text-[10px] font-medium transition-all"
                                >
                                  {info && <info.icon size={10} style={{ color: info.color }} />}
                                  {t}
                                </button>
                              );
                            })
                          }
                          {techInput && !getAllTechNames().includes(techInput) && !tech.includes(techInput) && (
                             <button
                               type="button"
                               onClick={() => { setTech([...tech, techInput]); setTechInput(""); }}
                               className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-primary/10 hover:bg-primary/20 border border-primary/30 text-[10px] font-bold text-primary transition-all"
                             >
                               Add "{techInput}"
                             </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="space-y-5">
                  {/* Cover Screenshot */}
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
                          <p className="text-sm text-muted-foreground"><span className="font-semibold text-foreground">Click to upload cover</span><br />PNG, JPG, WebP</p>
                        </>
                      )}
                      <input id="img-upload" type="file" accept="image/*" className="hidden"
                        onChange={(e) => { if (e.target.files?.[0]) { setImageFile(e.target.files[0]); setPreviewImage(""); } }} />
                    </div>
                  </div>

                  {/* Gallery Upload */}
                  <div className="space-y-2">
                    <Label className="font-semibold">Gallery Screenshots <span className="text-muted-foreground font-normal">(multiple)</span></Label>
                    <div
                      className="border-2 border-dashed border-border/50 hover:border-primary/40 transition-colors rounded-xl p-3 bg-secondary/10 cursor-pointer"
                      onClick={() => document.getElementById("gallery-upload")?.click()}
                    >
                      {/* Existing saved gallery */}
                      {existingGallery.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2">
                          {existingGallery.map((url, i) => (
                            <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden group">
                              <img src={url} className="w-full h-full object-cover" />
                              <button type="button"
                                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                                onClick={(e) => { e.stopPropagation(); setExistingGallery(existingGallery.filter((_, j) => j !== i)); }}>
                                <FiX className="text-white" size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      {/* New files selected */}
                      {galleryFiles.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {galleryFiles.map((f, i) => (
                            <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden group">
                              <img src={URL.createObjectURL(f)} className="w-full h-full object-cover" />
                              <button type="button"
                                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                                onClick={(e) => { e.stopPropagation(); setGalleryFiles(galleryFiles.filter((_, j) => j !== i)); }}>
                                <FiX className="text-white" size={14} />
                              </button>
                            </div>
                          ))}
                          <div className="w-16 h-16 rounded-lg border-2 border-dashed border-border/50 flex items-center justify-center text-muted-foreground">
                            <FiUploadCloud size={18} />
                          </div>
                        </div>
                      ) : (
                        existingGallery.length === 0 && (
                          <p className="text-sm text-muted-foreground text-center py-4">
                            <span className="font-semibold text-foreground">Click to add gallery images</span><br/>Select multiple screenshots
                          </p>
                        )
                      )}
                      <input id="gallery-upload" type="file" accept="image/*" multiple className="hidden"
                        onChange={(e) => { if (e.target.files) setGalleryFiles(Array.from(e.target.files)); }} />
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
