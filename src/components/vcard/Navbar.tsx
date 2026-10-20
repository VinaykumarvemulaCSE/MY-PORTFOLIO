"use client";

import { motion } from "framer-motion";

export type TabType = "about" | "resume" | "projects" | "certificates" | "contact";

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const TABS: { id: TabType; label: string }[] = [
  { id: "about", label: "About" },
  { id: "resume", label: "Resume" },
  { id: "projects", label: "Projects" },
  { id: "certificates", label: "Certificates" },
  { id: "contact", label: "Contact" },
];

export default function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  return (
    <nav
      role="navigation"
      aria-label="Portfolio sections"
      className="xl:absolute xl:top-0 xl:right-0 z-30 bg-[#282829]/90 backdrop-blur-xl border border-[#383838]/80 xl:border-t-0 xl:border-r-0 xl:rounded-bl-3xl xl:rounded-tr-3xl rounded-2xl p-1.5 shadow-xl max-w-full overflow-x-auto scrollbar-none"
    >
      <ul className="flex items-center gap-1 min-w-max">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <li key={tab.id}>
              <button
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  isActive
                    ? "text-amber-300 font-semibold"
                    : "text-muted-foreground hover:text-white"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                {tab.label}
                {isActive && (
                  <motion.div
                    layoutId="activeTabPill"
                    className="absolute inset-0 bg-amber-400/10 border border-amber-400/30 rounded-xl -z-10 shadow-sm"
                    transition={{ type: "spring", stiffness: 450, damping: 35 }}
                  />
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
