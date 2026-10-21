"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { FiHome, FiFolder, FiCpu, FiMail, FiAward } from "react-icons/fi";

export default function MobileBottomNav() {
  const pathname = usePathname();

  const triggerHaptic = () => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(12);
      } catch (e) {
        // Haptics are a nice-to-have; ignore unsupported or blocked calls.
      }
    }
  };

  const navItems = [
    { label: "Home", href: "/#home", icon: FiHome },
    { label: "Projects", href: "/projects", icon: FiFolder, isActive: pathname === "/projects" },
    { label: "Skills", href: "/#skills", icon: FiCpu },
    { label: "Certs", href: "/#certificates", icon: FiAward },
    { label: "Contact", href: "/#contact", icon: FiMail },
  ];

  return (
    <nav 
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/85 backdrop-blur-xl border-t border-border/60 px-4 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] flex items-center justify-around shadow-2xl"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.label}
            href={item.href}
            onClick={triggerHaptic}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
              item.isActive 
                ? "text-primary font-bold" 
                : "text-muted-foreground hover:text-foreground active:scale-95"
            }`}
          >
            <Icon size={18} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
