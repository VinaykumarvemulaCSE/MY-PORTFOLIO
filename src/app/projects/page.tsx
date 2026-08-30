"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { FiGithub, FiExternalLink, FiFolder, FiSearch, FiX, FiChevronLeft, FiChevronRight, FiImage, FiArrowLeft } from "react-icons/fi";
import { TECH_ICONS } from "@/constants/techIcons";

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
    problem?: string;
    architecture?: string;
    challenges?: string[];
    metrics?: { label: string; value: string }[];
  };
}

const CATEGORIES = ["All", "Full Stack", "Frontend", "AI / ML", "Tools"];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [modalView, setModalView] = useState<"gallery" | "details" | "case_study">("gallery");
  const [galleryIndex, setGalleryIndex] = useState(0);

  useEffect(() => {
    fetch(`/data/projects.json?t=${Date.now()}`)
      .then((r) => r.json())
      .then((data: Project[]) => {
        setProjects(data);
      })
      .catch((err) => console.error("Failed to load projects", err))
      .finally(() => setLoading(false));
  }, []);

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

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeProject();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedProject, closeProject]);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            p.tech.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      
      let matchesCategory = true;
      if (activeCategory !== "All") {
        const techLower = p.tech.map(t => t.toLowerCase());
        if (activeCategory === "Frontend") {
          matchesCategory = techLower.includes("react") || techLower.includes("next.js") || techLower.includes("vue") || techLower.includes("tailwind");
        } else if (activeCategory === "Full Stack") {
          matchesCategory = (techLower.includes("node") || techLower.includes("firebase") || techLower.includes("express")) && techLower.includes("react");
        } else if (activeCategory === "AI / ML") {
          matchesCategory = techLower.includes("python") || techLower.includes("tensorflow") || techLower.includes("ai");
        } else if (activeCategory === "Tools") {
          matchesCategory = techLower.includes("docker") || techLower.includes("git") || techLower.includes("vercel");
        }
      }

      return matchesSearch && matchesCategory;
    });
  }, [projects, searchQuery, activeCategory]);

  return (
    <div className="min-h-screen bg-background pt-24 pb-16 px-4 md:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Breadcrumb & Navigation */}
        <div className="mb-8">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-muted-foreground mb-6">
            <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
              Home
            </Link>
            <span className="text-border">/</span>
            <span className="text-foreground font-semibold">Projects Archive</span>
          </nav>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4"
          >
            Project <span className="text-gradient">Archive</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg max-w-2xl"
          >
            A comprehensive list of things I've built, ranging from full-stack applications to AI models and open-source tools.
          </motion.p>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap items-center gap-2"
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat 
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
                    : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground border border-border/50"
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="relative w-full md:w-72"
          >
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search projects by title or tech..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-secondary/30 border border-border/50 rounded-2xl focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-sm placeholder:text-muted-foreground"
            />
          </motion.div>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="flex justify-center p-20">
            <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          </div>
        ) : filteredProjects.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-secondary/20 rounded-3xl border border-dashed border-border/50"
          >
            <FiSearch className="mx-auto text-4xl text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-xl font-heading font-semibold text-foreground mb-2">No projects found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
            <button 
              onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
              className="mt-6 text-primary hover:underline text-sm font-medium"
            >
              Clear all filters
            </button>
          </motion.div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredProjects.map((project, i) => (
                <motion.article
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="rounded-3xl glass border border-border/50 hover:border-primary/30 flex flex-col group relative overflow-hidden card-hover"
                >
                  {/* Screenshot - Click for Gallery */}
                  <div 
                    className="w-full h-52 overflow-hidden relative cursor-pointer"
                    onClick={() => openProject(project, "gallery")}
                  >
                  {project.coverImage ? (
                    <>
                      <Image
                        src={project.coverImage}
                        alt={project.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />
                      
                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                        {project.featured ? (
                          <span className="inline-flex items-center gap-1 bg-amber-500/90 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-md backdrop-blur-sm">
                            ★ Featured
                          </span>
                        ) : <span />}

                        {getImages(project).length > 1 && (
                          <div className="flex items-center gap-1.5 bg-black/70 backdrop-blur-md text-white text-xs font-medium px-2.5 py-1 rounded-full border border-white/10">
                            <FiImage size={12} /> {getImages(project).length}
                          </div>
                        )}
                      </div>

                      {/* Difficulty / Time badge on bottom of thumbnail */}
                      <div className="absolute bottom-2.5 left-3 flex items-center gap-1.5 pointer-events-none">
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
                    <div className="w-full h-full bg-secondary/50 flex items-center justify-center">
                      <FiFolder size={36} className="text-primary/40" />
                    </div>
                  )}
                  </div>

                  {/* Content - Click for Details */}
                  <div 
                    className="relative flex flex-col flex-1 p-6 cursor-pointer"
                    onClick={() => openProject(project, "details")}
                  >
                    {!project.coverImage && <div className="mb-4"><FiFolder className="text-primary" size={26} /></div>}

                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-heading font-bold text-foreground text-xl group-hover:text-primary transition-colors">
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

                    <p className="text-sm text-muted-foreground leading-relaxed mb-6 line-clamp-2">
                      {project.description}
                    </p>

                    {/* Tech Stack with Icons and Colors */}
                    <div className="flex items-center justify-between mt-auto pt-4 gap-2 border-t border-border/30">
                       <div className="flex flex-wrap gap-1.5">
                        {(project.tech || []).slice(0, 4).map((t) => {
                          const iconInfo = TECH_ICONS[t];
                          const Icon = iconInfo?.icon;
                          return (
                            <span 
                              key={t} 
                              className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-md border border-border/50 bg-secondary/40 text-foreground font-medium"
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
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-border/50 bg-secondary/40 text-muted-foreground font-medium">
                            +{(project.tech || []).length - 4}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Modal - Reused logic from Projects.tsx but with next/image */}
      <AnimatePresence>
        {selectedProject && (() => {
          const images = getImages(selectedProject);
          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex flex-col bg-background/90 backdrop-blur-xl"
              onClick={closeProject}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 md:px-8 md:py-6 border-b border-border/40 shrink-0 bg-background/50 backdrop-blur-sm" onClick={(e) => e.stopPropagation()}>
                <div className="flex-1">
                  <h2 className="text-xl md:text-2xl font-heading font-bold text-foreground">{selectedProject.title}</h2>
                  <div className="flex items-center gap-4 mt-2">
                    <button 
                      onClick={() => setModalView("gallery")}
                      className={`text-xs font-semibold uppercase tracking-wider px-4 py-2 rounded-full transition-all ${modalView === "gallery" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "bg-secondary/50 text-muted-foreground hover:bg-secondary"}`}
                    >
                      Gallery
                    </button>
                    <button 
                      onClick={() => setModalView("details")}
                      className={`text-xs font-semibold uppercase tracking-wider px-4 py-2 rounded-full transition-all ${modalView === "details" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "bg-secondary/50 text-muted-foreground hover:bg-secondary"}`}
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
                      <a href={selectedProject.githubLink} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-secondary/30 text-foreground hover:text-primary hover:bg-secondary transition-all">
                        <FiGithub size={20} />
                      </a>
                    )}
                    {selectedProject.liveLink && (
                      <a href={selectedProject.liveLink} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-secondary/30 text-foreground hover:text-primary hover:bg-secondary transition-all">
                        <FiExternalLink size={20} />
                      </a>
                    )}
                  </div>
                  <button onClick={closeProject} className="p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
                    <FiX size={24} />
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
                              <FiChevronLeft size={28} className="group-hover:-translate-x-1 transition-transform" />
                            </button>
                            <button onClick={next} className="absolute right-4 md:right-8 p-4 rounded-full bg-background/80 border border-border/50 hover:border-primary/40 text-foreground hover:text-primary transition-all shadow-xl backdrop-blur-sm group">
                              <FiChevronRight size={28} className="group-hover:translate-x-1 transition-transform" />
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
                              className={`relative w-24 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all duration-300 ${i === galleryIndex ? "border-primary scale-110 shadow-lg shadow-primary/20" : "border-transparent opacity-40 hover:opacity-100"}`}
                            >
                              <Image src={img} alt={`thumb-${i}`} fill className="object-cover" sizes="96px" />
                            </button>
                          ))}
                        </div>
                      )}
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
                        <div className="md:col-span-12 space-y-10">
                          <section className="space-y-4">
                            <h3 className="text-sm uppercase tracking-widest text-primary font-bold px-1">Project Overview</h3>
                            <div className="glass p-6 md:p-8 rounded-3xl border border-primary/30 shadow-2xl relative overflow-hidden">
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
                          Emergency Bottlenecks in Blood Donation
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
                          Dual-Dashboard Real-Time Synchronization
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
                          Key Technical Hurdles
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
    </div>
  );
}
