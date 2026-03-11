export interface Project {
  title: string;
  description: string;
  status: "Live" | "In Progress" | "Coming Soon";
  tags: string[];
  github?: string;
  demo?: string;
}

export const projects: Project[] = [
  {
    title: "Developer Portfolio",
    description: "A modern, production-quality portfolio built with React, Tailwind CSS, and Framer Motion. Features responsive design, dark mode, and interactive data visualizations.",
    status: "Live",
    tags: ["React", "Tailwind CSS", "Framer Motion"],
    github: "https://github.com/vinay",
  },
  {
    title: "Task Management App",
    description: "A full-stack task management application with real-time updates, user authentication, and collaborative features.",
    status: "Coming Soon",
    tags: ["React", "Node.js", "Firebase"],
  },
  {
    title: "E-Commerce Platform",
    description: "A scalable e-commerce solution with product management, cart functionality, and payment integration.",
    status: "Coming Soon",
    tags: ["React", "Express", "Stripe"],
  },
];
