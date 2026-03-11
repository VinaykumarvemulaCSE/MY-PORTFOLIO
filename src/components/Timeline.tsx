import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { timelineEntries } from "@/data/timeline";
import { FiBookOpen, FiCode, FiLayout, FiServer, FiTrendingUp } from "react-icons/fi";

const icons = [FiBookOpen, FiCode, FiLayout, FiServer, FiTrendingUp];

export default function Timeline() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="journey" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px]" />
      </div>

      <div ref={ref} className="max-w-3xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-3">
            Learning <span className="text-gradient">Journey</span>
          </h2>
          <div className="w-12 h-1 bg-primary rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground max-w-md mx-auto">
            My path through technology and continuous growth
          </p>
        </motion.div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent" aria-hidden="true" />

          <div className="space-y-12">
            {timelineEntries.map((entry, i) => {
              const Icon = icons[i] || FiCode;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.15 * (i + 1), duration: 0.5 }}
                  className={`relative flex items-start gap-6 ${
                    i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Dot */}
                  <div className="absolute left-6 md:left-1/2 -translate-x-1/2 z-10">
                    <div className="w-12 h-12 rounded-full glass border border-primary/30 flex items-center justify-center">
                      <Icon className="text-primary" size={18} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className={`ml-20 md:ml-0 md:w-[calc(50%-40px)] ${i % 2 === 0 ? "md:pr-8 md:text-right" : "md:pl-8 md:ml-auto"}`}>
                    <div className="card-hover p-5 rounded-xl glass border border-border/50 hover:border-primary/20">
                      <span className="inline-block text-xs font-mono font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-md mb-2">{entry.year}</span>
                      <h3 className="font-heading font-semibold text-foreground mb-1.5">{entry.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{entry.description}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
