"use client";

import { motion } from "motion/react";
import { FaWhatsapp } from "react-icons/fa";
import { FiArrowUp, FiGithub, FiHeart, FiLinkedin, FiMail } from "react-icons/fi";

import type { ProfileViewModel } from "@/lib/types";

const links = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Certificates", href: "#certificates" },
  { label: "Contact", href: "#contact" },
];

export default function Footer({ profileData }: { profileData?: ProfileViewModel }) {
  const socialInfo = {
    github: profileData?.social.github ?? "",
    linkedin: profileData?.social.linkedin ?? "",
  };
  const contactInfo = {
    email: profileData?.contact.email ?? "",
    phone: profileData?.contact.phone ?? "",
  };
  const name = profileData?.name ?? "";

  const socials = [
    { icon: FiGithub, href: socialInfo.github, label: "GitHub" },
    { icon: FiLinkedin, href: socialInfo.linkedin, label: "LinkedIn" },
    contactInfo.email
      ? { icon: FiMail, href: `mailto:${contactInfo.email}`, label: "Email" }
      : null,
    contactInfo.phone
      ? {
          icon: FaWhatsapp,
          href: `https://wa.me/${contactInfo.phone.replace(/[^0-9]/g, "")}`,
          label: "WhatsApp",
        }
      : null,
  ].filter((social) => social !== null);

  return (
    <footer
      className="relative border-t border-border/30 pt-14 pb-24 md:py-14 px-4 md:px-8"
      role="contentinfo"
    >
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
            <span className="text-gradient">{name.charAt(0)}</span>
            {name.slice(1)}
          </a>
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap justify-center gap-5">
              {links.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
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

        <div className="text-center text-xs text-muted-foreground font-mono space-y-1">
          <p>
            © {new Date().getFullYear()} {name}
          </p>
          <p className="inline-flex items-center gap-1.5">
            Built with <FiHeart size={12} className="text-primary" /> Next.js & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
