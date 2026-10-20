"use client";

import { motion } from "framer-motion";
import { FiBookOpen, FiAward, FiDownload, FiCheckCircle } from "react-icons/fi";

const EDUCATION = [
  {
    degree: "B.Tech in Computer Science & Engineering",
    institution: "Engineering College / University",
    period: "2025 — 2029 (Expected)",
    description:
      "Pursuing a 4-year degree in Computer Science. Currently in 2nd year with core academic focus on fundamental computer science principles, discrete mathematics, and software design.",
    keyPoints: [
      "Key Coursework: Data Structures & Algorithms, OOP, Database Systems, Computer Networks",
      "Building practical applications alongside academic theory to master engineering principles",
      "Active participant in tech coding communities and continuous open-source learning",
    ],
  },
];

const EXPERIENCE = [
  {
    role: "Full-Stack Project Developer",
    organization: "Independent & Open Source Projects",
    period: "2024 — Present",
    description:
      "Designing and deploying end-to-end web applications with Next.js, TypeScript, Tailwind, and Firebase.",
    keyPoints: [
      "Built Aroma Cafe: E-Commerce storefront + real-time Kitchen Display System (KDS) using Firestore listeners and role-based access control.",
      "Developed Blood-Line: Dual-dashboard emergency blood coordination web app with live tracking and geolocation discovery.",
      "Engineered automated GitHub Octokit CMS for portfolio data synchronization and dynamic content management.",
    ],
  },
];

const SKILL_METRICS = [
  { name: "Frontend & Web Architecture (React, Next.js, Tailwind)", level: 90 },
  { name: "TypeScript & Modern JavaScript", level: 85 },
  { name: "Backend, REST APIs & Firebase Firestore", level: 80 },
  { name: "Problem Solving & DSA Fundamentals", level: 75 },
  { name: "Git, GitHub & Production Deployment (Vercel)", level: 85 },
];

export default function ResumeSection({ profileData }: { profileData: any }) {
  const resumeUrl = profileData?.resumeUrl || "/resume.pdf";

  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-10"
    >
      {/* Title */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-white tracking-tight">
            Resume & <span className="text-amber-400">Journey</span>
          </h2>
          <div className="w-12 h-1 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full mt-2" />
        </div>

        <a
          href={resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-300 hover:bg-amber-400/20 text-xs font-semibold uppercase tracking-wider transition-all"
        >
          <FiDownload size={14} /> Download PDF
        </a>
      </div>

      {/* Education Timeline */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-[#282829] border border-[#383838] flex items-center justify-center text-amber-400">
            <FiBookOpen size={18} />
          </div>
          <h3 className="text-lg md:text-xl font-heading font-bold text-white">
            Education
          </h3>
        </div>

        <div className="relative pl-6 ml-4 border-l border-[#383838] space-y-8">
          {EDUCATION.map((edu, idx) => (
            <div key={idx} className="relative group">
              {/* Timeline Bullet */}
              <span className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-[#1e1e1f] border-2 border-amber-400 group-hover:bg-amber-400 transition-colors shadow-sm shadow-amber-400/50" />

              <h4 className="text-base font-heading font-semibold text-white">
                {edu.degree}
              </h4>
              <p className="text-xs font-mono text-amber-300/90 mt-0.5">
                {edu.period} • {edu.institution}
              </p>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                {edu.description}
              </p>

              <ul className="mt-3 space-y-1.5">
                {edu.keyPoints.map((point, pIdx) => (
                  <li
                    key={pIdx}
                    className="text-xs text-white/80 flex items-start gap-2"
                  >
                    <FiCheckCircle
                      size={13}
                      className="text-amber-400 mt-0.5 shrink-0"
                    />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Experience / Milestones Timeline */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-[#282829] border border-[#383838] flex items-center justify-center text-amber-400">
            <FiAward size={18} />
          </div>
          <h3 className="text-lg md:text-xl font-heading font-bold text-white">
            Key Engineering Milestones
          </h3>
        </div>

        <div className="relative pl-6 ml-4 border-l border-[#383838] space-y-8">
          {EXPERIENCE.map((exp, idx) => (
            <div key={idx} className="relative group">
              {/* Timeline Bullet */}
              <span className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-[#1e1e1f] border-2 border-amber-400 group-hover:bg-amber-400 transition-colors shadow-sm shadow-amber-400/50" />

              <h4 className="text-base font-heading font-semibold text-white">
                {exp.role}
              </h4>
              <p className="text-xs font-mono text-amber-300/90 mt-0.5">
                {exp.period} • {exp.organization}
              </p>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                {exp.description}
              </p>

              <ul className="mt-3 space-y-1.5">
                {exp.keyPoints.map((point, pIdx) => (
                  <li
                    key={pIdx}
                    className="text-xs text-white/80 flex items-start gap-2"
                  >
                    <FiCheckCircle
                      size={13}
                      className="text-amber-400 mt-0.5 shrink-0"
                    />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Skill Proficiency Progress Bars */}
      <div>
        <h3 className="text-lg md:text-xl font-heading font-bold text-white mb-5">
          Core Proficiencies
        </h3>

        <div className="space-y-4 p-5 rounded-2xl bg-[#222224] border border-[#383838]/60 shadow-md">
          {SKILL_METRICS.map((skill) => (
            <div key={skill.name} className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-white/90">{skill.name}</span>
                <span className="font-mono text-amber-300 font-semibold">
                  {skill.level}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#2b2b2c] overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.level}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
