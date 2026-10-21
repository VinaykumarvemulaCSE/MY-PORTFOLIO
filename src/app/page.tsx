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
import { getSiteUrl } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const [profile, settings] = await Promise.all([getProfile(), getSiteSettings()]);
  const url = getSiteUrl();

  return {
    metadataBase: new URL(url),
    title: settings.title,
    description: settings.description,
    keywords: [
      "Vinay Kumar Vemula",
      "Full Stack Developer",
      "Next.js",
      "React",
      "TypeScript",
      "Portfolio",
      "Computer Science Student",
      "Software Engineer Intern",
    ],
    authors: [{ name: profile.name, url }],
    openGraph: {
      title: settings.title,
      description: settings.description,
      url,
      siteName: `${profile.name} Portfolio`,
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: settings.title,
      description: settings.description,
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
    image: profile.profileImage
      ? profile.profileImage.startsWith("http")
        ? profile.profileImage
        : `${siteUrl}${profile.profileImage}`
      : undefined,
    email: profile.contact.email,
    sameAs: [profile.social.github, profile.social.linkedin].filter(Boolean),
    knowsAbout: ["React", "Next.js", "TypeScript", "Node.js", "Full Stack Development"],
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
      <Navbar />
      <main>
        <Hero profileData={profile} />
        <About profileData={profile} />
        <Skills groups={skills} />
        <Projects initialProjects={projects} />
        <Certificates certificates={certificates} />
        <Contact profileData={profile} />
      </main>
      <Footer profileData={profile} />
    </div>
  );
}
