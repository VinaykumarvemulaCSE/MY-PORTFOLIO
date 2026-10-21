"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import type { CertificateViewModel } from "@/lib/types";

import CertificateCard from "./certificates/CertificateCard";
import CertificateModal from "./certificates/CertificateModal";

interface CertificatesProps {
  certificates: CertificateViewModel[];
}

export default function Certificates({ certificates }: CertificatesProps) {
  const { ref, isVisible } = useScrollAnimation();
  const [selected, setSelected] = useState<CertificateViewModel | null>(null);

  return (
    <section id="certificates" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/3 right-0 w-[420px] h-[320px] bg-primary/5 rounded-full blur-[110px]" />
      </div>

      <div ref={ref} className="max-w-6xl mx-auto relative px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-3">
              Verified <span className="text-gradient">Certifications</span>
            </h2>
            <div className="w-12 h-1 bg-primary rounded-full mb-4" />
            <p className="text-muted-foreground max-w-xl">
              Open any credential to see the certificate and its details. Where the issuer provides
              a public verification page, the link is included so you can check it yourself.
            </p>
          </motion.div>
        </div>

        {certificates.length === 0 ? (
          <div className="text-center py-14 rounded-2xl border border-dashed border-border/50 text-muted-foreground">
            No certificates published yet.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((certificate, index) => (
              <CertificateCard
                key={certificate.id}
                certificate={certificate}
                onOpen={setSelected}
                isVisible={isVisible}
                delay={0.08 * (index + 1)}
              />
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selected && <CertificateModal certificate={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </section>
  );
}
