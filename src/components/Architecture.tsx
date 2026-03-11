import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { FiBox, FiLayers, FiZap, FiShield, FiSmartphone, FiSearch } from "react-icons/fi";

const principles = [
  { icon: FiBox, title: "Component-Driven", desc: "Modular, reusable components with clear separation of concerns." },
  { icon: FiLayers, title: "Design System", desc: "Consistent tokens, glassmorphism, and semantic styling via Tailwind." },
  { icon: FiZap, title: "Performance First", desc: "Lazy loading, optimized renders, and sub-2s first paint targets." },
  { icon: FiShield, title: "Accessible & Semantic", desc: "ARIA labels, keyboard nav, proper headings, and contrast compliance." },
  { icon: FiSmartphone, title: "Mobile-First", desc: "Responsive breakpoints designed from mobile up to desktop." },
  { icon: FiSearch, title: "SEO Optimized", desc: "Meta tags, Open Graph, semantic HTML, and structured headings." },
];

export default function Architecture() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="architecture" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px]" />
      </div>

      <div ref={ref} className="max-w-5xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-3">
            Architecture <span className="text-gradient">Showcase</span>
          </h2>
          <div className="w-12 h-1 bg-primary rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground max-w-lg mx-auto">
            Engineering principles applied in building this portfolio
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {principles.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.08 * (i + 1), duration: 0.5 }}
              className="card-hover p-5 rounded-2xl glass border border-border/50 hover:border-primary/30 group"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                <p.icon className="text-primary" size={18} />
              </div>
              <h3 className="font-heading font-semibold text-foreground mb-1.5">{p.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Code snippet preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-10 p-6 rounded-2xl bg-card border border-border/50 overflow-hidden"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-destructive/60" />
            <div className="w-3 h-3 rounded-full bg-primary/60" />
            <div className="w-3 h-3 rounded-full bg-accent/60" />
            <span className="ml-2 text-xs text-muted-foreground font-mono">project-structure.ts</span>
          </div>
          <pre className="text-sm font-mono text-muted-foreground overflow-x-auto leading-relaxed">
            <code>{`src/
├── components/     // Reusable UI components
│   ├── Navbar      // Sticky nav with blur + active tracking
│   ├── Hero        // Particles + typing animation
│   ├── Skills      // Icon-based tech buttons
│   └── Dashboard   // Recharts data visualizations
├── data/           // Separated data layer
│   ├── skills.ts   // Tech stack definitions
│   └── projects.ts // Project metadata
├── hooks/          // Custom React hooks
│   ├── useScrollAnimation
│   └── useDarkMode
└── pages/          // Route-level components`}</code>
          </pre>
        </motion.div>
      </div>
    </section>
  );
}
