"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiAward, FiExternalLink, FiCheckCircle, FiShield } from "react-icons/fi";

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialId?: string;
  verifyUrl?: string;
  category?: string;
  skills?: string[];
}

export default function CertificatesSection() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/data/certificates.json?t=${Date.now()}`)
      .then((res) => res.json())
      .then((data: Certificate[]) => setCertificates(data))
      .catch((err) => console.error("Failed to load certificates:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Title */}
      <div>
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-white tracking-tight">
          Certificates & <span className="text-amber-400">Credentials</span>
        </h2>
        <div className="w-12 h-1 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full mt-2" />
        <p className="text-sm text-muted-foreground mt-3">
          Verified technical certifications and credentials earned through competitive platforms and coursework.
        </p>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
        </div>
      ) : certificates.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground text-sm">
          No certificates loaded yet.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="p-5 rounded-2xl bg-[#222224] border border-[#383838]/60 hover:border-amber-400/40 transition-all duration-300 shadow-md flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#2b2b2c] border border-white/5 text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:border-amber-400/30 transition-all">
                    <FiAward size={20} />
                  </div>

                  {cert.credentialId && (
                    <div className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono flex items-center gap-1">
                      <FiShield size={11} /> Verified
                    </div>
                  )}
                </div>

                <h3 className="text-base font-heading font-bold text-white group-hover:text-amber-300 transition-colors">
                  {cert.title}
                </h3>
                <p className="text-xs font-mono text-amber-300/80 mt-1">
                  {cert.issuer} • Issued {cert.issueDate}
                </p>

                {cert.credentialId && (
                  <p className="text-[11px] font-mono text-muted-foreground mt-1">
                    ID: {cert.credentialId}
                  </p>
                )}

                {/* Skills tags */}
                {cert.skills && cert.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {cert.skills.map((s) => (
                      <span
                        key={s}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#282829] border border-white/5 text-white/80"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Button */}
              {cert.verifyUrl && (
                <div className="mt-4 pt-3 border-t border-[#383838]/40">
                  <a
                    href={cert.verifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-300 hover:text-amber-200 transition-colors"
                  >
                    Verify Credential <FiExternalLink size={12} />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </motion.section>
  );
}
