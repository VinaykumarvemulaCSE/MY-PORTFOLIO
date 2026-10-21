"use client";

import Image from "next/image";
import Link from "next/link";
import { FiExternalLink, FiFolder, FiGithub, FiImage, FiKey } from "react-icons/fi";

import { TECH_ICONS } from "@/constants/techIcons";
import type { ProjectViewModel } from "@/lib/types";

import { getProjectImages, getProjectSummary } from "./projectUtils";

export type ProjectOpenView = "gallery" | "details";

interface ProjectCardProps {
  project: ProjectViewModel;
  onOpen: (project: ProjectViewModel, view?: ProjectOpenView) => void;
  variant?: "carousel" | "grid";
}

export default function ProjectCard({ project, onOpen, variant = "grid" }: ProjectCardProps) {
  const images = getProjectImages(project);
  const cover = images[0];
  const summary = getProjectSummary(project);
  const isCarousel = variant === "carousel";

  return (
    <article className="h-full rounded-2xl glass border border-border/50 hover:border-primary/30 flex flex-col group relative overflow-hidden card-hover">
      <button
        type="button"
        onClick={() => onOpen(project, "gallery")}
        className={`relative block w-full overflow-hidden text-left ${
          isCarousel ? "h-44" : "h-52"
        }`}
        aria-label={`Open ${project.title} screenshots`}
      >
        {cover ? (
          <>
            <Image
              src={cover}
              alt={`${project.title} preview`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />

            <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
              {project.featured ? (
                <span className="inline-flex items-center gap-1 bg-amber-700/95 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-md backdrop-blur-sm">
                  ★ Featured
                </span>
              ) : (
                <span />
              )}

              {images.length > 1 && (
                <div className="flex items-center gap-1 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm">
                  <FiImage size={10} /> {images.length}
                </div>
              )}
            </div>

            {project.difficulty && (
              <div className="absolute bottom-2 left-2.5 flex items-center gap-1.5 pointer-events-none">
                <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-mono px-2 py-0.5 rounded-md border border-white/10">
                  {project.difficulty}
                </span>
                {project.timeInvestment && (
                  <span className="bg-black/60 backdrop-blur-md text-white/90 text-[10px] font-mono px-2 py-0.5 rounded-md border border-white/10">
                    ⏱ {project.timeInvestment}
                  </span>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full bg-secondary/30 flex items-center justify-center">
            <FiFolder size={30} className="text-primary/40" />
          </div>
        )}
      </button>

      <div className="absolute inset-0 bg-linear-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div
        className="relative flex flex-col flex-1 p-6 cursor-pointer"
        onClick={() => onOpen(project, "details")}
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-heading font-semibold text-foreground text-lg group-hover:text-primary transition-colors">
            <Link
              href={`/work/${project.slug}`}
              onClick={(event) => event.stopPropagation()}
              className="hover:underline decoration-primary/40 underline-offset-4"
            >
              {project.title}
            </Link>
          </h3>
          {project.status && (
            <span
              className={`text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full shrink-0 ${
                project.status === "Live"
                  ? "bg-primary/15 text-primary"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {project.status}
            </span>
          )}
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2 break-words">
          {summary}
        </p>

        {project.demoCredentials && (
          <p className="inline-flex items-center gap-1.5 text-[11px] font-mono text-primary mb-4">
            <FiKey size={12} /> Demo access available
          </p>
        )}

        <div className="flex items-center justify-between mt-auto gap-2">
          <div className="flex flex-wrap gap-1.5">
            {(project.tech || []).slice(0, 4).map((tech) => {
              const iconInfo = TECH_ICONS[tech];
              const Icon = iconInfo?.icon;
              return (
                <span
                  key={tech}
                  className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-md border border-border/50 bg-secondary/30 text-foreground"
                  title={tech}
                >
                  {Icon && <Icon size={11} style={{ color: iconInfo.color || "currentColor" }} />}
                  <span>{tech}</span>
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

        {isCarousel && (project.liveLink || project.githubLink) && (
          <div
            className="flex gap-3 mt-5 pt-5 border-t border-border/40 w-full"
            onClick={(event) => event.stopPropagation()}
          >
            {project.liveLink && (
              <a
                href={project.liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 py-2 rounded-lg text-sm font-bold transition-all shadow-lg shadow-primary/20 z-10"
              >
                <FiExternalLink size={16} /> Live Demo
              </a>
            )}
            {project.githubLink && (
              <a
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View Project on GitHub"
                className={`flex items-center justify-center gap-2 bg-secondary/30 hover:bg-secondary border border-border/50 text-foreground py-2 px-3 rounded-lg text-sm font-semibold transition-colors z-10 ${
                  !project.liveLink ? "flex-1" : ""
                }`}
              >
                <FiGithub size={16} /> {project.liveLink ? "" : "GitHub"}
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
