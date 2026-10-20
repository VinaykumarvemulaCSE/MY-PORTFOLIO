import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import GitHubActivity from "@/components/GitHubActivity";
import Architecture from "@/components/Architecture";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { getProfile, getProjects } from "@/lib/sanity";

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
  const [profile, projects] = await Promise.all([getProfile(), getProjects()]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero profileData={profile} />
        <About profileData={profile} />
        <Skills />
        <Projects initialProjects={projects} />
        <GitHubActivity username="VinaykumarvemulaCSE" />
        <Architecture />
        <Contact profileData={profile} />
      </main>
      <Footer profileData={profile} />
    </div>
  );
}
