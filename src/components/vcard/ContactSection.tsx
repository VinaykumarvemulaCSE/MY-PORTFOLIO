"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FiSend, FiMail, FiCheck, FiCopy, FiMessageSquare } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { toast } from "sonner";

interface ContactSectionProps {
  profileData: any;
}

export default function ContactSection({ profileData }: ContactSectionProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const email = profileData?.contact?.email || "kumarvinay072007@gmail.com";
  const customEmail = profileData?.contact?.customEmail || "contact@vinaykumar.eu.cc";
  const phone = profileData?.contact?.phone || "+91 80195 51015";
  const whatsappUrl = profileData?.social?.whatsapp || "https://wa.me/918019551015";

  const copyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    toast.success("Email copied to clipboard!");
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in your name, email, and message.");
      return;
    }

    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to send message.");
      }

      toast.success("Message sent! I will respond to your email shortly.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to send message. Please contact via WhatsApp.");
    } finally {
      setSending(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Title */}
      <div>
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-white tracking-tight">
          Get in <span className="text-amber-400">Touch</span>
        </h2>
        <div className="w-12 h-1 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full mt-2" />
        <p className="text-sm text-muted-foreground mt-3">
          I'm actively seeking software engineering internships, technical collaborations, and freelance opportunities. Feel free to reach out directly.
        </p>
      </div>

      {/* Quick Action Cards */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* WhatsApp Direct */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-4 rounded-2xl bg-[#222224] border border-[#383838]/60 hover:border-emerald-500/40 transition-all flex items-center gap-3.5 group shadow-sm"
        >
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <FaWhatsapp size={20} />
          </div>
          <div>
            <h4 className="text-sm font-heading font-semibold text-white group-hover:text-emerald-400 transition-colors">
              Chat on WhatsApp
            </h4>
            <p className="text-xs text-muted-foreground font-mono">{phone}</p>
          </div>
        </a>

        {/* Copy Email Direct */}
        <div
          onClick={copyEmail}
          className="p-4 rounded-2xl bg-[#222224] border border-[#383838]/60 hover:border-amber-400/40 transition-all flex items-center gap-3.5 group shadow-sm cursor-pointer"
        >
          <div className="w-11 h-11 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <FiMail size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-heading font-semibold text-white group-hover:text-amber-300 transition-colors">
                Email Directly
              </h4>
              <span className="text-[11px] font-mono text-amber-300">
                {copiedEmail ? "Copied!" : "Click to copy"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground truncate font-mono">
              {email}
            </p>
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <div className="p-6 rounded-2xl bg-[#222224] border border-[#383838]/60 shadow-lg space-y-5">
        <h3 className="text-base font-heading font-bold text-white flex items-center gap-2">
          <FiMessageSquare className="text-amber-400" /> Send a Message
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-muted-foreground uppercase">
                Your Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. John Doe"
                className="w-full px-4 py-3 rounded-xl bg-[#1e1e1f] border border-[#383838] text-white text-sm focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-muted-foreground uppercase">
                Your Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. john@example.com"
                className="w-full px-4 py-3 rounded-xl bg-[#1e1e1f] border border-[#383838] text-white text-sm focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-muted-foreground uppercase">
              Subject (Optional)
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="e.g. Summer Internship Opportunity / Project Collaboration"
              className="w-full px-4 py-3 rounded-xl bg-[#1e1e1f] border border-[#383838] text-white text-sm focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-muted-foreground uppercase">
              Message *
            </label>
            <textarea
              required
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Hi Vinay, I'd like to discuss an opportunity..."
              className="w-full px-4 py-3 rounded-xl bg-[#1e1e1f] border border-[#383838] text-white text-sm focus:outline-none focus:border-amber-400 transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={sending}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-heading font-semibold text-xs uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-amber-400/20"
          >
            {sending ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-black border-t-transparent animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <FiSend size={15} /> Send Message
              </>
            )}
          </button>
        </form>
      </div>
    </motion.section>
  );
}
