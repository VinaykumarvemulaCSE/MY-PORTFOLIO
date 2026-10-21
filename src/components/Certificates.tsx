"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import {
  FiAward,
  FiCheckCircle,
  FiChevronRight,
  FiExternalLink,
  FiHash,
  FiX,
} from "react-icons/fi";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

import type { CertificateViewModel } from "@/lib/sanity/types";

interface CertificatesProps {
  certificates: CertificateViewModel[];
}

function formatIssued(value?: string): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}

function initials(value: string): string {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

export default function Certificates({ certificates }: CertificatesProps) {
  const { ref, isVisible } = useScrollAnimation();
  const [selected, setSelected] = useState<CertificateViewModel | null>(null);

  const close = useCallback(() => setSelected(null), []);

  useEffect(() => {
    if (!selected) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [selected, close]);

  return (
    <section id="certificates" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/3 right-0 w-[420px] h-[320px] bg-primary/5 rounded-full blur-[110px]" />
      </div>

      <div ref={ref} className="max-w-6xl mx-auto relative px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-3">
            Verified <span className="text-gradient">Certifications</span>
          </h2>
          <div className="w-12 h-1 bg-primary rounded-full mb-4" />
          <p className="text-muted-foreground max-w-xl">
            Open any credential to see the certificate and its details. Where
            the issuer provides a public verification page, the link is included
            so you can check it yourself.
          </p>
        </motion.div>

        {certificates.length === 0 ? (
          <div className="text-center py-14 rounded-2xl border border-dashed border-border/50 text-muted-foreground">
            No certificates published yet.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((certificate, index) => {
              const issued =
                certificate.term ?? formatIssued(certificate.issueDate);
              const skills = certificate.skills ?? [];

              return (
                <motion.article
                  key={certificate.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.45, delay: 0.08 * (index + 1) }}
                  className="group glass border border-border/50 hover:border-primary/30 rounded-2xl overflow-hidden card-hover flex flex-col"
                >
                  <button
                    type="button"
                    onClick={() => setSelected(certificate)}
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

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />

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
                      {certificate.title}
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
                        onClick={() => setSelected(certificate)}
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
            })}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xl"
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label={selected.title}
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
                    {selected.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selected.issuer}
                    {selected.awardedBy ? ` · ${selected.awardedBy}` : ""}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={close}
                  className="p-2.5 rounded-xl bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors shrink-0"
                  aria-label="Close"
                >
                  <FiX size={20} />
                </button>
              </div>

              <div className="p-5 md:p-6 space-y-6">
                {selected.image && (
                  <div className="relative w-full aspect-[4/3] max-h-[38vh] rounded-2xl overflow-hidden border border-border/40 bg-secondary/20">
                    <Image
                      src={selected.image}
                      alt={`${selected.title} certificate`}
                      fill
                      className="object-contain"
                      sizes="(max-width: 1024px) 100vw, 900px"
                      priority
                    />
                  </div>
                )}

                {selected.summary && (
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    {selected.summary}
                  </p>
                )}

                <dl className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    {
                      label: selected.term ? "Term" : "Issued",
                      value: selected.term ?? formatIssued(selected.issueDate),
                    },
                    { label: "Score", value: selected.score },
                    { label: "Grade", value: selected.grade },
                    { label: "Duration", value: selected.duration },
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
                        <dd className="text-sm font-semibold text-foreground mt-0.5">
                          {item.value}
                        </dd>
                      </div>
                    ))}
                </dl>

                {selected.credentialId && (
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-secondary/30 border border-border/40">
                    <FiHash size={15} className="text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                        Credential ID
                      </p>
                      <p className="text-sm font-mono text-foreground break-all">
                        {selected.credentialId}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  {selected.verifyUrl && (
                    <a
                      href={selected.verifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 py-3 rounded-xl text-sm font-bold transition-all shadow-lg shadow-primary/20"
                    >
                      <FiExternalLink size={16} />
                      Verify at {selected.issuer}
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
