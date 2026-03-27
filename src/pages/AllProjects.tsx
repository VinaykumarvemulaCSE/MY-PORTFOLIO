import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { FiGithub, FiExternalLink, FiFolder, FiArrowLeft, FiX, FiChevronLeft, FiChevronRight, FiImage } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { TECH_ICONS } from "../constants/techIcons";

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
  const [modalView, setModalView] = useState<"gallery" | "details">("gallery");
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

  const openProject = (p: Project, view: "gallery" | "details" = "gallery") => {
    setSelectedProject(p);
    setModalView(view);
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
            A comprehensive list of things I've built. Click details to see descriptions and gallery to see screenshots.
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
                  className="card-hover rounded-2xl glass border border-border/50 hover:border-primary/30 flex flex-col group relative overflow-hidden"
                >
                  {/* Screenshot - Click for Gallery */}
                  <div 
                    className="w-full h-44 overflow-hidden relative cursor-pointer"
                    onClick={() => openProject(project, "gallery")}
                  >
                  {project.coverImage ? (
                    <>
                      <img src={project.coverImage} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
                      {/* Gallery count badge */}
                      {images.length > 1 && (
                        <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full">
                          <FiImage size={10} /> {images.length}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-44 bg-secondary/30 flex items-center justify-center">
                      <FiFolder size={28} className="text-primary/40" />
                    </div>
                  )}
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  {/* Content - Click for Details */}
                  <div 
                    className="relative flex-1 flex flex-col p-6 cursor-pointer"
                    onClick={() => openProject(project, "details")}
                  >
                    {!project.coverImage && <div className="mb-4"><FiFolder className="text-primary" size={26} /></div>}

                    <h3 className="font-heading font-semibold text-foreground mb-2 text-lg group-hover:text-primary transition-colors">{project.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-6 line-clamp-3 break-words">{project.description}</p>

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

                    {/* Action Buttons */}
                    {(project.liveLink || project.githubLink) && (
                      <div className="flex gap-3 mt-5 pt-5 border-t border-border/40 w-full" onClick={(e) => e.stopPropagation()}>
                        {project.liveLink && (
                          <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 py-2 rounded-lg text-sm font-bold transition-all z-10 shadow-lg shadow-primary/20">
                            <FiExternalLink size={16} /> Live Demo
                          </a>
                        )}
                        {project.githubLink && (
                          <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className={`flex items-center justify-center gap-2 bg-secondary/30 hover:bg-secondary border border-border/50 text-foreground py-2 px-3 rounded-lg text-sm font-semibold transition-colors z-10 ${!project.liveLink ? 'flex-1' : ''}`}>
                            <FiGithub size={16} /> {project.liveLink ? '' : 'GitHub'}
                          </a>
                        )}
                      </div>
                    )}
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
              className="fixed inset-0 z-50 flex flex-col bg-background/80 backdrop-blur-xl"
              onClick={closeProject}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 md:px-8 md:py-6 border-b border-border/40 shrink-0 bg-background/50 backdrop-blur-sm" onClick={(e) => e.stopPropagation()}>
                <div className="flex-1">
                  <h2 className="text-xl md:text-2xl font-heading font-bold text-foreground">{selectedProject.title}</h2>
                  <div className="flex items-center gap-4 mt-2">
                    <button 
                      onClick={() => setModalView("gallery")}
                      className={`text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full transition-all ${modalView === "gallery" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "bg-secondary/50 text-muted-foreground hover:bg-secondary"}`}
                    >
                      Gallery
                    </button>
                    <button 
                      onClick={() => setModalView("details")}
                      className={`text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full transition-all ${modalView === "details" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "bg-secondary/50 text-muted-foreground hover:bg-secondary"}`}
                    >
                      Details
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="hidden md:flex items-center gap-3 mr-4 pr-4 border-r border-border/40">
                    {selectedProject.githubLink && (
                      <a href={selectedProject.githubLink} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-secondary/30 text-foreground hover:text-primary hover:bg-secondary transition-all" title="View Source">
                        <FiGithub size={18} />
                      </a>
                    )}
                    {selectedProject.liveLink && (
                      <a href={selectedProject.liveLink} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-secondary/30 text-foreground hover:text-primary hover:bg-secondary transition-all" title="Live Demo">
                        <FiExternalLink size={18} />
                      </a>
                    )}
                  </div>
                  <button onClick={closeProject} className="p-2.5 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
                    <FiX size={22} />
                  </button>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <AnimatePresence mode="wait">
                  {modalView === "gallery" ? (
                    <motion.div
                      key="gallery"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                      className="h-full flex flex-col"
                    >
                      {/* Gallery Slider */}
                      <div className="flex-1 flex items-center justify-center relative overflow-hidden p-4 md:p-8">
                        {images.length > 0 ? (
                          <motion.img
                            key={galleryIndex}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            src={images[galleryIndex]}
                            alt={`${selectedProject.title} screenshot ${galleryIndex + 1}`}
                            className="max-w-full max-h-[70vh] object-contain rounded-2xl shadow-2xl border border-border/40"
                          />
                        ) : (
                          <div className="flex flex-col items-center gap-4 text-muted-foreground opacity-50">
                            <FiImage size={48} />
                            <p>No screenshots available for this project.</p>
                          </div>
                        )}

                        {images.length > 1 && (
                          <>
                            <button onClick={prev} className="absolute left-4 md:left-8 p-4 rounded-full bg-background/80 border border-border/50 hover:border-primary/40 text-foreground hover:text-primary transition-all shadow-xl backdrop-blur-sm group">
                              <FiChevronLeft size={24} className="group-hover:-translate-x-0.5 transition-transform" />
                            </button>
                            <button onClick={next} className="absolute right-4 md:right-8 p-4 rounded-full bg-background/80 border border-border/50 hover:border-primary/40 text-foreground hover:text-primary transition-all shadow-xl backdrop-blur-sm group">
                              <FiChevronRight size={24} className="group-hover:translate-x-0.5 transition-transform" />
                            </button>
                          </>
                        )}
                      </div>

                      {/* Thumbnail Strip (Desktop) */}
                      {images.length > 1 && (
                        <div className="hidden md:flex gap-3 p-6 overflow-x-auto border-t border-border/20 justify-center bg-background/30">
                          {images.map((img, i) => (
                            <button
                              key={i}
                              onClick={() => setGalleryIndex(i)}
                              className={`w-20 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all duration-300 ${i === galleryIndex ? "border-primary scale-110 shadow-lg shadow-primary/20" : "border-transparent opacity-40 hover:opacity-100"}`}
                            >
                              <img src={img} alt={`thumb-${i}`} className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      )}
                      
                      {/* Mobile Caption */}
                      <div className="md:hidden bg-background/50 p-4 border-t border-border/20">
                         <p className="text-sm text-center text-muted-foreground italic">
                            Screenshot {galleryIndex + 1} of {images.length}
                         </p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="details"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.3 }}
                      className="max-w-4xl mx-auto px-6 py-10 md:py-16"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                        {/* Description Section */}
                        <div className="md:col-span-12 space-y-10">
                          <section className="space-y-4">
                            <h3 className="text-sm uppercase tracking-widest text-primary font-bold px-1">Project Overview</h3>
                            <div className="glass p-6 md:p-8 rounded-3xl border border-primary/30 shadow-2xl relative overflow-hidden group/desc group-hover/modal:scale-[1.01] transition-transform">
                              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
                              <p className="text-lg md:text-xl text-foreground leading-relaxed font-light whitespace-pre-wrap relative z-10">
                                {selectedProject.description}
                              </p>
                            </div>
                          </section>

                          <section className="space-y-4">
                            <h3 className="text-sm uppercase tracking-widest text-primary font-bold px-1">Tech Stack</h3>
                            <div className="flex flex-wrap gap-3">
                              {(selectedProject.tech || []).map((t) => {
                                const info = TECH_ICONS[t];
                                return (
                                  <span 
                                    key={t} 
                                    className="inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl border border-border/50 bg-background/40 hover:bg-background/60 hover:border-primary/30 text-foreground transition-all shadow-sm group"
                                  >
                                    {info && <info.icon size={18} style={{ color: info.color }} className="group-hover:scale-110 transition-transform" />}
                                    <span className="text-sm font-semibold">{t}</span>
                                  </span>
                                );
                              })}
                            </div>
                          </section>

                          {/* Quick Links Section */}
                          <div className="flex flex-col sm:flex-row gap-4 pt-10 border-t border-border/20">
                            {selectedProject.liveLink && (
                              <a href={selectedProject.liveLink} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2.5 bg-primary text-primary-foreground hover:bg-primary/90 py-4 rounded-2xl text-base font-bold transition-all shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]">
                                <FiExternalLink size={20} /> Launch Live Demo
                              </a>
                            )}
                            {selectedProject.githubLink && (
                              <a href={selectedProject.githubLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2.5 bg-secondary/50 hover:bg-secondary border border-border/40 text-foreground py-4 px-8 rounded-2xl text-base font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]">
                                <FiGithub size={20} /> View Github Repository
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}
