import type { IconType } from "react-icons";
import { FiCloud, FiCode, FiCpu, FiDatabase, FiGlobe, FiLayers } from "react-icons/fi";
import {
  SiAngular,
  SiBootstrap,
  SiCplusplus,
  SiCss,
  SiDjango,
  SiDocker,
  SiExpress,
  SiFigma,
  SiFirebase,
  SiFlask,
  SiFramer,
  SiGit,
  SiGithub,
  SiGnubash,
  SiGooglecloud,
  SiGraphql,
  SiHtml5,
  SiJavascript,
  SiKubernetes,
  SiMongodb,
  SiMui,
  SiMysql,
  SiNetlify,
  SiNextdotjs,
  SiNodedotjs,
  SiOpenjdk,
  SiPostgresql,
  SiPostman,
  SiPrisma,
  SiPython,
  SiReact,
  SiRedis,
  SiRedux,
  SiSass,
  SiSharp,
  SiSpringboot,
  SiSqlite,
  SiStyledcomponents,
  SiSupabase,
  SiSvelte,
  SiTailwindcss,
  SiTerraform,
  SiTypescript,
  SiVercel,
  SiVite,
  SiVuedotjs,
} from "react-icons/si";

export interface TechIconInfo {
  name: string;
  icon: IconType;
  color: string;
}

export const TECH_ICONS: Record<string, TechIconInfo> = {
  // Languages
  HTML: { name: "HTML5", icon: SiHtml5, color: "#E34F26" },
  CSS: { name: "CSS3", icon: SiCss, color: "#1572B6" },
  Javascript: { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
  TypeScript: { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
  Python: { name: "Python", icon: SiPython, color: "#3776AB" },
  Java: { name: "Java", icon: SiOpenjdk, color: "#007396" },
  "C++": { name: "C++", icon: SiCplusplus, color: "#00599C" },
  "C#": { name: "C#", icon: SiSharp, color: "#239120" },
  Bash: { name: "Bash", icon: SiGnubash, color: "#4EAA25" },

  // Frontend
  React: { name: "React", icon: SiReact, color: "#61DAFB" },
  "Next.js": { name: "Next.js", icon: SiNextdotjs, color: "currentColor" },
  Vue: { name: "Vue.js", icon: SiVuedotjs, color: "#4FC08D" },
  Angular: { name: "Angular", icon: SiAngular, color: "#DD0031" },
  Svelte: { name: "Svelte", icon: SiSvelte, color: "#FF3E00" },
  Tailwind: { name: "Tailwind CSS", icon: SiTailwindcss, color: "#06B6D4" },
  Bootstrap: { name: "Bootstrap", icon: SiBootstrap, color: "#7952B3" },
  MUI: { name: "Material UI", icon: SiMui, color: "#007FFF" },
  Redux: { name: "Redux", icon: SiRedux, color: "#764ABC" },
  "Framer Motion": { name: "Framer Motion", icon: SiFramer, color: "#0055FF" },
  Vite: { name: "Vite", icon: SiVite, color: "#646CFF" },
  Sass: { name: "Sass", icon: SiSass, color: "#CC6699" },
  "Styled Components": { name: "Styled Components", icon: SiStyledcomponents, color: "#DB7093" },

  // Backend
  "Node.js": { name: "Node.js", icon: SiNodedotjs, color: "#339933" },
  Express: { name: "Express", icon: SiExpress, color: "#888888" },
  Django: { name: "Django", icon: SiDjango, color: "#44B78B" },
  Flask: { name: "Flask", icon: SiFlask, color: "currentColor" },
  "Spring Boot": { name: "Spring Boot", icon: SiSpringboot, color: "#6DB33F" },
  GraphQL: { name: "GraphQL", icon: SiGraphql, color: "#E10098" },
  Prisma: { name: "Prisma", icon: SiPrisma, color: "currentColor" },
  "REST APIs": { name: "REST APIs", icon: FiGlobe, color: "#0EA5E9" },
  SQL: { name: "SQL", icon: FiDatabase, color: "#4479A1" },

  // Computer science fundamentals
  DSA: { name: "Data Structures & Algorithms", icon: FiCode, color: "#8B5CF6" },
  OOP: { name: "Object-Oriented Programming", icon: FiLayers, color: "#F59E0B" },
  DBMS: { name: "Database Management", icon: FiDatabase, color: "#10B981" },
  OS: { name: "Operating Systems", icon: FiCpu, color: "#EF4444" },

  // Database
  MongoDB: { name: "MongoDB", icon: SiMongodb, color: "#47A248" },
  PostgreSQL: { name: "PostgreSQL", icon: SiPostgresql, color: "#4169E1" },
  MySQL: { name: "MySQL", icon: SiMysql, color: "#4479A1" },
  Firebase: { name: "Firebase", icon: SiFirebase, color: "#FFCA28" },
  Supabase: { name: "Supabase", icon: SiSupabase, color: "#3ECF8E" },
  Redis: { name: "Redis", icon: SiRedis, color: "#DC382D" },
  SQLite: { name: "SQLite", icon: SiSqlite, color: "#003B57" },

  // DevOps & Tools
  Docker: { name: "Docker", icon: SiDocker, color: "#2496ED" },
  Kubernetes: { name: "Kubernetes", icon: SiKubernetes, color: "#326CE5" },
  Git: { name: "Git", icon: SiGit, color: "#F05032" },
  GitHub: { name: "GitHub", icon: SiGithub, color: "currentColor" },
  Vercel: { name: "Vercel", icon: SiVercel, color: "currentColor" },
  Netlify: { name: "Netlify", icon: SiNetlify, color: "#00C7B7" },
  "Google Cloud": { name: "Google Cloud", icon: SiGooglecloud, color: "#4285F4" },
  Azure: { name: "Azure", icon: FiCloud, color: "#0089D6" },
  AWS: { name: "AWS", icon: FiCloud, color: "#232F3E" },
  Terraform: { name: "Terraform", icon: SiTerraform, color: "#7B42BC" },
  Postman: { name: "Postman", icon: SiPostman, color: "#FF6C37" },
  Figma: { name: "Figma", icon: SiFigma, color: "#F24E1E" },
};
