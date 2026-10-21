"use client";

import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { FiMonitor, FiServer, FiLayers, FiTarget, FiBookOpen, FiCalendar } from "react-icons/fi";

import type { ProfileViewModel } from "@/lib/sanity/types";

const focuses = [
  { icon: FiMonitor, title: "Frontend Engineering", desc: "Building responsive, accessible UIs with React and modern CSS frameworks.", gradient: "from-primary/20 to-accent/10" },
  { icon: FiServer, title: "Backend Development", desc: "Learning server-side programming, RESTful APIs, and database design.", gradient: "from-accent/20 to-primary/10" },
  { icon: FiLayers, title: "Full Stack Architecture", desc: "Understanding end-to-end application design, deployment, and DevOps.", gradient: "from-primary/15 to-primary/5" },
  { icon: FiTarget, title: "Problem Solving", desc: "Applying DSA knowledge and systematic thinking to build efficient solutions.", gradient: "from-accent/15 to-accent/5" },
];

export default function About({ profileData }: { profileData?: ProfileViewModel }) {
  const { ref, isVisible } = useScrollAnimation();
  const education = profileData?.education;
  const hasEducation = Boolean(education?.degree);

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
            {profileData?.bio || "I'm a Computer Science student building full-stack web applications and learning how the whole system fits together — from the interface to the data layer."}
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

        {hasEducation && education && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.55, duration: 0.5 }}
            className="mt-6 p-6 md:p-7 rounded-2xl glass border border-border/50 hover:border-primary/30 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <FiBookOpen className="text-primary" size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                    Education
                  </p>
                  <h3 className="font-heading font-semibold text-foreground text-lg">
                    {education.degree}
                  </h3>
                  {education.institution && (
                    <p className="text-sm text-muted-foreground">{education.institution}</p>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-muted-foreground">
                {education.period && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary/40 border border-border/40">
                    <FiCalendar size={12} />
                    {education.period}
                  </span>
                )}
                {education.status && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                    {education.status}
                  </span>
                )}
              </div>
            </div>

            {education.highlights.length > 0 && (
              <ul className="mt-5 grid sm:grid-cols-2 gap-2.5">
                {education.highlights.map((highlight) => (
                  <li key={highlight} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}
