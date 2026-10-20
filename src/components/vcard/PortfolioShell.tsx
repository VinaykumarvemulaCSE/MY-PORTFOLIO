"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Sidebar from "./Sidebar";
import Navbar, { TabType } from "./Navbar";
import AboutSection from "./AboutSection";
import ResumeSection from "./ResumeSection";
import ProjectsSection from "./ProjectsSection";
import CertificatesSection from "./CertificatesSection";
import ContactSection from "./ContactSection";

import type { ProfileViewModel, ProjectViewModel } from "@/lib/sanity/types";

interface PortfolioShellProps {
  profileData: ProfileViewModel;
  projects: ProjectViewModel[];
}

export default function PortfolioShell({ profileData, projects }: PortfolioShellProps) {
  const [activeTab, setActiveTab] = useState<TabType>("about");

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-16 flex flex-col xl:flex-row items-start gap-7 relative">
      {/* Sticky Personal Sidebar (Left Column) */}
      <Sidebar profileData={profileData} />

      {/* Main Content Bento Card (Right Column) */}
      <div className="flex-1 w-full bg-[#1e1e1f] border border-[#383838]/60 rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl relative min-h-[640px]">
        {/* Floating Top Navigation */}
        <div className="mb-8 xl:mb-0">
          <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        {/* Tab Content Display with Transition */}
        <div className="xl:pt-6">
          <AnimatePresence mode="wait">
            {activeTab === "about" && (
              <AboutSection
                key="about"
                profileData={profileData}
                onExploreProjects={() => setActiveTab("projects")}
              />
            )}
            {activeTab === "resume" && (
              <ResumeSection key="resume" profileData={profileData} />
            )}
            {activeTab === "projects" && (
              <ProjectsSection key="projects" projects={projects} />
            )}
            {activeTab === "certificates" && (
              <CertificatesSection key="certificates" />
            )}
            {activeTab === "contact" && (
              <ContactSection key="contact" profileData={profileData} />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
