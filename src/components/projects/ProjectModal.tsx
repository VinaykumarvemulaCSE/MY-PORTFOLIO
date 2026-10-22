"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FiArrowRight,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiExternalLink,
  FiGithub,
  FiImage,
  FiKey,
  FiMaximize2,
  FiMinimize2,
  FiX,
} from "react-icons/fi";

import { resolveTechIconValue } from "@/constants/techIcons";
import type { ProjectViewModel } from "@/lib/types";

import { getProjectImageAlt, getProjectImages, getProjectSummary } from "./projectUtils";

type ModalView = "gallery" | "details" | "case_study";

interface ProjectModalProps {
  project: ProjectViewModel;
  initialView?: "gallery" | "details";
  onClose: () => void;
}

function DemoAccess({ project }: { project: ProjectViewModel }) {
  const demo = project.demoCredentials;
  if (!demo) return null;

  return (
    <div className="p-4 md:p-5 rounded-2xl border border-primary/25 bg-primary/5 space-y-2">
      <p className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-primary">
        <FiKey size={13} /> Demo access
      </p>
      {demo.email && (
        <p className="text-sm text-foreground">
          <span className="text-muted-foreground">Email:</span>{" "}
          <span className="font-mono">{demo.email}</span>
        </p>
      )}
      {demo.password && (
        <p className="text-sm text-foreground">
          <span className="text-muted-foreground">Password:</span>{" "}
          <span className="font-mono">{demo.password}</span>
        </p>
      )}
      {demo.note && <p className="text-xs text-muted-foreground">{demo.note}</p>}
    </div>
  );
}

