"use client";

import { motion } from "motion/react";
import { FiCode } from "react-icons/fi";
import { resolveTechIcon } from "@/constants/techIcons";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

import type { SkillGroupViewModel } from "@/lib/types";

interface SkillsProps {
  groups: SkillGroupViewModel[];
}

export default function Skills({ groups }: SkillsProps) {
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

        {groups.length === 0 ? (
          <div className="text-center py-12 rounded-2xl border border-dashed border-border/50 text-muted-foreground">
            Skills are being updated — check back soon.
          </div>
        ) : (
          groups.map((group, groupIndex) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15 * (groupIndex + 1), duration: 0.5 }}
              className="mb-10 last:mb-0"
            >
              <h3 className="text-sm font-mono font-medium text-muted-foreground uppercase tracking-widest mb-5 pl-1">
                {group.title}
              </h3>
              <div className="flex flex-wrap gap-3">
                {group.skills.map((skill, index) => {
                  const info = resolveTechIcon(skill);
                  const Icon = info?.icon ?? FiCode;
                  const color = skill.color || info?.color || "currentColor";

                  return (
                    <motion.div
                      key={`${group.id}-${skill.name}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                      transition={{
                        delay: 0.05 * index + 0.2 * (groupIndex + 1),
                        duration: 0.3,
                      }}
                      className="tech-btn inline-flex items-center gap-2.5 px-5 py-3 rounded-xl glass border border-border/50 hover:border-primary/40 group cursor-default"
                    >
                      <Icon
                        size={18}
                        style={{ color }}
                        className="transition-transform group-hover:scale-110"
                        aria-hidden="true"
                      />
                      <span className="text-sm font-medium text-foreground">{skill.name}</span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </section>
  );
}
