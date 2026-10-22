import type { Metadata } from "next";
import About from "@/components/About";
import Certificates from "@/components/Certificates";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import {
  getCertificates,
  getProfile,
  getProjects,
  getSiteSettings,
  getSkillGroups,
} from "@/lib/content";
import { toJsonLd } from "@/lib/jsonLd";
import { absoluteUrl, getSiteUrl } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const [profile, settings] = await Promise.all([getProfile(), getSiteSettings()]);
  const url = getSiteUrl();
  const title = settings?.title ?? "Portfolio";
  const description = settings?.description ?? "";
  const siteName = profile ? `${profile.name} Portfolio` : "Portfolio";

  return {
    metadataBase: new URL(url),
    title,
    description,
    alternates: { canonical: "/" },
    keywords: [
      "Portfolio",
      "Full Stack Developer",
      "Next.js",
      "React",
      "TypeScript",
      "Software Engineer Intern",
    ],
    authors: profile ? [{ name: profile.name, url }] : undefined,
    openGraph: {
      title,
      description,
      url,
      siteName,
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function Home() {
  // Server-rendered profile, projects, skills and certificates.
  const [profile, projects, certificates, skills] = await Promise.all([
    getProfile(),
    getProjects(),
    getCertificates(),
    getSkillGroups(),
  ]);

  if (!profile) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-6 text-center">
        <div className="max-w-md space-y-3">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">Coming soon</p>
          <h1 className="font-heading text-3xl font-semibold text-foreground">
            This portfolio is being set up
          </h1>
          <p className="text-sm text-muted-foreground">
            Content hasn&apos;t been published yet. Please check back soon.
          </p>
        </div>
      </main>
    );
  }

  const siteUrl = getSiteUrl();

  // Person schema ties the domain, the social profiles and the work together so
  // search engines can attribute the site to one person.
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.roles[0],
    description: profile.bio,
    url: siteUrl,
    image: profile.profileImage ? absoluteUrl(profile.profileImage) : undefined,
    email: profile.contact.email,
    sameAs: [profile.social.github, profile.social.linkedin].filter(Boolean),
    knowsAbout: skills.flatMap((group) => group.skills.map((skill) => skill.name)).slice(0, 12),
    alumniOf: profile.education.institution
      ? {
          "@type": "EducationalOrganization",
          name: profile.education.institution,
        }
      : undefined,
  };

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(personJsonLd) }}
      />
      <Navbar name={profile.name} />
      <main>
        <Hero profileData={profile} />
        <About profileData={profile} />
        <Skills groups={skills} />
        <Projects
          initialProjects={projects}
          projectLimit={profile.siteConfig.homepageProjectLimit ?? 5}
        />
        <Certificates certificates={certificates} />
        <Contact profileData={profile} />
      </main>
      <Footer profileData={profile} />
    </div>
  );
}
