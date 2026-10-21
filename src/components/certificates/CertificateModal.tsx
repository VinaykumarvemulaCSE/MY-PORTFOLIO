"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect } from "react";
import { FiExternalLink, FiHash, FiX } from "react-icons/fi";

import type { CertificateViewModel } from "@/lib/types";

import { formatIssued } from "./CertificateCard";

interface CertificateModalProps {
  certificate: CertificateViewModel;
  onClose: () => void;
}

export default function CertificateModal({ certificate, onClose }: CertificateModalProps) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xl"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label={certificate.title}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 12 }}
          transition={{ duration: 0.2 }}
          onClick={(event) => event.stopPropagation()}
          className="w-full max-w-4xl max-h-[90vh] overflow-y-auto overscroll-contain glass border border-border/60 rounded-3xl shadow-2xl"
        >
          <div className="flex items-start justify-between gap-4 p-5 md:p-6 border-b border-border/40">
            <div>
              <h3 className="text-lg md:text-xl font-heading font-bold text-foreground">
                {certificate.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {certificate.issuer}
                {certificate.awardedBy ? ` · ${certificate.awardedBy}` : ""}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2.5 rounded-xl bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors shrink-0"
              aria-label="Close"
            >
              <FiX size={20} />
            </button>
          </div>

          <div className="p-5 md:p-6 space-y-6">
            {certificate.image && (
              <div className="relative w-full aspect-[4/3] max-h-[38vh] rounded-2xl overflow-hidden border border-border/40 bg-secondary/20">
                <Image
                  src={certificate.image}
                  alt={`${certificate.title} certificate`}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 900px"
                  priority
                />
              </div>
            )}

            {certificate.summary && (
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {certificate.summary}
              </p>
            )}

            <dl className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                {
                  label: certificate.term ? "Term" : "Issued",
                  value: certificate.term ?? formatIssued(certificate.issueDate),
                },
                { label: "Score", value: certificate.score },
                { label: "Grade", value: certificate.grade },
                { label: "Duration", value: certificate.duration },
              ]
                .filter((item) => Boolean(item.value))
                .map((item) => (
                  <div
                    key={item.label}
                    className="p-3 rounded-xl bg-secondary/30 border border-border/40"
                  >
                    <dt className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                      {item.label}
                    </dt>
                    <dd className="text-sm font-semibold text-foreground mt-0.5">{item.value}</dd>
                  </div>
                ))}
            </dl>

            {certificate.credentialId && (
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-secondary/30 border border-border/40">
                <FiHash size={15} className="text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                    Credential ID
                  </p>
                  <p className="text-sm font-mono text-foreground break-all">
                    {certificate.credentialId}
                  </p>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              {certificate.verifyUrl && (
                <a
                  href={certificate.verifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 py-3 rounded-xl text-sm font-bold transition-all shadow-lg shadow-primary/20"
                >
                  <FiExternalLink size={16} />
                  Verify at {certificate.issuer}
                </a>
              )}
              <button
                type="button"
                onClick={onClose}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-secondary/50 hover:bg-secondary border border-border/40 text-foreground py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
