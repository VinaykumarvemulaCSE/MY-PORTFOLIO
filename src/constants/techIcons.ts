import { 
  SiHtml5, SiCss, SiJavascript, SiTypescript, SiReact, SiTailwindcss, 
  SiNextdotjs, SiNodedotjs, SiExpress, SiMongodb, SiPostgresql, SiFirebase, 
  SiSupabase, SiPrisma, SiRedux, SiVite, SiDocker, SiPython, SiDjango, 
  SiFlask, SiOpenjdk, SiSpringboot, SiCplusplus, SiSharp, SiGnubash,
  SiGit, SiGithub, SiVercel, SiNetlify, SiPostman, SiFigma, SiFramer,
  SiBootstrap, SiMui, SiStyledcomponents, SiSass, SiGraphql,
  SiRedis, SiSqlite, SiMysql, SiGooglecloud,
  SiKubernetes, SiTerraform, SiAnsible, SiVuedotjs, SiAngular, SiSvelte
} from "react-icons/si";
import { FiCode, FiGlobe, FiDatabase, FiLayers, FiLayout, FiCpu, FiCloud, FiShield, FiSmartphone } from "react-icons/fi";
import { IconType } from "react-icons";

export interface TechIconInfo {
  name: string;
  icon: IconType;
  color: string;
}

export const TECH_ICONS: Record<string, TechIconInfo> = {
  // Languages
  "HTML": { name: "HTML5", icon: SiHtml5, color: "#E34F26" },
  "CSS": { name: "CSS3", icon: SiCss, color: "#1572B6" },
  "Javascript": { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
  "TypeScript": { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
  "Python": { name: "Python", icon: SiPython, color: "#3776AB" },
  "Java": { name: "Java", icon: SiOpenjdk, color: "#007396" },
  "C++": { name: "C++", icon: SiCplusplus, color: "#00599C" },
  "C#": { name: "C#", icon: SiSharp, color: "#239120" },
  "Bash": { name: "Bash", icon: SiGnubash, color: "#4EAA25" },

  // Frontend
  "React": { name: "React", icon: SiReact, color: "#61DAFB" },
  "Next.js": { name: "Next.js", icon: SiNextdotjs, color: "#000000" },
  "Vue": { name: "Vue.js", icon: SiVuedotjs, color: "#4FC08D" },
  "Angular": { name: "Angular", icon: SiAngular, color: "#DD0031" },
  "Svelte": { name: "Svelte", icon: SiSvelte, color: "#FF3E00" },
  "Tailwind": { name: "Tailwind CSS", icon: SiTailwindcss, color: "#06B6D4" },
  "Bootstrap": { name: "Bootstrap", icon: SiBootstrap, color: "#7952B3" },
  "MUI": { name: "Material UI", icon: SiMui, color: "#007FFF" },
  "Redux": { name: "Redux", icon: SiRedux, color: "#764ABC" },
  "Framer Motion": { name: "Framer Motion", icon: SiFramer, color: "#0055FF" },
  "Vite": { name: "Vite", icon: SiVite, color: "#646CFF" },
  "Sass": { name: "Sass", icon: SiSass, color: "#CC6699" },
  "Styled Components": { name: "Styled Components", icon: SiStyledcomponents, color: "#DB7093" },

  // Backend
  "Node.js": { name: "Node.js", icon: SiNodedotjs, color: "#339933" },
  "Express": { name: "Express", icon: SiExpress, color: "#888888" },
  "Django": { name: "Django", icon: SiDjango, color: "#092E20" },
  "Flask": { name: "Flask", icon: SiFlask, color: "#000000" },
  "Spring Boot": { name: "Spring Boot", icon: SiSpringboot, color: "#6DB33F" },
  "GraphQL": { name: "GraphQL", icon: SiGraphql, color: "#E10098" },
  "Prisma": { name: "Prisma", icon: SiPrisma, color: "#2D3748" },

  // Database
  "MongoDB": { name: "MongoDB", icon: SiMongodb, color: "#47A248" },
  "PostgreSQL": { name: "PostgreSQL", icon: SiPostgresql, color: "#4169E1" },
  "MySQL": { name: "MySQL", icon: SiMysql, color: "#4479A1" },
  "Firebase": { name: "Firebase", icon: SiFirebase, color: "#FFCA28" },
  "Supabase": { name: "Supabase", icon: SiSupabase, color: "#3ECF8E" },
  "Redis": { name: "Redis", icon: SiRedis, color: "#DC382D" },
  "SQLite": { name: "SQLite", icon: SiSqlite, color: "#003B57" },

  // DevOps & Tools
  "Docker": { name: "Docker", icon: SiDocker, color: "#2496ED" },
  "Kubernetes": { name: "Kubernetes", icon: SiKubernetes, color: "#326CE5" },
  "Git": { name: "Git", icon: SiGit, color: "#F05032" },
  "GitHub": { name: "GitHub", icon: SiGithub, color: "#181717" },
  "Vercel": { name: "Vercel", icon: SiVercel, color: "#000000" },
  "Netlify": { name: "Netlify", icon: SiNetlify, color: "#00C7B7" },
  "Google Cloud": { name: "Google Cloud", icon: SiGooglecloud, color: "#4285F4" },
  "Azure": { name: "Azure", icon: FiCloud, color: "#0089D6" },
  "AWS": { name: "AWS", icon: FiCloud, color: "#232F3E" },
  "Terraform": { name: "Terraform", icon: SiTerraform, color: "#7B42BC" },
  "Postman": { name: "Postman", icon: SiPostman, color: "#FF6C37" },
  "Figma": { name: "Figma", icon: SiFigma, color: "#F24E1E" }
};

// Default icons for categories if specific tech not found
export const CATEGORY_ICONS = {
  frontend: FiLayout,
  backend: FiCpu,
  database: FiDatabase,
  tools: FiLayers,
  cloud: FiCloud,
  security: FiShield,
  mobile: FiSmartphone,
  code: FiCode,
  other: FiGlobe
};

export const getAllTechNames = () => Object.keys(TECH_ICONS).sort();
