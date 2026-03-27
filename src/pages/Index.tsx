import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Timeline from "@/components/Timeline";
import Projects from "@/components/Projects";
import Architecture from "@/components/Architecture";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { useDarkMode } from "@/hooks/useDarkMode";
import { Helmet } from "react-helmet-async";

const Index = () => {
  const { isDark, toggle } = useDarkMode();

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Vinay Kumar Vemula | Creative Full Stack Developer</title>
        <meta name="description" content="Official portfolio of Vinay Kumar Vemula — a creative developer specializing in modern web technologies, React, TypeScript, and high-end UI/UX design." />
      </Helmet>
      <Navbar isDark={isDark} onToggleTheme={toggle} />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Architecture />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
