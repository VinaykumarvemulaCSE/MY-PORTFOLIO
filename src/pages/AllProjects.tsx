import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiGithub, FiExternalLink, FiFolder, FiArrowLeft } from "react-icons/fi";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";

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

export default function AllProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/data/projects.json?t=${Date.now()}`)
      .then((r) => r.json())
      .then((data: Project[]) => setProjects(data))
      .catch((err) => console.error("Failed to load projects", err))
      .finally(() => setLoading(false));
  }, []);

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
            A comprehensive list of things I've built — ranging from full-stack web apps to creative experiments.
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
            {projects.map((project, i) => (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i, duration: 0.45 }}
                className="card-hover rounded-2xl glass border border-border/50 hover:border-primary/30 flex flex-col group relative overflow-hidden"
              >
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

                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="relative flex-1 flex flex-col p-6">
                  <div className="flex items-center justify-between mb-4">
                    {!project.coverImage && <FiFolder className="text-primary" size={26} />}
                    <div className="flex gap-2 ml-auto">
                      {project.githubLink && (
                        <a href={project.githubLink} target="_blank" rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary transition-colors z-10">
                          <FiGithub size={18} />
                        </a>
                      )}
                      {project.liveLink && (
                        <a href={project.liveLink} target="_blank" rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary transition-colors z-10">
                          <FiExternalLink size={18} />
                        </a>
                      )}
                    </div>
                  </div>

                  <h3 className="font-heading font-semibold text-foreground mb-2 text-lg group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">
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
                      <span className={`text-[10px] uppercase font-mono font-bold px-2.5 py-0.5 rounded-full shrink-0 ${
                        project.status === "Live" ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                      }`}>
                        {project.status}
                      </span>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
