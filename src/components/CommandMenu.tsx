"use client";

import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { FiHome, FiFolder, FiMail, FiDownload, FiSettings, FiMoon, FiSun } from "react-icons/fi";
import { RxDashboard } from "react-icons/rx";

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // Toggle the menu when ⌘K is pressed
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[20vh] bg-background/50 backdrop-blur-sm p-4">
      <div 
        className="fixed inset-0" 
        onClick={() => setOpen(false)} 
        aria-hidden="true"
      />
      <Command 
        className="relative w-full max-w-lg bg-background border border-border/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        label="Global Command Menu"
      >
        <div className="flex items-center px-4 border-b border-border/50">
          <Command.Input 
            autoFocus
            placeholder="Type a command or search..." 
            className="w-full bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none py-4 text-sm font-medium"
          />
        </div>

        <Command.List className="max-h-[300px] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
          <Command.Empty className="p-6 text-center text-sm text-muted-foreground">
            No results found.
          </Command.Empty>

          <Command.Group heading="Navigation" className="text-xs font-semibold text-muted-foreground px-2 py-2">
            <Command.Item
              onSelect={() => runCommand(() => router.push("/"))}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground cursor-pointer hover:bg-secondary/50 transition-colors aria-selected:bg-primary/10 aria-selected:text-primary mt-1"
            >
              <FiHome className="text-muted-foreground" /> Home
            </Command.Item>
            <Command.Item
              onSelect={() => runCommand(() => router.push("/projects"))}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground cursor-pointer hover:bg-secondary/50 transition-colors aria-selected:bg-primary/10 aria-selected:text-primary mt-1"
            >
              <FiFolder className="text-muted-foreground" /> Projects Archive
            </Command.Item>
            <Command.Item
              onSelect={() => runCommand(() => router.push("/admin"))}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground cursor-pointer hover:bg-secondary/50 transition-colors aria-selected:bg-primary/10 aria-selected:text-primary mt-1"
            >
              <RxDashboard className="text-muted-foreground" /> Admin Dashboard
            </Command.Item>
          </Command.Group>

          <Command.Group heading="Actions" className="text-xs font-semibold text-muted-foreground px-2 py-2 border-t border-border/30 mt-2">
            <Command.Item
              onSelect={() => runCommand(() => window.open("/RESUME.pdf", "_blank"))}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground cursor-pointer hover:bg-secondary/50 transition-colors aria-selected:bg-primary/10 aria-selected:text-primary mt-1"
            >
              <FiDownload className="text-muted-foreground" /> Download Resume
            </Command.Item>
            <Command.Item
              onSelect={() => runCommand(() => {
                const contactSection = document.getElementById("contact");
                if (contactSection) {
                  contactSection.scrollIntoView({ behavior: "smooth" });
                } else {
                  router.push("/#contact");
                }
              })}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground cursor-pointer hover:bg-secondary/50 transition-colors aria-selected:bg-primary/10 aria-selected:text-primary mt-1"
            >
              <FiMail className="text-muted-foreground" /> Contact Me
            </Command.Item>
          </Command.Group>

        </Command.List>
      </Command>
    </div>
  );
}
