import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { FiGithub, FiExternalLink, FiFolder, FiArrowLeft, FiX, FiChevronLeft, FiChevronRight, FiImage } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";

interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  live: boolean;
  liveLink?: string;
  githubLink?: string;
  status: string;
  coverImage?: string;
  gallery?: string[];
}

export default function AllProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [galleryIndex, setGalleryIndex] = useState(0);

  useEffect(() => {
    fetch(`/data/projects.json?t=${Date.now()}`)
      .then((r) => r.json())
      .then((data: Project[]) => setProjects(data))
      .catch((err) => console.error("Failed to load projects", err))
      .finally(() => setLoading(false));
  }, []);

  // Build the full images list for a project (cover + gallery)
  const getImages = (p: Project) => {
    const imgs: string[] = [];
    if (p.coverImage) imgs.push(p.coverImage);
    (p.gallery || []).forEach((g) => imgs.push(g));
    return imgs;
  };

  const openProject = (p: Project) => {
    setSelectedProject(p);
    setGalleryIndex(0);
    document.body.style.overflow = "hidden";
  };

  const closeProject = useCallback(() => {
    setSelectedProject(null);
    document.body.style.overflow = "";
  }, []);

  const prev = () => {
    if (!selectedProject) return;
    const imgs = getImages(selectedProject);
    setGalleryIndex((i) => (i - 1 + imgs.length) % imgs.length);
  };

  const next = () => {
    if (!selectedProject) return;
    const imgs = getImages(selectedProject);
    setGalleryIndex((i) => (i + 1) % imgs.length);
  };

  // Close lightbox on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeProject();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedProject, closeProject]);

  return (
    <div className="min-h-screen bg-background relative pt-24 pb-16 px-4 md:px-8">
      <Helmet>
        <title>All Projects | Vinay Kumar Vemula</title>
        <meta name="description" content="All projects built by Vinay Kumar Vemula — web apps, tools and more." />
      </Helmet>

      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto relative">
        <div className="mb-12">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
            <FiArrowLeft /> Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground">
            All <span className="text-gradient">Projects</span>
          </h1>
          <p className="text-muted-foreground mt-4 max-w-xl">
            A comprehensive list of things I've built. Click any card to view screenshots.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground border-2 border-dashed border-border/50 rounded-2xl">
            No projects added yet.{" "}
            <Link to="/admin" className="text-primary underline">Add via Admin panel</Link>.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, i) => {
              const images = getImages(project);
              return (
                <motion.article
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.45 }}
                  className="card-hover rounded-2xl glass border border-border/50 hover:border-primary/30 flex flex-col group relative overflow-hidden cursor-pointer"
                  onClick={() => openProject(project)}
                >
                  {project.coverImage ? (
                    <div className="w-full h-44 overflow-hidden relative">
                      <img src={project.coverImage} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
                      {/* Gallery count badge */}
                      {images.length > 1 && (
                        <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full">
                          <FiImage size={10} /> {images.length}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-20 bg-secondary/30 flex items-center justify-center">
                      <FiFolder size={28} className="text-primary/40" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  <div className="relative flex-1 flex flex-col p-6">
                    <div className="flex items-center justify-between mb-4">
                      {!project.coverImage && <FiFolder className="text-primary" size={26} />}
                      <div className="flex gap-2 ml-auto" onClick={(e) => e.stopPropagation()}>
                        {project.githubLink && (
                          <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors z-10">
                            <FiGithub size={18} />
                          </a>
                        )}
                        {project.liveLink && (
                          <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors z-10">
                            <FiExternalLink size={18} />
                          </a>
                        )}
                      </div>
                    </div>

                    <h3 className="font-heading font-semibold text-foreground mb-2 text-lg group-hover:text-primary transition-colors">{project.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1 line-clamp-3">{project.description}</p>

                    <div className="flex items-center justify-between mt-auto gap-2">
                      <div className="flex flex-wrap gap-1.5">
                        {(project.tech || []).slice(0, 3).map((t) => (
                          <span key={t} className="text-[10px] uppercase font-mono px-2 py-0.5 rounded border border-border/50 bg-secondary/30 text-muted-foreground">{t}</span>
                        ))}
                        {(project.tech || []).length > 3 && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-border/50 bg-secondary/30 text-muted-foreground">+{project.tech.length - 3}</span>
                        )}
                      </div>
                      {project.status && (
                        <span className={`text-[10px] uppercase font-mono font-bold px-2.5 py-0.5 rounded-full shrink-0 ${project.status === "Live" ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>
                          {project.status}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedProject && (() => {
          const images = getImages(selectedProject);
          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex flex-col bg-background/95 backdrop-blur-sm"
              onClick={closeProject}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 md:p-6 border-b border-border/40 shrink-0" onClick={(e) => e.stopPropagation()}>
                <div>
                  <h2 className="text-xl font-heading font-bold">{selectedProject.title}</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {images.length > 1 ? `${galleryIndex + 1} / ${images.length} screenshots` : "1 screenshot"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {selectedProject.githubLink && (
                    <a href={selectedProject.githubLink} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" onClick={(e) => e.stopPropagation()}>
                      <FiGithub size={20} />
                    </a>
                  )}
                  {selectedProject.liveLink && (
                    <a href={selectedProject.liveLink} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" onClick={(e) => e.stopPropagation()}>
                      <FiExternalLink size={20} />
                    </a>
                  )}
                  <button onClick={closeProject} className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
                    <FiX size={20} />
                  </button>
                </div>
              </div>

              {/* Main image */}
              <div className="flex-1 flex items-center justify-center relative overflow-hidden p-4" onClick={(e) => e.stopPropagation()}>
                {images.length > 0 ? (
                  <motion.img
                    key={galleryIndex}
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    src={images[galleryIndex]}
                    alt={`${selectedProject.title} screenshot ${galleryIndex + 1}`}
                    className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
                  />
                ) : (
                  <div className="text-muted-foreground">No screenshots available</div>
                )}

                {images.length > 1 && (
                  <>
                    <button onClick={prev} className="absolute left-4 p-3 rounded-full bg-background/80 border border-border/50 hover:border-primary/40 text-foreground hover:text-primary transition-all shadow-lg">
                      <FiChevronLeft size={22} />
                    </button>
                    <button onClick={next} className="absolute right-4 p-3 rounded-full bg-background/80 border border-border/50 hover:border-primary/40 text-foreground hover:text-primary transition-all shadow-lg">
                      <FiChevronRight size={22} />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail strip */}
              {images.length > 1 && (
                <div className="shrink-0 flex gap-2 p-4 overflow-x-auto border-t border-border/40 justify-center" onClick={(e) => e.stopPropagation()}>
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setGalleryIndex(i)}
                      className={`w-14 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${i === galleryIndex ? "border-primary scale-105" : "border-border/40 opacity-60 hover:opacity-100"}`}
                    >
                      <img src={img} alt={`thumb-${i}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Description strip */}
              <div className="shrink-0 px-6 py-4 border-t border-border/40" onClick={(e) => e.stopPropagation()}>
                <p className="text-sm text-muted-foreground line-clamp-2 max-w-3xl mx-auto text-center">{selectedProject.description}</p>
                <div className="flex flex-wrap gap-1.5 justify-center mt-2">
                  {(selectedProject.tech || []).map((t) => (
                    <span key={t} className="text-[10px] uppercase font-mono px-2 py-0.5 rounded border border-border/50 bg-secondary/30 text-muted-foreground">{t}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}
