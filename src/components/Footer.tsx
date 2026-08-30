"use client";

import { FiGithub, FiLinkedin, FiMail, FiHeart, FiArrowUp } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";

const links = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export default function Footer({ profileData }: { profileData?: any }) {
  const socialInfo = profileData?.social || {};
  const contactInfo = profileData?.contact || {};
  const name = profileData?.name || "Vinay Kumar Vemula";

  const socials = [
    { icon: FiGithub, href: socialInfo.github || "https://github.com/VinaykumarvemulaCSE", label: "GitHub" },
    { icon: FiLinkedin, href: socialInfo.linkedin || "https://www.linkedin.com/in/vinaykumarvemula", label: "LinkedIn" },
    { icon: FiMail, href: `mailto:${contactInfo.email || "kumarvinay072007@gmail.com"}`, label: "Email" },
    { icon: FaWhatsapp, href: `https://wa.me/${(contactInfo.phone || "918019551015").replace(/[^0-9]/g, '')}`, label: "WhatsApp" },
  ];

  return (
    <footer className="relative border-t border-border/30 py-14 px-4 md:px-8" role="contentinfo">
      <div className="max-w-5xl mx-auto">
        {/* Back to top */}
        <div className="flex justify-center -mt-20 mb-10">
          <motion.a
            href="#home"
            whileHover={{ y: -3 }}
            className="w-10 h-10 rounded-full glass border border-border/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors"
            aria-label="Back to top"
          >
            <FiArrowUp size={16} />
          </motion.a>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-10">
          <a href="#home" className="font-heading font-bold text-xl text-foreground">
            <span className="text-gradient">{name.charAt(0)}</span>{name.slice(1)}
          </a>
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap justify-center gap-5">
              {links.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex gap-2">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl glass border border-border/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all"
                aria-label={s.label}
              >
                <s.icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <div className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1.5 font-mono">
          © {new Date().getFullYear()} {name} — Built with <FiHeart size={12} className="text-primary" /> Next.js & Tailwind CSS
        </div>
      </div>
    </footer>
  );
}
