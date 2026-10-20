"use client";

import { motion } from "framer-motion";
import {
  FiLayout,
  FiServer,
  FiCpu,
  FiGitBranch,
} from "react-icons/fi";
import {
  SiHtml5,
  SiCss,
  SiJavascript,
  SiTypescript,
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiNodedotjs,
  SiExpress,
  SiFirebase,
  SiPostgresql,
  SiGit,
  SiGithub,
  SiVercel,
  SiDocker,
  SiPython,
  SiCplusplus,
} from "react-icons/si";

interface AboutSectionProps {
  profileData: any;
  onExploreProjects?: () => void;
}

const SERVICES = [
  {
    icon: FiLayout,
    title: "Full-Stack Web Development",
    desc: "Architecting responsive, high-speed web apps with Next.js App Router, React, TypeScript, and modern CSS frameworks.",
  },
  {
    icon: FiServer,
    title: "Real-Time APIs & Databases",
    desc: "Designing resilient backend workflows with Firebase Firestore snapshot listeners, RESTful endpoints, and relational schemas.",
  },
  {
    icon: FiCpu,
    title: "Algorithmic Problem Solving",
    desc: "Applying foundational Data Structures & Algorithms (C++/Java/Python) to build efficient, scalable application logic.",
  },
  {
    icon: FiGitBranch,
    title: "Production Deployment & Git",
    desc: "Clean version control with GitHub, automated CI/CD pipelines via Vercel, and modular component design systems.",
  },
];

const SKILL_CATEGORIES = [
  {
    category: "Languages",
    skills: [
      { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
      { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
      { name: "Python", icon: SiPython, color: "#3776AB" },
      { name: "C++", icon: SiCplusplus, color: "#00599C" },
      { name: "HTML5", icon: SiHtml5, color: "#E34F26" },
      { name: "CSS3", icon: SiCss, color: "#1572B6" },
    ],
  },
  {
    category: "Frameworks & Libraries",
    skills: [
      { name: "Next.js", icon: SiNextdotjs, color: "#ffffff" },
      { name: "React", icon: SiReact, color: "#61DAFB" },
      { name: "Tailwind CSS", icon: SiTailwindcss, color: "#06B6D4" },
      { name: "Node.js", icon: SiNodedotjs, color: "#339933" },
      { name: "Express", icon: SiExpress, color: "#aaaaaa" },
    ],
  },
  {
    category: "Databases, Cloud & Tools",
    skills: [
      { name: "Firebase", icon: SiFirebase, color: "#FFCA28" },
      { name: "PostgreSQL", icon: SiPostgresql, color: "#4169E1" },
      { name: "Git", icon: SiGit, color: "#F05032" },
      { name: "GitHub", icon: SiGithub, color: "#ffffff" },
      { name: "Vercel", icon: SiVercel, color: "#ffffff" },
      { name: "Docker (Basics)", icon: SiDocker, color: "#2496ED" },
    ],
  },
];

export default function AboutSection({ profileData, onExploreProjects }: AboutSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-10"
    >
      {/* Title */}
      <div>
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-white tracking-tight">
          About <span className="text-amber-400">Me</span>
        </h2>
        <div className="w-12 h-1 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full mt-2" />
      </div>

      {/* Narrative Bio */}
      <div className="space-y-4 text-muted-foreground text-sm sm:text-base leading-relaxed font-body">
        <p>
          I am a second-year <strong>Computer Science & Engineering</strong> student (Class of 2029) with a passion for software craftsmanship. Rather than treating college as just theory and exams, I spend my time engineering practical, production-ready web platforms and exploring scalable software architectures.
        </p>
        <p>
          As an introverted and focused builder, I thrive on deep work: solving architectural bottlenecks, designing frictionless user interfaces, and ensuring data integrity with real-time systems. My projects, such as{" "}
          <strong className="text-white font-medium">Aroma Cafe</strong> (an e-commerce & live kitchen POS platform) and{" "}
          <strong className="text-white font-medium">Blood-Line</strong> (an emergency donor-recipient dispatch system), reflect my dedication to creating software that solves real-world problems.
        </p>
        <p>
          My objective is clear: to keep leveling up my software engineering skills, build high-impact independent projects, and secure challenging <strong>Software Developer Internships</strong>.
        </p>
      </div>

      {/* What I'm Doing / Core Focus Areas */}
      <div>
        <h3 className="text-lg md:text-xl font-heading font-bold text-white mb-5">
          What I Focus On
        </h3>

        <div className="grid sm:grid-cols-2 gap-4">
          {SERVICES.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.title}
                className="group relative p-5 rounded-2xl bg-[#222224] border border-[#383838]/60 hover:border-amber-400/40 transition-all duration-300 shadow-md hover:-translate-y-1"
              >
                <div className="w-11 h-11 rounded-xl bg-[#2b2b2c] border border-white/5 flex items-center justify-center text-amber-400 mb-3 group-hover:scale-110 group-hover:border-amber-400/30 transition-transform">
                  <Icon size={20} />
                </div>
                <h4 className="text-base font-heading font-semibold text-white mb-1.5">
                  {s.title}
                </h4>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {s.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tech Stack Breakdown */}
      <div>
        <h3 className="text-lg md:text-xl font-heading font-bold text-white mb-5">
          Technical Skills & Technologies
        </h3>

        <div className="space-y-6">
          {SKILL_CATEGORIES.map((cat) => (
            <div key={cat.category} className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                {cat.category}
              </h4>
              <div className="flex flex-wrap gap-2.5">
                {cat.skills.map((skill) => {
                  const Icon = skill.icon;
                  return (
                    <div
                      key={skill.name}
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#222224] border border-[#383838]/60 hover:border-amber-400/40 transition-all group cursor-default"
                    >
                      <Icon
                        size={16}
                        style={{ color: skill.color }}
                        className="transition-transform group-hover:scale-110"
                      />
                      <span className="text-xs font-medium text-white/90">
                        {skill.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
