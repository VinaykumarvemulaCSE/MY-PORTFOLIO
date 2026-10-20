import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  FiArrowLeft,
  FiAward,
  FiCheckCircle,
  FiExternalLink,
  FiHash,
} from "react-icons/fi";

import {
  getCertificateBySlug,
  getCertificateSlugs,
  getProfile,
} from "@/lib/sanity";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getCertificateSlugs();
  return slugs.map((slug) => ({ slug }));
}

function formatIssued(value?: string): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const certificate = await getCertificateBySlug(slug);

  if (!certificate) {
    return { title: "Certificate not found" };
  }

  const title = `${certificate.title} — ${certificate.issuer}`;
  const description =
    certificate.summary ??
    `${certificate.title} issued by ${certificate.issuer}${
      certificate.grade ? ` (${certificate.grade})` : ""
    }.`;

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

function Fact({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="p-4 rounded-xl bg-secondary/30 border border-border/40">
      <dt className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
        {label}
      </dt>
      <dd
        className={`text-sm font-semibold text-foreground mt-1 ${
          mono ? "font-mono break-all" : ""
        }`}
      >
        {value}
      </dd>
    </div>
  );
}

export default async function CertificatePage({ params }: PageProps) {
  const { slug } = await params;
  const [certificate, profile] = await Promise.all([
    getCertificateBySlug(slug),
    getProfile(),
  ]);

  if (!certificate) notFound();

  const issued = formatIssued(certificate.issueDate);
  const siteUrl = profile.siteConfig.url || "https://vinaykumar.eu.cc";

  const facts: { label: string; value?: string; mono?: boolean }[] = [
    {
      label: certificate.term ? "Term" : "Issued",
      value: certificate.term ?? issued ?? undefined,
    },
    { label: "Score", value: certificate.score },
    { label: "Grade", value: certificate.grade },
    { label: "Duration", value: certificate.duration },
    { label: "Category", value: certificate.category },
  ];

  // Structured data helps Google show this as a credential rather than a
  // generic page, and gives the verification URL a machine-readable home.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOccupationalCredential",
    name: certificate.title,
    description: certificate.summary,
    credentialCategory: certificate.category,
    url: `${siteUrl}/certificates/${certificate.slug}`,
    ...(certificate.credentialId
      ? { identifier: certificate.credentialId }
      : {}),
    ...(issued ? { dateCreated: certificate.issueDate } : {}),
    ...(certificate.verifyUrl
      ? { sameAs: certificate.verifyUrl }
      : {}),
    recognizedBy: {
      "@type": "Organization",
      name: certificate.awardedBy
        ? `${certificate.issuer} (${certificate.awardedBy})`
        : certificate.issuer,
    },
    about: certificate.skills ?? [],
    ...(certificate.image ? { image: certificate.image } : {}),
  };

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="border-b border-border/30">
        <div className="max-w-4xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <Link
            href="/#certificates"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <FiArrowLeft size={15} />
            Back to portfolio
          </Link>
          <span className="text-xs font-mono text-muted-foreground">
            {profile.name}
          </span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-full">
            <FiAward size={12} />
            {certificate.issuer}
          </span>
          {certificate.grade && (
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full">
              {certificate.grade}
            </span>
          )}
        </div>

        <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground leading-tight">
          {certificate.title}
        </h1>
        <p className="text-muted-foreground mt-3">
          {certificate.awardedBy
            ? `Awarded by ${certificate.issuer} · ${certificate.awardedBy}`
            : `Awarded by ${certificate.issuer}`}
          {issued ? ` · ${issued}` : ""}
        </p>

        {certificate.image && (
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-border/40 bg-secondary/20 mt-8">
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
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed mt-8">
            {certificate.summary}
          </p>
        )}

        <dl className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-8">
          {facts
            .filter((fact): fact is { label: string; value: string; mono?: boolean } =>
              Boolean(fact.value),
            )
            .map((fact) => (
              <Fact key={fact.label} label={fact.label} value={fact.value} mono={fact.mono} />
            ))}
        </dl>

        {certificate.credentialId && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-secondary/30 border border-border/40 mt-3">
            <FiHash size={16} className="text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                Credential ID
              </p>
              <p className="text-sm font-mono text-foreground break-all mt-0.5">
                {certificate.credentialId}
              </p>
            </div>
          </div>
        )}

        {(certificate.skills ?? []).length > 0 && (
          <div className="mt-8">
            <h2 className="text-sm uppercase tracking-widest text-muted-foreground font-bold mb-3">
              Skills covered
            </h2>
            <div className="flex flex-wrap gap-2">
              {(certificate.skills ?? []).map((skill) => (
                <span
                  key={skill}
                  className="text-xs font-mono px-3 py-1.5 rounded-lg border border-border/50 bg-secondary/30 text-foreground"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 mt-10 pt-8 border-t border-border/30">
          {certificate.verifyUrl ? (
            <a
              href={certificate.verifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 py-3.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-primary/20"
            >
              <FiCheckCircle size={16} />
              Verify this credential
            </a>
          ) : (
            <p className="flex-1 text-sm text-muted-foreground">
              No public verification link was provided for this credential.
            </p>
          )}
          <a
            href={`mailto:${profile.contact.email}`}
            className="inline-flex items-center justify-center gap-2 bg-secondary/40 hover:bg-secondary border border-border/50 text-foreground py-3.5 px-6 rounded-xl text-sm font-semibold transition-colors"
          >
            <FiExternalLink size={15} />
            Ask me about it
          </a>
        </div>
      </main>
    </div>
  );
}
