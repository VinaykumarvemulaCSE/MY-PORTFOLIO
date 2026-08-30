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

// Server-side profile data for SEO and initial render
import profileData from "../../public/data/profile.json";

export async function generateMetadata(): Promise<Metadata> {
  const config = profileData?.siteConfig as {
    title?: string;
    description?: string;
    url?: string;
  } | undefined;

  const title = config?.title || "Vinay Kumar Vemula | Full Stack Developer";
  const description = config?.description || "Official portfolio of Vinay Kumar Vemula.";
  const url = config?.url || "https://vinaykumarvemula.com";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: "website",
    },
  };
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Pass server-loaded profile data to components that need it */}
        <Hero profileData={profileData} />
        <About profileData={profileData} />
        <Skills />
        <Projects />
        <GitHubActivity username="VinaykumarvemulaCSE" />
        <Architecture />
        <Contact profileData={profileData} />
      </main>
      <Footer profileData={profileData} />
    </div>
  );
}
