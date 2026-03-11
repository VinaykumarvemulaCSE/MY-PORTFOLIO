import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { projects } from "@/data/projects";
import { FiGithub, FiExternalLink, FiFolder } from "react-icons/fi";

export default function Projects() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="projects" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-[100px]" />
      </div>

      <div ref={ref} className="max-w-5xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-3">
            Featured <span className="text-gradient">Projects</span>
          </h2>
          <div className="w-12 h-1 bg-primary rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground max-w-md mx-auto">
            What I'm building and working on
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <motion.article
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 * (i + 1), duration: 0.5 }}
              className="card-hover p-6 rounded-2xl glass border border-border/50 hover:border-primary/30 hover:glow-sm flex flex-col group relative overflow-hidden"
            >
              {/* Hover gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <FiFolder className="text-primary" size={28} />
                  <div className="flex gap-2">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                        aria-label={`GitHub repo for ${project.title}`}
                      >
                        <FiGithub size={18} />
                      </a>
                    )}
                    {project.demo && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                        aria-label={`Live demo for ${project.title}`}
                      >
                        <FiExternalLink size={18} />
                      </a>
                    )}
                  </div>
                </div>

                <h3 className="font-heading font-semibold text-foreground mb-2 text-lg group-hover:text-primary transition-colors">{project.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">{project.description}</p>

                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span key={tag} className="text-xs font-mono px-2.5 py-1 rounded-md bg-secondary/80 text-muted-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span
                    className={`text-xs font-mono font-medium px-2.5 py-1 rounded-full ${
                      project.status === "Live"
                        ? "bg-primary/15 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {project.status}
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
