"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  FiExternalLink,
  FiGithub,
  FiEye,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiLayers,
  FiCheck,
} from "react-icons/fi";
import useEmblaCarousel from "embla-carousel-react";

import type { ProjectViewModel } from "@/lib/sanity/types";

/**
 * Data arrives from the server (Sanity, or the JSON fallback) instead of being
 * fetched in the browser. That removes the `?t=Date.now()` cache-buster, makes
 * the content part of the server render, and stops the section from flashing a
 * spinner on every tab switch.
 */
type Project = ProjectViewModel;

const CATEGORIES = ["All", "Full Stack", "Web Apps"];

interface ProjectsSectionProps {
  projects: Project[];
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [galleryIndex, setGalleryIndex] = useState(0);

  // Embla Carousel hook for project modal screenshots
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
  });

  const getImages = (p: Project) => {
    const list: string[] = [];
    if (p.coverImage) list.push(p.coverImage);
    if (p.gallery) list.push(...p.gallery);
    return list;
  };

  const openProjectModal = (p: Project) => {
    setSelectedProject(p);
    setGalleryIndex(0);
    document.body.style.overflow = "hidden";
  };

  const closeProjectModal = useCallback(() => {
    setSelectedProject(null);
    document.body.style.overflow = "";
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeProjectModal();
      if (e.key === "ArrowLeft" && emblaApi) emblaApi.scrollPrev();
      if (e.key === "ArrowRight" && emblaApi) emblaApi.scrollNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [closeProjectModal, emblaApi]);

  const filteredProjects = useMemo(() => {
    if (activeCategory === "All") return projects;
    return projects.filter((p) => {
      if (activeCategory === "Full Stack") {
        return (
          p.tech.includes("Firebase") ||
          p.tech.includes("Next.js") ||
          p.description.toLowerCase().includes("full-stack")
        );
      }
      return true;
    });
  }, [projects, activeCategory]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Title */}
      <div>
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-white tracking-tight">
          Featured <span className="text-amber-400">Projects</span>
        </h2>
        <div className="w-12 h-1 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full mt-2" />
      </div>

      {/* Category filter pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? "bg-amber-400 text-black font-semibold shadow-md shadow-amber-400/20"
                  : "bg-[#282829] text-muted-foreground hover:text-white border border-white/5"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground text-sm">
          No projects found in this category.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-5">
          {filteredProjects.map((project) => {
            const hasCover = Boolean(project.coverImage);
            return (
              <div
                key={project.id}
                onClick={() => openProjectModal(project)}
                className="group cursor-pointer rounded-2xl bg-[#222224] border border-[#383838]/60 hover:border-amber-400/40 p-4 transition-all duration-300 shadow-md hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  {/* Thumbnail Container */}
                  <div className="relative w-full h-48 rounded-xl overflow-hidden bg-black/40 mb-4 border border-white/5">
                    {hasCover ? (
                      <Image
                        src={project.coverImage!}
                        alt={project.title}
                        fill
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 400px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs font-mono">
                        No Preview Available
                      </div>
                    )}

                    {/* Hover Overlay with Eye Icon */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-11 h-11 rounded-full bg-[#1e1e1f]/90 border border-amber-400 text-amber-400 flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform shadow-xl">
                        <FiEye size={20} />
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono font-medium text-emerald-400 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      {project.status || "Active"}
                    </div>
                  </div>

                  {/* Title & Category */}
                  <h3 className="text-base font-heading font-bold text-white group-hover:text-amber-300 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {project.description.slice(0, 140)}...
                  </p>
                </div>

                {/* Tech Pills & Actions */}
                <div className="mt-4 pt-3 border-t border-[#383838]/40 flex items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1.5">
                    {project.tech.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#2b2b2c] text-white/80 border border-white/5"
                      >
                        {t}
                      </span>
                    ))}
                    {project.tech.length > 3 && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-[#2b2b2c] text-muted-foreground">
                        +{project.tech.length - 3}
                      </span>
                    )}
                  </div>

                  <span className="text-xs font-medium text-amber-300/90 group-hover:underline inline-flex items-center gap-1 shrink-0">
                    Case Study →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Case Study & Gallery Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-5">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeProjectModal}
              className="fixed inset-0 bg-black/85 backdrop-blur-md"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 25 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 25 }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              className="relative max-w-3xl w-full max-h-[90vh] bg-[#1e1e1f] border border-[#383838] rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col"
            >
              {/* Header */}
              <div className="p-5 sm:p-6 border-b border-[#2e2e30] flex items-center justify-between bg-[#19191a]">
                <div>
                  <h3 className="text-xl font-heading font-bold text-white">
                    {selectedProject.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-mono text-amber-300">
                      {selectedProject.difficulty || "Production Grade"}
                    </span>
                    {selectedProject.timeInvestment && (
                      <span className="text-xs text-muted-foreground font-mono">
                        • {selectedProject.timeInvestment}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={closeProjectModal}
                  aria-label="Close Case Study"
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:border-amber-400 text-white/80 hover:text-white flex items-center justify-center transition-all"
                >
                  <FiX size={18} />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-sm">
                {/* Carousel Screenshots */}
                {getImages(selectedProject).length > 0 && (
                  <div className="space-y-2">
                    <div className="relative rounded-2xl overflow-hidden border border-[#383838] bg-black/60">
                      <div className="overflow-hidden" ref={emblaRef}>
                        <div className="flex">
                          {getImages(selectedProject).map((img, i) => (
                            <div
                              key={i}
                              className="relative min-w-full h-64 sm:h-80"
                            >
                              <Image
                                src={img}
                                alt={`${selectedProject.title} screenshot ${i + 1}`}
                                fill
                                className="object-cover object-top"
                                sizes="(max-width: 768px) 100vw, 768px"
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Carousel controls */}
                      {getImages(selectedProject).length > 1 && (
                        <>
                          <button
                            onClick={() => emblaApi && emblaApi.scrollPrev()}
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90 transition-colors"
                          >
                            <FiChevronLeft size={16} />
                          </button>
                          <button
                            onClick={() => emblaApi && emblaApi.scrollNext()}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90 transition-colors"
                          >
                            <FiChevronRight size={16} />
                          </button>
                        </>
                      )}
                    </div>
                    <p className="text-[11px] font-mono text-center text-muted-foreground">
                      Use left/right arrows or drag to browse screenshots (
                      {getImages(selectedProject).length} captures)
                    </p>
                  </div>
                )}

                {/* Problem & Solution */}
                {selectedProject.caseStudy?.problem && (
                  <div className="p-4 rounded-xl bg-[#262628] border border-[#383838]/60 space-y-2">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-amber-300 font-semibold">
                      Problem Solved
                    </h4>
                    <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
                      {selectedProject.caseStudy.problem}
                    </p>
                  </div>
                )}

                {/* Architecture */}
                {selectedProject.caseStudy?.architecture && (
                  <div className="p-4 rounded-xl bg-[#262628] border border-[#383838]/60 space-y-2">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-amber-300 font-semibold flex items-center gap-1.5">
                      <FiLayers size={13} /> Architecture & Technical Flow
                    </h4>
                    <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
                      {selectedProject.caseStudy.architecture}
                    </p>
                  </div>
                )}

                {/* Metrics */}
                {selectedProject.caseStudy?.metrics && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {selectedProject.caseStudy.metrics.map((m, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-[#222224] border border-white/5 text-center"
                      >
                        <div className="text-base sm:text-lg font-heading font-bold text-amber-400">
                          {m.value}
                        </div>
                        <div className="text-[11px] font-mono text-muted-foreground">
                          {m.label}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Key Challenges */}
                {selectedProject.caseStudy?.challenges && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-amber-300 font-semibold">
                      Key Technical Challenges Overcome
                    </h4>
                    <ul className="space-y-1.5">
                      {selectedProject.caseStudy.challenges.map((c, i) => (
                        <li
                          key={i}
                          className="text-xs text-white/80 flex items-start gap-2"
                        >
                          <FiCheck
                            size={14}
                            className="text-amber-400 mt-0.5 shrink-0"
                          />
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tech Stack Chips */}
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold mb-2">
                    Technologies Used
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tech.map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-1 rounded-lg bg-[#2b2b2c] border border-white/5 text-xs font-mono text-white/90"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer Links */}
              <div className="p-4 sm:p-5 border-t border-[#2e2e30] bg-[#19191a] flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {selectedProject.liveLink && (
                    <a
                      href={selectedProject.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 text-black font-heading font-semibold text-xs uppercase tracking-wider hover:brightness-110 transition-all shadow-md shadow-amber-400/20"
                    >
                      <FiExternalLink size={14} /> Live Demo
                    </a>
                  )}

                  {selectedProject.githubLink && (
                    <a
                      href={selectedProject.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white hover:border-amber-400/50 text-xs font-semibold transition-all"
                    >
                      <FiGithub size={14} /> View Code
                    </a>
                  )}
                </div>

                <button
                  type="button"
                  onClick={closeProjectModal}
                  className="text-xs font-mono text-muted-foreground hover:text-white"
                >
                  Close [Esc]
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
