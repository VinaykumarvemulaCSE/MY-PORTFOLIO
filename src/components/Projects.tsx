"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { FiGithub, FiExternalLink, FiFolder, FiArrowRight, FiX, FiChevronLeft, FiChevronRight, FiImage } from "react-icons/fi";
import useEmblaCarousel from "embla-carousel-react";
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
  featured?: boolean;
  difficulty?: "Beginner" | "Intermediate" | "Advanced" | "Production Grade";
  timeInvestment?: string;
  caseStudy?: {
    problemTitle?: string;
    problem?: string;
    architectureTitle?: string;
    architecture?: string;
    challengesTitle?: string;
    challenges?: string[];
    metrics?: { label: string; value: string }[];
  };
}

export default function Projects() {
  const { ref, isVisible } = useScrollAnimation();
  const [emblaRef] = useEmblaCarousel({
    align: "start",
    dragFree: true,
    containScroll: "trimSnaps",
  });

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [modalView, setModalView] = useState<"gallery" | "details" | "case_study">("gallery");
  const [galleryIndex, setGalleryIndex] = useState(0);

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

  // Close lightbox on initial layout or Escape/Arrow key press
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeProject();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedProject, closeProject]);

  useEffect(() => {
    // Fetch from static JSON — served directly by Vite/Vercel, no backend needed
    fetch(`/data/projects.json?t=${Date.now()}`)
      .then((r) => r.json())
      .then((data: Project[]) => {
        // Show only the first 5 (FILO — already sorted newest-first by Admin)
        setProjects(data.slice(0, 5));
      })
      .catch((err) => console.error("Failed to load projects", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="projects" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-[100px]" />
      </div>

      <div ref={ref} className="max-w-6xl mx-auto relative px-4 md:px-8">
        {/* Header row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-3">
              Featured <span className="text-gradient">Projects</span>
            </h2>
            <div className="w-12 h-1 bg-primary rounded-full mb-4" />
            <p className="text-muted-foreground max-w-md">
              What I've been building lately — swipe to explore!
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 group text-sm font-medium hover:text-primary transition-colors"
            >
              View All Projects
              <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <FiArrowRight size={14} className="text-primary group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>
          </motion.div>
        </div>

        {loading ? (
          <div className="flex justify-center p-12">
            <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground border border-dashed border-border/50 rounded-2xl">
            No projects yet — add some in the{" "}
            <Link href="/admin" className="text-primary underline">Admin panel</Link>.
          </div>
        ) : (
          // Embla horizontal carousel
          <div
            className="overflow-hidden cursor-grab active:cursor-grabbing -mx-4 md:-mx-8 px-4 md:px-8 pb-10"
            ref={emblaRef}
          >
            <div className="flex gap-6">
              {projects.map((project, i) => (
                <motion.article
                  key={project.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.08 * (i + 1), duration: 0.45 }}
                  className="flex-[0_0_85%] md:flex-[0_0_44%] lg:flex-[0_0_31%] min-w-0 rounded-2xl glass border border-border/50 hover:border-primary/30 flex flex-col group relative overflow-hidden card-hover"
                >
                  {/* Screenshot - Click for Gallery */}
                  <div 
                    className="w-full h-44 overflow-hidden relative cursor-pointer"
                    onClick={() => openProject(project, "gallery")}
                  >
                  {project.coverImage ? (
                    <>
                      <Image
                        src={project.coverImage}
                        alt={project.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />
                      
                      {/* Top Badges */}
                      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                        {project.featured ? (
                          <span className="inline-flex items-center gap-1 bg-amber-500/90 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-md backdrop-blur-sm">
                            ★ Featured
                          </span>
                        ) : <span />}

                        {getImages(project).length > 1 && (
                          <div className="flex items-center gap-1 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm">
                            <FiImage size={10} /> {getImages(project).length}
                          </div>
                        )}
                      </div>

                      {/* Difficulty / Time badge on bottom of thumbnail */}
                      <div className="absolute bottom-2 left-2.5 flex items-center gap-1.5 pointer-events-none">
                        <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-mono px-2 py-0.5 rounded-md border border-white/10">
                          {project.difficulty || "Production Grade"}
                        </span>
                        {project.timeInvestment && (
                          <span className="bg-black/60 backdrop-blur-md text-white/90 text-[10px] font-mono px-2 py-0.5 rounded-md border border-white/10">
                            ⏱ {project.timeInvestment}
                          </span>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-44 bg-secondary/30 flex items-center justify-center">
                      <FiFolder size={28} className="text-primary/40" />
                    </div>
                  )}
                  </div>

                  {/* Hover glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  {/* Content - Click for Details */}
                  <div 
                    className="relative flex flex-col flex-1 p-6 cursor-pointer"
                    onClick={() => openProject(project, "details")}
                  >
                    {!project.coverImage && <div className="mb-4"><FiFolder className="text-primary" size={26} /></div>}

                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-heading font-semibold text-foreground text-lg group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                      {project.status && (
                        <span className={`text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full shrink-0 ${
                          project.status === "Live" ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                        }`}>
                          {project.status}
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed mb-6 line-clamp-2 break-words">
                      {project.description}
                    </p>

                    {/* Tech Stack with Icons and Colors */}
                    <div className="flex items-center justify-between mt-auto gap-2">
                       <div className="flex flex-wrap gap-1.5">
                        {(project.tech || []).slice(0, 4).map((t) => {
                          const iconInfo = TECH_ICONS[t];
                          const Icon = iconInfo?.icon;
                          return (
                            <span 
                              key={t} 
                              className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-md border border-border/50 bg-secondary/30 text-foreground"
                              title={t}
                            >
                              {Icon && (
                                <Icon 
                                  size={11} 
                                  style={{ color: iconInfo.color || "currentColor" }} 
                                />
                              )}
                              <span>{t}</span>
                            </span>
                          );
                        })}
                        {(project.tech || []).length > 4 && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-border/50 bg-secondary/30 text-muted-foreground">
                            +{(project.tech || []).length - 4}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {(project.liveLink || project.githubLink) && (
                      <div className="flex gap-3 mt-5 pt-5 border-t border-border/40 w-full" onClick={(e) => e.stopPropagation()}>
                        {project.liveLink && (
                          <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 py-2 rounded-lg text-sm font-bold transition-all shadow-lg shadow-primary/20 z-10">
                            <FiExternalLink size={16} /> Live Demo
                          </a>
                        )}
                        {project.githubLink && (
                          <a href={project.githubLink} target="_blank" rel="noopener noreferrer" aria-label="View Project on GitHub" className={`flex items-center justify-center gap-2 bg-secondary/30 hover:bg-secondary border border-border/50 text-foreground py-2 px-3 rounded-lg text-sm font-semibold transition-colors z-10 ${!project.liveLink ? 'flex-1' : ''}`}>
                            <FiGithub size={16} /> {project.liveLink ? '' : 'GitHub'}
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </motion.article>
              ))}
            </div>
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
                    <button 
                      onClick={() => setModalView("case_study")}
                      className={`text-xs font-semibold uppercase tracking-wider px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${modalView === "case_study" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "bg-secondary/50 text-muted-foreground hover:bg-secondary"}`}
                    >
                      <span>Case Study</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-500/80 text-white font-mono">Deep Dive</span>
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
                          <div className="relative w-full max-w-5xl h-[60vh] md:h-[70vh]">
                            <Image
                              src={images[galleryIndex]}
                              alt={`${selectedProject.title} screenshot ${galleryIndex + 1}`}
                              fill
                              className="object-contain drop-shadow-2xl"
                              sizes="(max-width: 1200px) 100vw, 1200px"
                              priority
                            />
                          </div>
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
                              className={`relative w-20 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all duration-300 ${i === galleryIndex ? "border-primary scale-110 shadow-lg shadow-primary/20" : "border-transparent opacity-40 hover:opacity-100"}`}
                            >
                              <Image src={img} alt={`thumb-${i}`} fill className="object-cover" sizes="80px" />
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
                  ) : modalView === "details" ? (
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
                  ) : (
                    <motion.div
                      key="case_study"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.3 }}
                      className="max-w-4xl mx-auto px-6 py-10 md:py-16 space-y-10"
                    >
                      {/* Key Metrics Banner */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {(selectedProject.caseStudy?.metrics || [
                          { label: "Request Latency", value: "< 250ms" },
                          { label: "User Dashboards", value: "2 Dual Roles" },
                          { label: "Real-Time Sync", value: "Firestore" },
                          { label: "Payment Sandbox", value: "Razorpay" }
                        ]).map((m, i) => (
                          <div key={i} className="p-4 rounded-2xl glass border border-primary/20 text-center">
                            <span className="text-xl md:text-2xl font-bold font-mono text-primary block">{m.value}</span>
                            <span className="text-[11px] font-mono text-muted-foreground uppercase">{m.label}</span>
                          </div>
                        ))}
                      </div>

                      {/* Problem Statement */}
                      <div className="p-6 md:p-8 rounded-3xl glass border border-border/60 space-y-3">
                        <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-500 uppercase tracking-wider">
                          <span>01</span> • Problem Statement
                        </div>
                        <h4 className="text-xl font-heading font-bold text-foreground">
                          {selectedProject.caseStudy?.problemTitle || "Problem Statement"}
                        </h4>
                        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                          {selectedProject.caseStudy?.problem || 
                            "In emergency situations, finding compatible blood donors quickly is hindered by fragmented phone calls, unverified donor registries, and lack of real-time location mapping. Every minute of delay introduces severe risk to patient survival."}
                        </p>
                      </div>

                      {/* Technical Architecture */}
                      <div className="p-6 md:p-8 rounded-3xl glass border border-border/60 space-y-3">
                        <div className="flex items-center gap-2 text-xs font-mono font-bold text-primary uppercase tracking-wider">
                          <span>02</span> • Technical Architecture
                        </div>
                        <h4 className="text-xl font-heading font-bold text-foreground">
                          {selectedProject.caseStudy?.architectureTitle || "Technical Architecture"}
                        </h4>
                        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                          {selectedProject.caseStudy?.architecture || 
                            "Built on React with Tailwind CSS and backed by Firebase Firestore real-time listeners (`onSnapshot`). Separates concerns into a Receiver Dashboard (urgent blood requests & status tracker) and a Donor Dashboard (geolocation-based request discovery & quick dispatch)."}
                        </p>
                      </div>

                      {/* Engineering Challenges & Overcoming */}
                      <div className="p-6 md:p-8 rounded-3xl glass border border-border/60 space-y-3">
                        <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-500 uppercase tracking-wider">
                          <span>03</span> • Challenges Overcome
                        </div>
                        <h4 className="text-xl font-heading font-bold text-foreground">
                          {selectedProject.caseStudy?.challengesTitle || "Challenges Overcome"}
                        </h4>
                        <ul className="space-y-2.5 text-sm text-muted-foreground">
                          {(selectedProject.caseStudy?.challenges || [
                            "Preventing race conditions when multiple donors accept the same urgent request concurrently via Firestore transactions.",
                            "Optimizing mobile viewport responsiveness for high-stress emergency workflows with zero confusing clutter.",
                            "Simulating transactional integrity with Razorpay test mode payment hooks."
                          ]).map((ch, idx) => (
                            <li key={idx} className="flex items-start gap-2.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                              <span>{ch}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Links CTA */}
                      <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-border/30">
                        {selectedProject.liveLink && (
                          <a href={selectedProject.liveLink} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all glow-sm">
                            <FiExternalLink size={16} /> Open Live Application
                          </a>
                        )}
                        {selectedProject.githubLink && (
                          <a href={selectedProject.githubLink} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 glass border border-border/60 text-foreground py-3.5 rounded-xl font-semibold text-sm hover:border-primary/40 transition-all">
                            <FiGithub size={16} /> Inspect Source Code
                          </a>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </section>
  );
}
