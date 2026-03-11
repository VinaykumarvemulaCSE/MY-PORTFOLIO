import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FiGithub, FiDownload, FiMail, FiArrowDown } from "react-icons/fi";
import ParticleField from "./ParticleField";
import demoPhoto from "@/assets/demo.png";
import resume from "@/assets/RESUME.pdf";

const roles = ["Aspiring Full Stack Developer", "Tech Enthusiast", "CSE Student", "Problem Solver"];

export default function Hero() {
  const [roleIdx, setRoleIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    const role = roles[roleIdx];
    if (typing) {
      if (displayed.length < role.length) {
        const t = setTimeout(() => setDisplayed(role.slice(0, displayed.length + 1)), 55);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setTyping(false), 2000);
        return () => clearTimeout(t);
      }
    } else {
      if (displayed.length > 0) {
        const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 25);
        return () => clearTimeout(t);
      } else {
        setRoleIdx((i) => (i + 1) % roles.length);
        setTyping(true);
      }
    }
  }, [displayed, typing, roleIdx]);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center section-padding pt-24 overflow-hidden">
      <ParticleField />

      <div className="relative max-w-6xl mx-auto w-full">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-16">
          {/* Text content */}
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-medium text-primary font-mono">Available for opportunities</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-foreground mb-4 leading-tight"
            >
              Hi, I'm{" "}
              <span className="text-gradient">Vinay Kumar Vemula</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="h-10 mb-6 flex items-center justify-center lg:justify-start"
            >
              <span className="text-xl md:text-2xl font-heading text-muted-foreground">
                {displayed}
                <span className="inline-block w-0.5 h-6 bg-primary ml-1 animate-pulse" />
              </span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-muted-foreground max-w-lg mx-auto lg:mx-0 mb-10 leading-relaxed text-lg"
            >
              Computer Science student passionate about crafting beautiful, 
              performant web experiences. Building the future, one component at a time.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4"
            >
              <a
                href="https://github.com/VinaykumarvemulaCSE"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all glow-sm"
              >
                <FiGithub size={16} /> View GitHub
              </a>
              <a
                href={resume}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl glass border border-border/50 text-foreground font-semibold text-sm hover:border-primary/30 transition-all"
              >
                <FiDownload size={16} /> Resume
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-secondary text-secondary-foreground font-semibold text-sm hover:bg-secondary/80 transition-colors"
              >
                <FiMail size={16} /> Contact
              </a>
            </motion.div>
          </div>

          {/* Photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
            className="relative flex-shrink-0"
          >
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              {/* Decorative ring */}
              <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-spin-slow" />
              <div className="absolute -inset-3 rounded-full border border-dashed border-primary/10 animate-spin-slow" style={{ animationDirection: "reverse", animationDuration: "30s" }} />
              
              {/* Glow behind photo */}
              <div className="absolute inset-4 rounded-full bg-primary/20 blur-2xl" />
              
              {/* Photo */}
              <div className="absolute inset-3 rounded-full overflow-hidden border-2 border-primary/30">
                <img
                  src={demoPhoto}
                  alt="Vinay - Developer"
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>

              {/* Floating badges */}
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-2 top-8 px-3 py-1.5 rounded-lg glass text-xs font-mono font-medium text-primary border border-primary/20"
              >
                {'<Web />'}
              </motion.div>
              <motion.div
                animate={{ y: [5, -5, 5] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -left-4 bottom-16 px-3 py-1.5 rounded-lg glass text-xs font-mono font-medium text-foreground border border-border/50"
              >
                Coding
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-muted-foreground font-mono">scroll</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            <FiArrowDown size={16} className="text-muted-foreground" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
