"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { FiAward, FiSearch } from "react-icons/fi";

import type { CertificateViewModel } from "@/lib/types";

import CertificateCard from "./certificates/CertificateCard";
import CertificateModal from "./certificates/CertificateModal";

interface CertificatesBrowserProps {
  certificates: CertificateViewModel[];
}

export default function CertificatesBrowser({ certificates }: CertificatesBrowserProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selected, setSelected] = useState<CertificateViewModel | null>(null);

  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(
        certificates
          .map((certificate) => certificate.category?.trim())
          .filter((value): value is string => Boolean(value))
      )
    ).sort();

    return ["All", ...unique];
  }, [certificates]);

  const filtered = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return certificates.filter((certificate) => {
      const matchesSearch =
        !query ||
        certificate.title.toLowerCase().includes(query) ||
        certificate.issuer.toLowerCase().includes(query) ||
        (certificate.awardedBy ?? "").toLowerCase().includes(query) ||
        (certificate.summary ?? "").toLowerCase().includes(query) ||
        certificate.skills.some((skill) => skill.toLowerCase().includes(query));

      const matchesCategory = activeCategory === "All" || certificate.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [certificates, searchQuery, activeCategory]);

  return (
    <div className="min-h-screen bg-background pt-24 pb-28 md:pb-16 px-4 md:px-8 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="mb-8">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs font-mono text-muted-foreground mb-6"
          >
            <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
              Home
            </Link>
            <span className="text-border">/</span>
            <span className="text-foreground font-semibold">Certificates archive</span>
          </nav>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4"
          >
            Certificate <span className="text-gradient">Archive</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg max-w-2xl"
          >
            Every credential in one place, with the issuer&apos;s verification link where one
            exists.
          </motion.p>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap items-center gap-2"
          >
            {categories.map((category) => (
              <button
                type="button"
                key={category}
                onClick={() => setActiveCategory(category)}
                aria-pressed={activeCategory === category}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === category
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground border border-border/50"
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="relative w-full md:w-72"
          >
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by title, issuer or skill..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-secondary/30 border border-border/50 rounded-2xl focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-sm placeholder:text-muted-foreground"
              aria-label="Search certificates"
            />
          </motion.div>
        </div>

        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-secondary/20 rounded-3xl border border-dashed border-border/50"
          >
            <FiAward className="mx-auto text-4xl text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
              No certificates found
            </h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("All");
              }}
              className="mt-6 text-primary hover:underline text-sm font-medium"
            >
              Clear all filters
            </button>
          </motion.div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filtered.map((certificate) => (
                <motion.div
                  key={certificate.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="h-full"
                >
                  <CertificateCard certificate={certificate} onOpen={setSelected} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {selected && <CertificateModal certificate={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  );
}
