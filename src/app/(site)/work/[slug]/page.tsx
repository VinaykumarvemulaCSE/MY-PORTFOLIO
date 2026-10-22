import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  FiArrowLeft,
  FiArrowUpRight,
  FiCheckCircle,
  FiChevronDown,
  FiClock,
  FiGithub,
  FiLayers,
} from "react-icons/fi";
import { getProjectImageAlt, getProjectImages } from "@/components/projects/projectUtils";
import { TECH_ICONS } from "@/constants/techIcons";
import { getProfile, getProjectBySlug, getProjectSlugs } from "@/lib/content";
import { toJsonLd } from "@/lib/jsonLd";
import { absoluteUrl, getSiteUrl } from "@/lib/site";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return { title: "Project not found" };
  }

  const title = `${project.title} — Case Study`;
  const description = project.tagline || project.description.slice(0, 160);

  return {
    title,
    description,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      url: `/work/${project.slug}`,
      images: project.coverImage ? [{ url: project.coverImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: project.coverImage ? [project.coverImage] : undefined,
    },
  };
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-primary mb-3">{title}</h2>
      <div className="text-muted-foreground leading-relaxed space-y-3">{children}</div>
    </section>
  );
}

export default async function WorkPage({ params }: PageProps) {
  const { slug } = await params;
  const [project, profile] = await Promise.all([getProjectBySlug(slug), getProfile()]);

  if (!project) notFound();

  const siteUrl = getSiteUrl();
  const caseStudy = project.caseStudy;
  const images = getProjectImages(project);

  /*
   * `description` holds the full write-up migrated from the old CMS, with its
   * own line breaks. Showing all of it as one paragraph produced an unreadable
   * wall of text, so the page leads with the first real paragraph and keeps the
   * rest in a collapsible at the bottom. The structured case-study fields below
   * still carry the scannable version.
   */
  const narrativeLines = project.description
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const lead =
    narrativeLines.find((line) => line.length > 140) ?? narrativeLines[0] ?? project.description;
  const hasFullNotes = project.description.trim().length > lead.length + 120;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: project.title,
    description: project.tagline || project.description.slice(0, 300),
    url: `${siteUrl}/work/${project.slug}`,
    codeRepository: project.githubLink,
    programmingLanguage: project.tech,
    author: { "@type": "Person", name: profile?.name ?? "Portfolio", url: siteUrl },
    ...(project.coverImage ? { image: absoluteUrl(project.coverImage) } : {}),
  };

  return (
    <div className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(jsonLd) }} />

      <header className="border-b border-border/30">
        <div className="max-w-4xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <FiArrowLeft size={15} />
            All projects
          </Link>
          <span className="text-xs font-mono text-muted-foreground">
            {profile?.name ?? "Portfolio"}
          </span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 md:px-8 py-12 pb-28 md:py-16">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-full">
            <FiCheckCircle size={12} />
            {project.status || "Completed"}
          </span>
          {project.difficulty && (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-muted-foreground bg-secondary/40 px-2.5 py-1 rounded-full">
              <FiLayers size={12} />
              {project.difficulty}
            </span>
          )}
          {project.timeInvestment && (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-muted-foreground bg-secondary/40 px-2.5 py-1 rounded-full">
              <FiClock size={12} />
              {project.timeInvestment}
            </span>
          )}
        </div>

        <h1 className="text-3xl md:text-5xl font-heading font-bold text-foreground leading-tight">
          {project.title}
        </h1>
        <p className="text-muted-foreground text-base md:text-lg mt-4 max-w-2xl leading-relaxed">
          {lead}
        </p>

        <div className="flex flex-wrap gap-2 mt-6">
          {project.tech.map((tech) => {
            const iconInfo = TECH_ICONS[tech];
            const Icon = iconInfo?.icon;
            return (
              <span
                key={tech}
                className="inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-lg border border-border/50 bg-secondary/30 text-foreground"
              >
                {Icon && <Icon size={13} style={{ color: iconInfo.color }} />}
                {tech}
              </span>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          {project.liveLink && (
            <a
              href={project.liveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 py-3 px-6 rounded-xl text-sm font-bold transition-all shadow-lg shadow-primary/20"
            >
              <FiArrowUpRight size={16} />
              View live project
            </a>
          )}
          {project.githubLink && (
            <a
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-secondary/40 hover:bg-secondary border border-border/50 text-foreground py-3 px-6 rounded-xl text-sm font-semibold transition-colors"
            >
              <FiGithub size={16} />
              Source code
            </a>
          )}
        </div>

        {project.coverImage && (
          <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border border-border/40 bg-secondary/20 mt-10">
            <Image
              src={project.coverImage}
              alt={getProjectImageAlt(project, project.coverImage, 0)}
              fill
              className="object-cover object-top"
              sizes="(max-width: 1024px) 100vw, 900px"
              priority
            />
          </div>
        )}

        {caseStudy?.problem && (
          <Section title={caseStudy.problemTitle || "The problem"}>
            <p className="whitespace-pre-line">{caseStudy.problem}</p>
          </Section>
        )}

        {caseStudy?.architecture && (
          <Section title={caseStudy.architectureTitle || "How it works"}>
            <p className="whitespace-pre-line">{caseStudy.architecture}</p>
          </Section>
        )}

        {caseStudy?.challenges && caseStudy.challenges.length > 0 && (
          <Section title={caseStudy.challengesTitle || "Challenges"}>
            <ul className="space-y-2">
              {caseStudy.challenges.map((challenge) => (
                <li key={challenge} className="flex gap-2.5">
                  <span className="text-primary mt-1.5 shrink-0">▸</span>
                  <span>{challenge}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {caseStudy?.whatBroke && (
          <Section title="What broke (and what I learned)">
            <p className="whitespace-pre-line">{caseStudy.whatBroke}</p>
          </Section>
        )}

        {caseStudy?.metrics && caseStudy.metrics.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-10">
            {caseStudy.metrics.map((metric) => (
              <div
                key={metric.label}
                className="p-4 rounded-xl bg-secondary/30 border border-border/40 text-center"
              >
                <p className="text-xl md:text-2xl font-heading font-bold text-gradient">
                  {metric.value}
                </p>
                <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mt-1">
                  {metric.label}
                </p>
              </div>
            ))}
          </div>
        )}

        {images.length > 1 && (
          <Section title="Gallery">
            <div className="grid sm:grid-cols-2 gap-4">
              {images.slice(1).map((image, index) => (
                <div
                  key={image}
                  className="relative aspect-[16/10] rounded-xl overflow-hidden border border-border/40 bg-secondary/20"
                >
                  <Image
                    src={image}
                    alt={getProjectImageAlt(project, image, index + 1)}
                    fill
                    className="object-contain"
                    sizes="(max-width: 640px) 100vw, 450px"
                  />
                </div>
              ))}
            </div>
          </Section>
        )}

        {hasFullNotes && (
          <details className="mt-12 group rounded-2xl border border-border/40 bg-secondary/20 p-5 md:p-6">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-foreground [&::-webkit-details-marker]:hidden">
              Complete project notes
              <FiChevronDown
                size={16}
                className="text-muted-foreground transition-transform group-open:rotate-180"
              />
            </summary>
            <div className="mt-5 whitespace-pre-line text-sm md:text-base text-muted-foreground leading-relaxed">
              {project.description}
            </div>
          </details>
        )}

        <div className="mt-14 pt-8 border-t border-border/30 flex flex-col sm:flex-row gap-3">
          <Link
            href="/projects"
            className="flex-1 inline-flex items-center justify-center gap-2 bg-secondary/40 hover:bg-secondary border border-border/50 text-foreground py-3.5 rounded-xl text-sm font-semibold transition-colors"
          >
            <FiArrowLeft size={15} />
            Back to all projects
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
