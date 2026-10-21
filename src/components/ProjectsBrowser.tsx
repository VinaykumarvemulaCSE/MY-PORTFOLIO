"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { FiSearch } from "react-icons/fi";

import type { ProjectViewModel } from "@/lib/sanity/types";

import ProjectCard, { type ProjectOpenView } from "./projects/ProjectCard";
import ProjectModal from "./projects/ProjectModal";
import { getProjectSummary } from "./projects/projectUtils";

const CATEGORIES = ["All", "Full Stack", "Frontend", "Backend"];

interface ProjectsBrowserProps {
  projects: ProjectViewModel[];
}

export default function ProjectsBrowser({ projects }: ProjectsBrowserProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProject, setSelectedProject] = useState<ProjectViewModel | null>(null);
  const [modalView, setModalView] = useState<ProjectOpenView>("gallery");

  const filteredProjects = useMemo(() => {
    const query = searchQuery.toLowerCase();

    return projects.filter((project) => {
      const summary = getProjectSummary(project);
      const matchesSearch =
        project.title.toLowerCase().includes(query) ||
        summary.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.tech.some((tech) => tech.toLowerCase().includes(query));

      if (activeCategory === "All") return matchesSearch;

      const tech = project.tech.map((item) => item.toLowerCase());
      const hasBackend = ["node.js", "node", "express", "firebase", "sql"].some(
        (item) => tech.includes(item),
      );

      if (activeCategory === "Frontend") {
        return (
          matchesSearch &&
          ["react", "next.js", "vue", "angular", "svelte", "tailwind"].some(
            (item) => tech.includes(item),
          )
        );
      }

      if (activeCategory === "Backend") {
        return matchesSearch && hasBackend;
      }

      // Full Stack: a real frontend framework plus a backend/data service.
      return (
        matchesSearch &&
        hasBackend &&
        ["react", "next.js", "vue", "angular", "svelte"].some((item) =>
          tech.includes(item),
        )
      );
    });
  }, [projects, searchQuery, activeCategory]);

  const openProject = (
    project: ProjectViewModel,
    view: ProjectOpenView = "gallery",
  ) => {
    setSelectedProject(project);
    setModalView(view);
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-16 px-4 md:px-8 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="mb-8">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs font-mono text-muted-foreground mb-6"
          >
            <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
              Home
            </Link>
            <span className="text-border">/</span>
            <span className="text-foreground font-semibold">Projects archive</span>
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
            Full-stack applications and experiments. Two projects are published
            so far; more are on the way.
          </motion.p>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap items-center gap-2"
          >
            {CATEGORIES.map((category) => (
              <button
                type="button"
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === category
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground border border-border/50"
                }`}
              >
                {category}
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
              placeholder="Search by title or tech..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-secondary/30 border border-border/50 rounded-2xl focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-sm placeholder:text-muted-foreground"
              aria-label="Search projects"
            />
          </motion.div>
        </div>

        {filteredProjects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-secondary/20 rounded-3xl border border-dashed border-border/50"
          >
            <FiSearch className="mx-auto text-4xl text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
              No projects found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("All");
              }}
              className="mt-6 text-primary hover:underline text-sm font-medium"
            >
              Clear all filters
            </button>
          </motion.div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="h-full"
                >
                  <ProjectCard project={project} onOpen={openProject} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            initialView={modalView}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
