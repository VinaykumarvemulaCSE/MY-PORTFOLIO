import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Certificates from "@/components/Certificates";
import Architecture from "@/components/Architecture";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { getCertificates, getProfile, getProjects } from "@/lib/sanity";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  const { siteConfig } = profile;
  const url = siteConfig.url || "https://vinaykumar.eu.cc";

  return {
    metadataBase: new URL(url),
    title: siteConfig.title,
    description: siteConfig.description,
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
      title: siteConfig.title,
      description: siteConfig.description,
      url,
      siteName: `${profile.name} Portfolio`,
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: siteConfig.title,
      description: siteConfig.description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function Home() {
  // Server-rendered profile & projects with Sanity/JSON fallback
  const [profile, projects, certificates] = await Promise.all([
    getProfile(),
    getProjects(),
    getCertificates(),
  ]);

  const siteUrl = (profile.siteConfig.url || "https://vinaykumar.eu.cc").replace(/\/$/, "");

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
    knowsAbout: [
      "React",
      "Next.js",
      "TypeScript",
      "Node.js",
      "Full Stack Development",
    ],
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <Navbar />
      <main>
        <Hero profileData={profile} />
        <About profileData={profile} />
        <Skills />
        <Projects initialProjects={projects} />
        <Certificates certificates={certificates} />
        <Architecture />
        <Contact profileData={profile} />
      </main>
      <Footer profileData={profile} />
    </div>
  );
}
