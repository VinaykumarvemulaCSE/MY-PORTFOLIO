import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Timeline from "@/components/Timeline";
import Projects from "@/components/Projects";
import Dashboard from "@/components/Dashboard";
import Architecture from "@/components/Architecture";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { useDarkMode } from "@/hooks/useDarkMode";

const Index = () => {
  const { isDark, toggle } = useDarkMode();

  return (
    <div className="min-h-screen bg-background">
      <Navbar isDark={isDark} onToggleTheme={toggle} />
      <main>
        <Hero />
        <About />
        <Skills />
        <Timeline />
        <Projects />
        <Dashboard />
        <Architecture />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
