import type { Metadata } from "next";

import PortfolioShell from "@/components/vcard/PortfolioShell";
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
  // Server-rendered so the content is in the HTML and so a single Sanity
  // webhook (see /api/revalidate) refreshes the whole page.
  const [profile, projects] = await Promise.all([getProfile(), getProjects()]);

  return (
    <main className="min-h-screen bg-[#0e0e10] text-[#f5f5f5] selection:bg-amber-400/20 selection:text-amber-300 antialiased font-body relative overflow-x-hidden">
      {/* Background ambient lighting */}
      <div
        className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="fixed bottom-0 right-1/4 w-[450px] h-[450px] bg-primary/5 rounded-full blur-[140px] pointer-events-none"
        aria-hidden="true"
      />

      {/* Main interactive application container */}
      <PortfolioShell profileData={profile} projects={projects} />
    </main>
  );
}