function ProjectLinks({ project }: { project: ProjectViewModel }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-border/30">
      {project.liveLink && (
        <a
          href={project.liveLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all glow-sm"
        >
          <FiExternalLink size={16} /> Open live application
        </a>
      )}
      {project.githubLink && (
        <a
          href={project.githubLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 glass border border-border/60 text-foreground py-3.5 rounded-xl font-semibold text-sm hover:border-primary/40 transition-all"
        >
          <FiGithub size={16} /> Inspect source code
        </a>
      )}
      <Link
        href={`/work/${project.slug}`}
        className="flex-1 flex items-center justify-center gap-2 bg-secondary/50 hover:bg-secondary border border-border/40 text-foreground py-3.5 rounded-xl font-semibold text-sm transition-all"
      >
        Full case study <FiArrowRight size={15} />
      </Link>
    </div>
  );
}

export default function ProjectModal({
  project,
  initialView = "gallery",
  onClose,
}: ProjectModalProps) {
  const [view, setView] = useState<ModalView>(initialView);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [fill, setFill] = useState(false);

  const images = getProjectImages(project);
  const imageCount = images.length;
  const summary = getProjectSummary(project);
  const caseStudy = project.caseStudy;
  const hasCaseStudy = Boolean(
    caseStudy &&
      (caseStudy.problem ||
        caseStudy.architecture ||
        caseStudy.whatBroke ||
        (caseStudy.challenges?.length ?? 0) > 0 ||
        (caseStudy.metrics?.length ?? 0) > 0)
  );
  const hasNotes = Boolean(
    project.description.trim() && project.description.trim() !== summary.trim()
  );

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft" && imageCount > 1) {
        setGalleryIndex((index) => (index - 1 + imageCount) % imageCount);
      }
      if (event.key === "ArrowRight" && imageCount > 1) {
        setGalleryIndex((index) => (index + 1) % imageCount);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose, imageCount]);

  const tabClass = (active: boolean) =>
    `text-xs font-semibold uppercase tracking-wider px-3.5 py-1.5 rounded-full transition-all ${
      active
        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
        : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
    }`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex flex-col bg-background/90 backdrop-blur-xl"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} details`}
    >
      <div
        className="flex items-start justify-between gap-4 p-4 md:px-8 md:py-6 border-b border-border/40 shrink-0 bg-background/50 backdrop-blur-sm"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex-1 min-w-0">
          <h2 className="text-lg md:text-2xl font-heading font-bold text-foreground truncate">
            {project.title}
          </h2>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <button
              type="button"
              onClick={() => setView("gallery")}
              className={tabClass(view === "gallery")}
            >
              Gallery
            </button>
            <button
              type="button"
              onClick={() => setView("details")}
              className={tabClass(view === "details")}
            >
              Details
            </button>
            {hasCaseStudy && (
              <button
                type="button"
                onClick={() => setView("case_study")}
                className={`${tabClass(view === "case_study")} inline-flex items-center gap-1.5`}
              >
                Case study
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-700/95 text-white font-mono">
                  Deep dive
                </span>
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden md:flex items-center gap-2 mr-2 pr-3 border-r border-border/40">
            {project.githubLink && (
              <a
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-secondary/30 text-foreground hover:text-primary hover:bg-secondary transition-all"
                aria-label="View source on GitHub"
              >
                <FiGithub size={18} />
              </a>
            )}
            {project.liveLink && (
              <a
                href={project.liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-secondary/30 text-foreground hover:text-primary hover:bg-secondary transition-all"
                aria-label="Open live demo"
              >
                <FiExternalLink size={18} />
              </a>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2.5 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
            aria-label="Close project details"
          >
            <FiX size={22} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto" onClick={(event) => event.stopPropagation()}>
        <AnimatePresence mode="wait">
          {view === "gallery" && (
            <motion.div
              key="gallery"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="h-full flex flex-col"
            >
              <div className="flex-1 flex items-center justify-center relative overflow-hidden p-4 md:p-8">
                {imageCount > 0 ? (
                  <div className="relative w-full max-w-5xl h-[55vh] md:h-[70vh]">
                    <Image
                      src={images[galleryIndex]}
                      alt={getProjectImageAlt(project, images[galleryIndex], galleryIndex)}
                      fill
                      className={fill ? "object-cover" : "object-contain drop-shadow-2xl"}
                      sizes="(max-width: 1200px) 100vw, 1200px"
                      priority
                    />
                    <button
                      type="button"
                      onClick={() => setFill((value) => !value)}
                      aria-pressed={fill}
                      aria-label={
                        fill
                          ? "Fit screenshot inside the frame"
                          : "Fill the frame with the screenshot"
                      }
                      title={fill ? "Fit screenshot" : "Fill frame"}
                      className="absolute right-2 top-2 inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-background/80 px-3 py-1.5 text-[11px] font-medium text-muted-foreground shadow-lg backdrop-blur-sm transition hover:text-foreground"
                    >
                      {fill ? <FiMinimize2 size={13} /> : <FiMaximize2 size={13} />}
                      {fill ? "Fit" : "Fill"}
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4 text-muted-foreground opacity-50">
                    <FiImage size={48} />
                    <p>No screenshots available for this project.</p>
                  </div>
                )}

                {imageCount > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setGalleryIndex((index) => (index - 1 + imageCount) % imageCount)
                      }
                      className="absolute left-4 md:left-8 p-3 md:p-4 rounded-full bg-background/80 border border-border/50 hover:border-primary/40 text-foreground hover:text-primary transition-all shadow-xl backdrop-blur-sm group"
                      aria-label="Previous screenshot"
                    >
                      <FiChevronLeft
                        size={24}
                        className="group-hover:-translate-x-0.5 transition-transform"
                      />
                    </button>
                    <button
                      type="button"
                      onClick={() => setGalleryIndex((index) => (index + 1) % imageCount)}
                      className="absolute right-4 md:right-8 p-3 md:p-4 rounded-full bg-background/80 border border-border/50 hover:border-primary/40 text-foreground hover:text-primary transition-all shadow-xl backdrop-blur-sm group"
                      aria-label="Next screenshot"
                    >
                      <FiChevronRight
                        size={24}
                        className="group-hover:translate-x-0.5 transition-transform"
                      />
                    </button>
                  </>
                )}
              </div>

              {imageCount > 1 && (
                <div className="hidden md:flex gap-3 p-6 overflow-x-auto border-t border-border/20 justify-center bg-background/30">
                  {images.map((image, index) => (
                    <button
                      type="button"
                      key={image}
                      onClick={() => setGalleryIndex(index)}
                      className={`relative w-20 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all duration-300 ${
                        index === galleryIndex
                          ? "border-primary scale-110 shadow-lg shadow-primary/20"
                          : "border-transparent opacity-40 hover:opacity-100"
                      }`}
                      aria-label={`View screenshot ${index + 1}`}
                    >
                      <Image
                        src={image}
                        alt={getProjectImageAlt(project, image, index)}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </button>
                  ))}
                </div>
              )}

              <div className="md:hidden bg-background/50 p-3 border-t border-border/20">
                <p className="text-xs text-center text-muted-foreground font-mono">
                  Screenshot {imageCount ? galleryIndex + 1 : 0} of {imageCount}
                </p>
              </div>
            </motion.div>
          )}

          {view === "details" && (
            <motion.div
              key="details"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.25 }}
              className="max-w-4xl mx-auto px-6 py-10 md:py-14 space-y-8"
            >
              <section className="space-y-4">
                <h3 className="text-xs uppercase tracking-widest text-primary font-bold px-1">
                  Project overview
                </h3>
                <div className="glass p-6 md:p-8 rounded-3xl border border-primary/30 shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-linear-to-br from-primary/10 to-transparent pointer-events-none" />
                  <p className="text-lg md:text-xl text-foreground leading-relaxed font-light relative z-10">
                    {summary}
                  </p>
                  {hasNotes && (
                    <details className="mt-4 relative z-10 group/notes">
                      <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-primary [&::-webkit-details-marker]:hidden">
                        Complete project notes
                        <FiChevronDown
                          size={14}
                          className="transition-transform group-open/notes:rotate-180"
                        />
                      </summary>
                      <div className="mt-3 max-h-[40vh] overflow-y-auto whitespace-pre-line text-sm text-muted-foreground leading-relaxed pr-2">
                        {project.description}
                      </div>
                    </details>
                  )}
                </div>
              </section>

              <DemoAccess project={project} />

              <section className="space-y-4">
                <h3 className="text-xs uppercase tracking-widest text-primary font-bold px-1">
                  Tech stack
                </h3>
                <div className="flex flex-wrap gap-2.5">
                  {(project.tech || []).map((tech) => {
                    const info = resolveTechIconValue(tech);
                    return (
                      <span
                        key={tech}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border/50 bg-background/40 text-foreground transition-all shadow-sm group"
                      >
                        {info && (
                          <info.icon
                            size={16}
                            style={{ color: info.color }}
                            className="group-hover:scale-110 transition-transform"
                          />
                        )}
                        <span className="text-sm font-semibold">{info?.name ?? tech}</span>
                      </span>
                    );
                  })}
                </div>
              </section>

              <ProjectLinks project={project} />
            </motion.div>
          )}

          {view === "case_study" && (
            <motion.div
              key="case_study"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.25 }}
              className="max-w-4xl mx-auto px-6 py-10 md:py-14 space-y-8"
            >
              {(caseStudy?.metrics?.length ?? 0) > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {(caseStudy?.metrics ?? []).map((metric) => (
                    <div
                      key={metric.label}
                      className="p-4 rounded-2xl glass border border-primary/20 text-center"
                    >
                      <span className="text-xl md:text-2xl font-bold font-mono text-primary block">
                        {metric.value}
                      </span>
                      <span className="text-[11px] font-mono text-muted-foreground uppercase">
                        {metric.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {caseStudy?.problem && (
                <div className="p-6 md:p-8 rounded-3xl glass border border-border/60 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                    <span>01</span> • Problem
                  </div>
                  <h4 className="text-xl font-heading font-bold text-foreground">
                    {caseStudy.problemTitle || "Problem statement"}
                  </h4>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                    {caseStudy.problem}
                  </p>
                </div>
              )}

              {caseStudy?.architecture && (
                <div className="p-6 md:p-8 rounded-3xl glass border border-border/60 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-primary uppercase tracking-wider">
                    <span>02</span> • Architecture
                  </div>
                  <h4 className="text-xl font-heading font-bold text-foreground">
                    {caseStudy.architectureTitle || "How it works"}
                  </h4>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                    {caseStudy.architecture}
                  </p>
                </div>
              )}

              {(caseStudy?.challenges?.length ?? 0) > 0 && (
                <div className="p-6 md:p-8 rounded-3xl glass border border-border/60 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-primary uppercase tracking-wider">
                    <span>03</span> • Challenges
                  </div>
                  <h4 className="text-xl font-heading font-bold text-foreground">
                    {caseStudy?.challengesTitle || "Hardest problems"}
                  </h4>
                  <ul className="space-y-2.5 text-sm text-muted-foreground">
                    {(caseStudy?.challenges ?? []).map((challenge) => (
                      <li key={challenge} className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                        <span>{challenge}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {caseStudy?.whatBroke && (
                <div className="p-6 md:p-8 rounded-3xl glass border border-border/60 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-primary uppercase tracking-wider">
                    <span>04</span> • What broke
                  </div>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                    {caseStudy.whatBroke}
                  </p>
                </div>
              )}

              {!hasCaseStudy && (
                <div className="p-6 md:p-8 rounded-3xl glass border border-dashed border-border/60 text-center space-y-3">
                  <h4 className="text-lg font-heading font-bold text-foreground">
                    Write-up in progress
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    The full engineering breakdown is not published yet. The source code and live
                    demo are the honest source of truth in the meantime.
                  </p>
                </div>
              )}

              <DemoAccess project={project} />
              <ProjectLinks project={project} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
