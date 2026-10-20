"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiDownload,
  FiGithub,
  FiLinkedin,
  FiChevronDown,
  FiCopy,
  FiCheck,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { toast } from "sonner";
import ImageLightbox from "./ImageLightbox";

interface SidebarProps {
  profileData: any;
}

export default function Sidebar({ profileData }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [avatarLightboxOpen, setAvatarLightboxOpen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const name = profileData?.name || "Vinay Kumar Vemula";
  const primaryRole =
    profileData?.roles?.[0] || "Computer Science Undergrad (Class of 2029)";
  const profileImage = profileData?.profileImage || "/profile.png";
  const email = profileData?.contact?.email || "kumarvinay072007@gmail.com";
  const customEmail = profileData?.contact?.customEmail || "contact@vinaykumar.eu.cc";
  const phone = profileData?.contact?.phone || "+91 80195 51015";
  const location = profileData?.contact?.location || "Hyderabad, India";
  const resumeUrl = profileData?.resumeUrl || "/RESUME.pdf";
  const github = profileData?.social?.github || "https://github.com/VinaykumarvemulaCSE";
  const linkedin = profileData?.social?.linkedin || "https://www.linkedin.com/in/vinaykumarvemula";
  const whatsapp = profileData?.social?.whatsapp || "https://wa.me/918019551015";

  const copyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    toast.success("Email copied to clipboard!");
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  return (
    <>
      <aside className="w-full xl:w-[300px] xl:sticky xl:top-10 shrink-0 bg-[#1e1e1f] border border-[#383838]/60 rounded-3xl p-6 md:p-8 shadow-2xl transition-all relative z-20">
        {/* Mobile Header / Quick Info */}
        <div className="flex xl:flex-col items-center gap-4 xl:gap-0 relative">
          {/* Avatar with click-to-preview */}
          <button
            type="button"
            onClick={() => setAvatarLightboxOpen(true)}
            aria-label="Click to view profile photo"
            className="relative group w-20 h-20 md:w-28 md:h-28 xl:w-36 xl:h-36 rounded-2xl md:rounded-3xl overflow-hidden bg-gradient-to-br from-[#383838] to-[#1e1e1f] p-1 shrink-0 border border-white/10 hover:border-amber-400/50 transition-all shadow-lg"
          >
            <div className="relative w-full h-full rounded-[14px] md:rounded-[20px] overflow-hidden bg-black/40">
              <Image
                src={profileImage}
                alt={name}
                fill
                sizes="(max-width: 768px) 112px, 144px"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                priority
              />
            </div>
            <span className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] font-mono text-white transition-opacity">
              View
            </span>
          </button>

          {/* Name & Titles */}
          <div className="flex-1 xl:text-center xl:mt-5 min-w-0">
            <h1 className="text-lg md:text-2xl font-heading font-bold text-white tracking-tight truncate">
              {name}
            </h1>
            <div className="inline-flex items-center mt-2 px-3 py-1 rounded-xl bg-[#282829] border border-white/5 text-[11px] md:text-xs font-mono font-medium text-amber-300">
              {primaryRole}
            </div>

            {/* Availability indicator */}
            <div className="flex items-center gap-2 mt-2.5 xl:justify-center">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[11px] font-mono text-emerald-400 font-medium">
                Open to Internships & Work
              </span>
            </div>
          </div>

          {/* Toggle Button on Mobile */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle contact details"
            className="xl:hidden p-2.5 rounded-xl bg-[#2b2b2c] border border-[#383838] text-amber-300 hover:text-white transition-colors"
          >
            <FiChevronDown
              size={18}
              className={`transition-transform duration-300 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {/* Expandable Contacts Section */}
        <div
          className={`${
            isOpen ? "block" : "hidden"
          } xl:block transition-all duration-300 mt-6 pt-6 border-t border-[#383838]/60 space-y-5`}
        >
          {/* Contact Details List */}
          <div className="space-y-4">
            {/* Email */}
            <div className="flex items-center gap-3.5 group">
              <div className="w-10 h-10 rounded-xl bg-[#282829] border border-[#383838] flex items-center justify-center text-amber-400 shrink-0 shadow-sm group-hover:border-amber-400/40 transition-colors">
                <FiMail size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider">
                  Email
                </p>
                <div className="flex items-center gap-1.5">
                  <a
                    href={`mailto:${email}`}
                    className="text-xs font-medium text-white/90 hover:text-amber-300 transition-colors truncate block"
                    title={email}
                  >
                    {email}
                  </a>
                  <button
                    onClick={copyEmail}
                    title="Copy Email"
                    className="text-muted-foreground hover:text-amber-300 p-1 transition-colors"
                  >
                    {copiedEmail ? (
                      <FiCheck size={12} className="text-emerald-400" />
                    ) : (
                      <FiCopy size={12} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Custom Domain Email */}
            {customEmail && (
              <div className="flex items-center gap-3.5 group">
                <div className="w-10 h-10 rounded-xl bg-[#282829] border border-[#383838] flex items-center justify-center text-amber-400 shrink-0 shadow-sm group-hover:border-amber-400/40 transition-colors">
                  <span className="text-xs font-mono font-bold text-amber-300">@</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider">
                    Domain Mail
                  </p>
                  <a
                    href={`mailto:${customEmail}`}
                    className="text-xs font-medium text-amber-300/90 hover:text-amber-200 transition-colors truncate block font-mono"
                  >
                    {customEmail}
                  </a>
                </div>
              </div>
            )}

            {/* Phone / WhatsApp */}
            <div className="flex items-center gap-3.5 group">
              <div className="w-10 h-10 rounded-xl bg-[#282829] border border-[#383838] flex items-center justify-center text-amber-400 shrink-0 shadow-sm group-hover:border-amber-400/40 transition-colors">
                <FiPhone size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider">
                  Phone / WhatsApp
                </p>
                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-white/90 hover:text-emerald-400 transition-colors truncate block"
                >
                  {phone}
                </a>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-3.5 group">
              <div className="w-10 h-10 rounded-xl bg-[#282829] border border-[#383838] flex items-center justify-center text-amber-400 shrink-0 shadow-sm group-hover:border-amber-400/40 transition-colors">
                <FiMapPin size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider">
                  Location
                </p>
                <p className="text-xs font-medium text-white/90 truncate">
                  {location}
                </p>
              </div>
            </div>

            {/* Education Timeline */}
            <div className="flex items-center gap-3.5 group">
              <div className="w-10 h-10 rounded-xl bg-[#282829] border border-[#383838] flex items-center justify-center text-amber-400 shrink-0 shadow-sm group-hover:border-amber-400/40 transition-colors">
                <FiCalendar size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider">
                  Academic Timeline
                </p>
                <p className="text-xs font-medium text-white/90">
                  2025 — 2029 (Graduating)
                </p>
              </div>
            </div>
          </div>

          {/* Resume Download CTA */}
          <div className="pt-2">
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-heading font-semibold text-xs uppercase tracking-wider hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-amber-500/20"
            >
              <FiDownload size={15} /> Download Resume (CV)
            </a>
          </div>

          {/* Social Icons Row */}
          <div className="pt-2 flex items-center justify-center gap-3 border-t border-[#383838]/60">
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile"
              className="w-10 h-10 rounded-xl bg-[#282829] border border-[#383838] text-white/70 hover:text-white hover:border-amber-400/50 flex items-center justify-center transition-all"
            >
              <FiGithub size={17} />
            </a>
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile"
              className="w-10 h-10 rounded-xl bg-[#282829] border border-[#383838] text-white/70 hover:text-[#0077b5] hover:border-amber-400/50 flex items-center justify-center transition-all"
            >
              <FiLinkedin size={17} />
            </a>
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
              className="w-10 h-10 rounded-xl bg-[#282829] border border-[#383838] text-white/70 hover:text-emerald-400 hover:border-amber-400/50 flex items-center justify-center transition-all"
            >
              <FaWhatsapp size={17} />
            </a>
          </div>
        </div>
      </aside>

      {/* Lightbox for profile image */}
      <ImageLightbox
        isOpen={avatarLightboxOpen}
        onClose={() => setAvatarLightboxOpen(false)}
        imageSrc={profileImage}
        altText={name}
        title={name}
        subtitle={primaryRole}
      />
    </>
  );
}
