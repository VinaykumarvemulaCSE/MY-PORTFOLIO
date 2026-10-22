"use client";

import useEmblaCarousel from "embla-carousel-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiArrowRight, FiChevronLeft, FiChevronRight } from "react-icons/fi";

import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import type { ProjectViewModel } from "@/lib/types";

import ProjectCard, { type ProjectOpenView } from "./projects/ProjectCard";
import ProjectModal from "./projects/ProjectModal";

interface ProjectsProps {
  initialProjects?: ProjectViewModel[];
  projectLimit?: number;
}

export default function Projects({ initialProjects = [], projectLimit = 5 }: ProjectsProps) {
  const { ref, isVisible } = useScrollAnimation();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    dragFree: true,
    containScroll: "trimSnaps",
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [snapCount, setSnapCount] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const limit = Number.isFinite(projectLimit)
    ? Math.min(20, Math.max(1, Math.trunc(projectLimit)))
    : 5;
  const projects = (() => {
    const featured = initialProjects.filter((project) => project.featured);
    const pool = featured.length > 0 ? featured : initialProjects;
    return [...pool].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).slice(0, limit);
  })();
  const useCarousel = projects.length > 3;
  const [selectedProject, setSelectedProject] = useState<ProjectViewModel | null>(null);
  const [modalView, setModalView] = useState<ProjectOpenView>("gallery");

  useEffect(() => {
    if (!emblaApi) return;

    const update = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
      setSnapCount(emblaApi.scrollSnapList().length);
      setCanPrev(emblaApi.canScrollPrev());
      setCanNext(emblaApi.canScrollNext());
    };

    update();
    emblaApi.on("select", update);
    emblaApi.on("reInit", update);
    return () => {
      emblaApi.off("select", update);
      emblaApi.off("reInit", update);
    };
  }, [emblaApi]);

  const openProject = (project: ProjectViewModel, view: ProjectOpenView = "gallery") => {
    setSelectedProject(project);
    setModalView(view);
  };

  return (
    <section id="projects" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-[100px]" />
      </div>

      <div ref={ref} className="max-w-6xl mx-auto relative px-4 md:px-8">
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
              What I&apos;ve been building lately
              {useCarousel ? " — drag, swipe, or use the arrows." : "."}
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
              View all projects
              <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <FiArrowRight
                  size={14}
                  className="text-primary group-hover:translate-x-0.5 transition-transform"
                />
              </span>
            </Link>
          </motion.div>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground border border-dashed border-border/50 rounded-2xl">
            No projects published yet.
          </div>
        ) : useCarousel ? (
          <div
            className="overflow-hidden cursor-grab active:cursor-grabbing -mx-4 md:-mx-8 px-4 md:px-8 pb-10"
            ref={emblaRef}
          >
            <div className="flex gap-6">
              {projects.map((project, index) => (
                <motion.div
                  key={project.slug}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.08 * (index + 1), duration: 0.45 }}
                  className="flex-[0_0_85%] md:flex-[0_0_44%] lg:flex-[0_0_31%] min-w-0"
                >
                  <ProjectCard project={project} onOpen={openProject} variant="carousel" />
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div
            className={`grid gap-6 ${
              projects.length === 1
                ? "max-w-md mx-auto"
                : projects.length === 2
                  ? "sm:grid-cols-2 max-w-3xl mx-auto"
                  : "sm:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {projects.map((project, index) => (
              <motion.div
                key={project.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.08 * (index + 1), duration: 0.45 }}
              >
                <ProjectCard project={project} onOpen={openProject} variant="carousel" />
              </motion.div>
            ))}
          </div>
        )}

        {useCarousel && projects.length > 0 ? (
          <div className="flex items-center justify-between gap-4 mt-1">
            <div className="flex items-center gap-2">
              {Array.from({ length: snapCount }).map((_, index) => (
                <button
                  type="button"
                  // biome-ignore lint/suspicious/noArrayIndexKey: carousel dots are positional
                  key={index}
                  onClick={() => emblaApi?.scrollTo(index)}
                  aria-label={`Go to project slide ${index + 1}`}
                  aria-current={selectedIndex === index ? "true" : undefined}
                  className={`h-1.5 rounded-full transition-all ${
                    selectedIndex === index
                      ? "w-6 bg-primary"
                      : "w-1.5 bg-border hover:bg-muted-foreground"
                  }`}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => emblaApi?.scrollPrev()}
                disabled={!canPrev}
                aria-label="Previous projects"
                className="rounded-full border border-border bg-secondary/30 p-2 text-muted-foreground transition hover:border-primary/40 hover:text-foreground disabled:opacity-30"
              >
                <FiChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={() => emblaApi?.scrollNext()}
                disabled={!canNext}
                aria-label="Next projects"
                className="rounded-full border border-border bg-secondary/30 p-2 text-muted-foreground transition hover:border-primary/40 hover:text-foreground disabled:opacity-30"
              >
                <FiChevronRight size={16} />
              </button>
            </div>
          </div>
        ) : null}
      </div>

      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            key={selectedProject.slug}
            project={selectedProject}
            initialView={modalView}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
