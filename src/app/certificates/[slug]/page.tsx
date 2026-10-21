import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  FiArrowLeft,
  FiArrowUpRight,
  FiAward,
  FiCheckCircle,
  FiClock,
  FiExternalLink,
  FiHash,
} from "react-icons/fi";

import { getCertificateBySlug, getCertificateSlugs, getProfile } from "@/lib/content";
import { toJsonLd } from "@/lib/jsonLd";
import { getSiteUrl } from "@/lib/site";

interface PageProps {
  params: Promise<{ slug: string }>;
}

function formatIssued(value?: string): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}

export async function generateStaticParams() {
  const slugs = await getCertificateSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const certificate = await getCertificateBySlug(slug);

  if (!certificate) {
    return { title: "Certificate not found" };
  }

  const title = `${certificate.title} — ${certificate.issuer}`;
  const description =
    certificate.summary ?? `${certificate.title} issued by ${certificate.issuer}.`;

  return {
    title,
    description,
    alternates: { canonical: `/certificates/${certificate.slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      images: certificate.image ? [{ url: certificate.image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: certificate.image ? [certificate.image] : undefined,
    },
  };
}

export default async function CertificatePage({ params }: PageProps) {
  const { slug } = await params;
  const [certificate, profile] = await Promise.all([getCertificateBySlug(slug), getProfile()]);

  if (!certificate) notFound();

  const siteUrl = getSiteUrl();
  const issued = certificate.term ?? formatIssued(certificate.issueDate);

  const facts = [
    { label: certificate.term ? "Term" : "Issued", value: issued },
    { label: "Score", value: certificate.score },
    { label: "Grade", value: certificate.grade },
    { label: "Duration", value: certificate.duration },
  ].filter((fact) => Boolean(fact.value));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOccupationalCredential",
    name: certificate.title,
    description: certificate.summary ?? undefined,
    url: `${siteUrl}/certificates/${certificate.slug}`,
    credentialCategory: certificate.category ?? "Certificate",
    ...(certificate.image ? { image: `${siteUrl}${certificate.image}` } : {}),
    ...(certificate.credentialId ? { identifier: certificate.credentialId } : {}),
    recognizedBy: {
      "@type": "Organization",
      name: certificate.issuer,
    },
    ...(certificate.awardedBy
      ? {
          awardedBy: {
            "@type": "Organization",
            name: certificate.awardedBy,
          },
        }
      : {}),
    ...(certificate.verifyUrl ? { sameAs: certificate.verifyUrl } : {}),
    about: certificate.skills,
    author: { "@type": "Person", name: profile.name, url: siteUrl },
  };

  return (
    <div className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(jsonLd) }} />

      <header className="border-b border-border/30">
        <div className="max-w-4xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <Link
            href="/certificates"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <FiArrowLeft size={15} />
            All certificates
          </Link>
          <span className="text-xs font-mono text-muted-foreground">{profile.name}</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {certificate.category && (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-full">
              <FiAward size={12} />
              {certificate.category}
            </span>
          )}
          {certificate.grade && (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-muted-foreground bg-secondary/40 px-2.5 py-1 rounded-full">
              <FiCheckCircle size={12} />
              {certificate.grade}
            </span>
          )}
          {certificate.duration && (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-muted-foreground bg-secondary/40 px-2.5 py-1 rounded-full">
              <FiClock size={12} />
              {certificate.duration}
            </span>
          )}
        </div>

        <h1 className="text-3xl md:text-5xl font-heading font-bold text-foreground leading-tight">
          {certificate.title}
        </h1>
        <p className="text-muted-foreground text-base md:text-lg mt-4 max-w-2xl leading-relaxed">
          {certificate.issuer}
          {certificate.awardedBy ? ` · ${certificate.awardedBy}` : ""}
        </p>

        {certificate.skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-6">
            {certificate.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-lg border border-border/50 bg-secondary/30 text-foreground"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          {certificate.verifyUrl && (
            <a
              href={certificate.verifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 py-3 px-6 rounded-xl text-sm font-bold transition-all shadow-lg shadow-primary/20"
            >
              <FiExternalLink size={16} />
              Verify at {certificate.issuer}
            </a>
          )}
          <Link
            href="/certificates"
            className="inline-flex items-center justify-center gap-2 bg-secondary/40 hover:bg-secondary border border-border/50 text-foreground py-3 px-6 rounded-xl text-sm font-semibold transition-colors"
          >
            <FiArrowLeft size={15} />
            Back to archive
          </Link>
        </div>

        {certificate.image && (
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-border/40 bg-secondary/20 mt-10">
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
          <section className="mt-10">
            <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-primary mb-3">
              About this credential
            </h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {certificate.summary}
            </p>
          </section>
        )}

        {facts.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-10">
            {facts.map((fact) => (
              <div
                key={fact.label}
                className="p-4 rounded-xl bg-secondary/30 border border-border/40"
              >
                <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                  {fact.label}
                </p>
                <p className="text-sm font-semibold text-foreground mt-1">{fact.value}</p>
              </div>
            ))}
          </div>
        )}

        {certificate.credentialId && (
          <div className="flex items-start gap-2.5 p-4 rounded-xl bg-secondary/30 border border-border/40 mt-6">
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

        <div className="mt-14 pt-8 border-t border-border/30 flex flex-col sm:flex-row gap-3">
          <Link
            href="/certificates"
            className="flex-1 inline-flex items-center justify-center gap-2 bg-secondary/40 hover:bg-secondary border border-border/50 text-foreground py-3.5 rounded-xl text-sm font-semibold transition-colors"
          >
            <FiArrowLeft size={15} />
            All certificates
          </Link>
          <Link
            href="/#contact"
            className="flex-1 inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 py-3.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-primary/20"
          >
            Work with me
            <FiArrowUpRight size={15} />
          </Link>
        </div>
      </main>
    </div>
  );
}
