import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { FiMonitor, FiServer, FiLayers, FiTarget } from "react-icons/fi";

const focuses = [
  { icon: FiMonitor, title: "Frontend Engineering", desc: "Building responsive, accessible UIs with React and modern CSS frameworks.", gradient: "from-primary/20 to-accent/10" },
  { icon: FiServer, title: "Backend Development", desc: "Learning server-side programming, RESTful APIs, and database design.", gradient: "from-accent/20 to-primary/10" },
  { icon: FiLayers, title: "Full Stack Architecture", desc: "Understanding end-to-end application design, deployment, and DevOps.", gradient: "from-primary/15 to-primary/5" },
  { icon: FiTarget, title: "Problem Solving", desc: "Applying DSA knowledge and systematic thinking to build efficient solutions.", gradient: "from-accent/15 to-accent/5" },
];

export default function About() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="about" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px]" />
      </div>

      <div ref={ref} className="max-w-5xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-3">
            About <span className="text-gradient">Me</span>
          </h2>
          <div className="w-12 h-1 bg-primary rounded-full mx-auto mb-6" />
          <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto text-lg">
            I'm a Computer Science student passionate about building software that matters.
            Currently diving deep into modern web technologies, aiming to create production-quality
            applications and contribute to open-source.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5">
          {focuses.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 * (i + 1), duration: 0.5 }}
              className={`card-hover p-6 rounded-2xl glass border border-border/50 hover:border-primary/30 group relative overflow-hidden`}
            >
              {/* Gradient bg */}
              <div className={`absolute inset-0 bg-gradient-to-br ${f.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <div className="relative">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <f.icon className="text-primary" size={20} />
                </div>
                <h3 className="font-heading font-semibold text-foreground mb-2 text-lg">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
