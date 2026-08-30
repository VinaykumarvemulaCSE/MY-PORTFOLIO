"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowUp, FiMessageSquare, FiMail, FiX } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

export default function FloatingActions() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-20 md:bottom-6 right-5 md:right-6 z-50 flex flex-col items-end gap-3 pointer-events-auto">
      {/* Contact Quick Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-2 p-2 rounded-2xl glass border border-border/60 shadow-xl mb-1"
          >
            <a
              href="https://wa.me/918019551015"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
              aria-label="Chat on WhatsApp"
            >
              <FaWhatsapp size={16} /> WhatsApp
            </a>
            <a
              href="mailto:kumarvinay072007@gmail.com"
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-primary hover:bg-primary/10 transition-colors"
              aria-label="Send Email"
            >
              <FiMail size={16} /> Email Me
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-2">
        {/* Quick Contact Toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Quick Contact Menu"
          className="w-11 h-11 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/25 hover:opacity-90 transition-all glow-sm"
        >
          {menuOpen ? <FiX size={18} /> : <FiMessageSquare size={18} />}
        </motion.button>

        {/* Back to Top */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToTop}
              aria-label="Scroll to top"
              className="w-11 h-11 rounded-full glass border border-border/60 text-foreground flex items-center justify-center shadow-md hover:border-primary/40 hover:text-primary transition-all"
            >
              <FiArrowUp size={18} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
