export interface Skill {
  name: string;
  level: number; // 0-100
}

export interface SkillCategory {
  title: string;
  icon: string;
  skills: Skill[];
}

export const skillCategories: SkillCategory[] = [
  {
    title: "Frontend",
    icon: "frontend",
    skills: [
      { name: "HTML", level: 85 },
      { name: "CSS", level: 80 },
      { name: "JavaScript", level: 75 },
      { name: "React", level: 70 },
      { name: "Tailwind CSS", level: 75 },
    ],
  },
  {
    title: "Backend",
    icon: "backend",
    skills: [
      { name: "Node.js", level: 60 },
      { name: "Express", level: 55 },
    ],
  },
  {
    title: "Database",
    icon: "database",
    skills: [
      { name: "Firebase", level: 50 },
    ],
  },
  {
    title: "Tools",
    icon: "tools",
    skills: [
      { name: "Git", level: 70 },
      { name: "GitHub", level: 75 },
      { name: "VS Code", level: 85 },
    ],
  },
];
