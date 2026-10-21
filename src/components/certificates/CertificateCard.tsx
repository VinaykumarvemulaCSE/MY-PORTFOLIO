"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { FiAward, FiCheckCircle, FiChevronRight } from "react-icons/fi";

import type { CertificateViewModel } from "@/lib/types";

export function formatIssued(value?: string): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}

export function initials(value: string): string {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

interface CertificateCardProps {
  certificate: CertificateViewModel;
  onOpen: (certificate: CertificateViewModel) => void;
  isVisible?: boolean;
  delay?: number;
}

export default function CertificateCard({
  certificate,
  onOpen,
  isVisible = true,
  delay = 0,
}: CertificateCardProps) {
  const issued = certificate.term ?? formatIssued(certificate.issueDate);
  const skills = certificate.skills ?? [];

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay }}
      className="group glass border border-border/50 hover:border-primary/30 rounded-2xl overflow-hidden card-hover flex flex-col h-full"
    >
      <button
        type="button"
        onClick={() => onOpen(certificate)}
        className="relative w-full h-40 overflow-hidden bg-secondary/30 text-left"
        aria-label={`Preview ${certificate.title}`}
      >
        {certificate.image ? (
          <Image
            src={certificate.image}
            alt={`${certificate.title} certificate`}
            fill
            className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-primary/60">
            <FiAward size={30} />
            <span className="text-xs font-mono uppercase tracking-widest">
              {initials(certificate.issuer) || "Certificate"}
            </span>
          </div>
        )}

        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />

        {certificate.grade && (
          <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 bg-amber-700/95 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-md backdrop-blur-sm">
            {certificate.grade}
          </span>
        )}

        {issued && (
          <span className="absolute bottom-2.5 left-2.5 text-[10px] font-mono text-white/90 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10">
            {issued}
          </span>
        )}
      </button>

      <div className="flex flex-col flex-1 p-5">
        <h3 className="font-heading font-semibold text-foreground text-base leading-snug group-hover:text-primary transition-colors">
          <button
            type="button"
            onClick={() => onOpen(certificate)}
            className="text-left hover:underline decoration-primary/40 underline-offset-4 cursor-pointer"
          >
            {certificate.title}
          </button>
        </h3>

        <p className="text-xs text-muted-foreground mt-1.5">
          {certificate.issuer}
          {certificate.awardedBy ? ` · ${certificate.awardedBy}` : ""}
        </p>

        {skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {skills.slice(0, 3).map((skill) => (
              <span
                key={skill}
                className="text-[11px] font-mono px-2 py-0.5 rounded-md border border-border/50 bg-secondary/30 text-foreground"
              >
                {skill}
              </span>
            ))}
            {skills.length > 3 && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-border/50 bg-secondary/30 text-muted-foreground">
                +{skills.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="mt-auto pt-5 flex items-center gap-3">
          <button
            type="button"
            onClick={() => onOpen(certificate)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 bg-secondary/40 hover:bg-secondary border border-border/50 text-foreground py-2 rounded-lg text-xs font-semibold transition-colors"
          >
            View credential
            <FiChevronRight size={13} />
          </button>

          {certificate.verifyUrl && (
            <a
              href={certificate.verifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 py-2 px-3 rounded-lg text-xs font-bold transition-colors shadow-lg shadow-primary/20"
              aria-label={`Verify ${certificate.title} at ${certificate.issuer}`}
            >
              <FiCheckCircle size={13} />
              Verify
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}
