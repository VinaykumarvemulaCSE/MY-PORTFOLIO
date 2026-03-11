import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import {
  SiHtml5, SiCss, SiJavascript, SiReact, SiTailwindcss,
  SiNodedotjs, SiExpress, SiFirebase, SiGit, SiGithub,
  SiTypescript, SiVite, SiFramer,
  SiNpm, SiVercel
} from "react-icons/si";
import { FiCode } from "react-icons/fi";

interface TechItem {
  name: string;
  icon: React.ElementType;
  color: string;
  category: string;
}

const techStack: TechItem[] = [
  { name: "HTML5", icon: SiHtml5, color: "#E34F26", category: "Frontend" },
  { name: "CSS3", icon: SiCss, color: "#1572B6", category: "Frontend" },
  { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E", category: "Frontend" },
  { name: "TypeScript", icon: SiTypescript, color: "#3178C6", category: "Frontend" },
  { name: "React", icon: SiReact, color: "#61DAFB", category: "Frontend" },
  { name: "Tailwind CSS", icon: SiTailwindcss, color: "#06B6D4", category: "Frontend" },
  //{ name: "Framer Motion", icon: SiFramer, color: "#0055FF", category: "Frontend" },
  //{ name: "Vite", icon: SiVite, color: "#646CFF", category: "Frontend" },
  { name: "Node.js", icon: SiNodedotjs, color: "#339933", category: "Backend" },
  { name: "Express", icon: SiExpress, color: "#888888", category: "Backend" },
  { name: "Firebase", icon: SiFirebase, color: "#FFCA28", category: "Backend" },
  { name: "Git", icon: SiGit, color: "#F05032", category: "Tools" },
  { name: "GitHub", icon: SiGithub, color: "#aaaaaa", category: "Tools" },
  { name: "VS Code", icon: FiCode, color: "#007ACC", category: "Tools" },
  { name: "npm", icon: SiNpm, color: "#CB3837", category: "Tools" },
  { name: "Vercel", icon: SiVercel, color: "#aaaaaa", category: "Tools" },
];

const categories = ["Frontend", "Backend", "Tools"];

export default function Skills() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="skills" className="section-padding relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <div ref={ref} className="max-w-5xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-3">
            Tech <span className="text-gradient">Stack</span>
          </h2>
          <div className="w-12 h-1 bg-primary rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground max-w-md mx-auto">
            Technologies I work with and continuously learn
          </p>
        </motion.div>

        {categories.map((cat, ci) => (
          <motion.div
            key={cat}
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15 * (ci + 1), duration: 0.5 }}
            className="mb-10 last:mb-0"
          >
            <h3 className="text-sm font-mono font-medium text-muted-foreground uppercase tracking-widest mb-5 pl-1">
              {` ${cat}`}
            </h3>
            <div className="flex flex-wrap gap-3">
              {techStack
                .filter((t) => t.category === cat)
                .map((tech, i) => (
                  <motion.button
                    key={tech.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.05 * i + 0.2 * (ci + 1), duration: 0.3 }}
                    className="tech-btn inline-flex items-center gap-2.5 px-5 py-3 rounded-xl glass border border-border/50 hover:border-primary/40 group cursor-default"
                    type="button"
                    aria-label={tech.name}
                  >
                    <tech.icon
                      size={18}
                      style={{ color: tech.color }}
                      className="transition-transform group-hover:scale-110"
                    />
                    <span className="text-sm font-medium text-foreground">{tech.name}</span>
                  </motion.button>
                ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
