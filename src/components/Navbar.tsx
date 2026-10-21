"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { useActiveSection } from "@/hooks/useActiveSection";

const NAV_ITEMS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Certificates", href: "#certificates" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const active = useActiveSection();

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border/30"
      aria-label="Main navigation"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 md:px-8 h-16">
        <a href="#home" className="font-heading font-bold text-xl text-foreground group">
          <span className="text-gradient">Vinay</span> Kumar Vemula
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary ml-0.5 mb-2 group-hover:animate-pulse" />
        </a>

        <ul className="hidden md:flex items-center gap-0.5">
          {NAV_ITEMS.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className={`relative px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  active === item.href.slice(1)
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                aria-current={active === item.href.slice(1) ? "page" : undefined}
              >
                {item.label}
                {active === item.href.slice(1) && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 bg-primary/10 rounded-lg -z-10"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex md:hidden items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-foreground"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <HiX size={22} /> : <HiMenu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border/30 glass overflow-hidden"
          >
            <ul className="flex flex-col p-4 gap-1">
              {NAV_ITEMS.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      active === item.href.slice(1)
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
