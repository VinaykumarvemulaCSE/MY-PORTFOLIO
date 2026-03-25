import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { FiGithub, FiExternalLink, FiFolder, FiArrowRight } from "react-icons/fi";
import useEmblaCarousel from "embla-carousel-react";

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
              to="/projects"
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
            <Link to="/admin" className="text-primary underline">Admin panel</Link>.
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
                  {/* Screenshot */}
                  {project.coverImage ? (
                    <div className="w-full h-44 overflow-hidden relative">
                      <img
                        src={project.coverImage}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
                    </div>
                  ) : (
                    <div className="w-full h-20 bg-secondary/30 flex items-center justify-center">
                      <FiFolder size={28} className="text-primary/40" />
                    </div>
                  )}

                  {/* Hover glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  <div className="relative flex flex-col flex-1 p-6">
                    {!project.coverImage && <div className="mb-4"><FiFolder className="text-primary" size={26} /></div>}

                    <h3 className="font-heading font-semibold text-foreground mb-2 text-lg group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-5 line-clamp-3">
                      {project.description}
                    </p>

                    <div className="flex items-center justify-between mt-auto gap-2">
                      <div className="flex flex-wrap gap-1.5">
                        {(project.tech || []).slice(0, 3).map((t) => (
                          <span key={t} className="text-[10px] uppercase font-mono px-2 py-0.5 rounded border border-border/50 bg-secondary/30 text-muted-foreground">
                            {t}
                          </span>
                        ))}
                        {(project.tech || []).length > 3 && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-border/50 bg-secondary/30 text-muted-foreground">
                            +{project.tech.length - 3}
                          </span>
                        )}
                      </div>
                      {project.status && (
                        <span className={`text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full shrink-0 ${
                          project.status === "Live" ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                        }`}>
                          {project.status}
                        </span>
                      )}
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
                          <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className={`flex items-center justify-center gap-2 bg-secondary/30 hover:bg-secondary border border-border/50 text-foreground py-2 px-3 rounded-lg text-sm font-semibold transition-colors z-10 ${!project.liveLink ? 'flex-1' : ''}`}>
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
    </section>
  );
}
