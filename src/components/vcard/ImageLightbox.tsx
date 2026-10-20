"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiExternalLink } from "react-icons/fi";
import Image from "next/image";

interface ImageLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  altText: string;
  title?: string;
  subtitle?: string;
}

export default function ImageLightbox({
  isOpen,
  onClose,
  imageSrc,
  altText,
  title,
  subtitle,
}: ImageLightboxProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", stiffness: 350, damping: 28 }}
          className="relative max-w-lg w-full bg-[#1e1e1f] border border-[#383838] rounded-3xl overflow-hidden shadow-2xl z-10"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close Preview"
            className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 text-white/80 hover:text-white flex items-center justify-center border border-white/10 hover:border-amber-400/50 transition-all"
          >
            <FiX size={18} />
          </button>

          {/* Image Container */}
          <div className="relative w-full h-80 sm:h-96 bg-black/40 flex items-center justify-center overflow-hidden">
            <Image
              src={imageSrc}
              alt={altText}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 512px"
              priority
            />
          </div>

          {/* Footer info */}
          <div className="p-5 bg-[#181819] border-t border-[#2a2a2b] flex items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-heading font-semibold text-white">
                {title || altText}
              </h4>
              {subtitle && (
                <p className="text-xs text-muted-foreground font-mono mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>

            <a
              href={imageSrc}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-medium text-amber-300 hover:bg-amber-400/10 hover:border-amber-400/30 transition-all shrink-0"
            >
              Open Full <FiExternalLink size={12} />
            </a>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
