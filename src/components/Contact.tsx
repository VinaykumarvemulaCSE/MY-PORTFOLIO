"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaWhatsapp } from "react-icons/fa";
import {
  FiArrowUpRight,
  FiCheck,
  FiCopy,
  FiGithub,
  FiLinkedin,
  FiMail,
  FiSend,
} from "react-icons/fi";
import { toast } from "sonner";
import { z } from "zod";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import type { ProfileViewModel } from "@/lib/types";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  message: z.string().trim().min(10, "Please write at least 10 characters").max(5000),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function Contact({ profileData }: { profileData?: ProfileViewModel }) {
  const { ref, isVisible } = useScrollAnimation();
  const [copiedEmail, setCopiedEmail] = useState(false);

  const contactInfo = {
    email: profileData?.contact.email ?? "kumarvinay072007@gmail.com",
    phone: profileData?.contact.phone ?? "+91 80195 51015",
  };
  const socialInfo = {
    github: profileData?.social.github ?? "https://github.com/VinaykumarvemulaCSE",
    linkedin: profileData?.social.linkedin ?? "https://www.linkedin.com/in/vinaykumarvemula",
  };
  const recipientEmail = contactInfo.email;

  const copyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(recipientEmail);
    setCopiedEmail(true);
    toast.success("Email copied to clipboard!");
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactForm>({ resolver: zodResolver(contactSchema) });

  /**
   * No backend and no email-provider key. The form opens the visitor's mail
   * client with a pre-filled draft, which works on a static Vercel deploy and
   * cannot silently fail behind an unset API key.
   */
  const onSubmit = (data: ContactForm) => {
    const subject = encodeURIComponent(`Portfolio inquiry from ${data.name}`);
    const body = encodeURIComponent(`Name: ${data.name}\nEmail: ${data.email}\n\n${data.message}`);

    window.location.href = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;
    toast.info("Opening your email app — review the draft and hit send.");
    reset();
  };

  const socials = [
    {
      icon: FiGithub,
      label: "GitHub",
      href: socialInfo.github || "https://github.com/VinaykumarvemulaCSE",
      handle: "GitHub Profile",
    },
    {
      icon: FiLinkedin,
      label: "LinkedIn",
      href: socialInfo.linkedin || "https://www.linkedin.com/in/vinaykumarvemula",
      handle: "LinkedIn Profile",
    },
    { icon: FiMail, label: "Email", href: `mailto:${recipientEmail}`, handle: recipientEmail },
    {
      icon: FaWhatsapp,
      label: "WhatsApp",
      href: `https://wa.me/${(contactInfo.phone || "918019551015").replace(/[^0-9]/g, "")}`,
      handle: contactInfo.phone || "+91 80195 51015",
    },
  ];

  return (
    <section id="contact" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
      </div>

      <div ref={ref} className="max-w-4xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-3">
            Let&apos;s <span className="text-gradient">Connect</span>
          </h2>
          <div className="w-12 h-1 bg-primary rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground max-w-md mx-auto">
            Open to opportunities, collaborations, or just a friendly tech chat
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15 }}
            className="space-y-4"
          >
            {socials.map((s) => (
              <div
                key={s.label}
                className="card-hover flex items-center gap-4 p-4 rounded-xl glass border border-border/50 hover:border-primary/30 group relative"
              >
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit my ${s.label}`}
                  className="flex items-center gap-4 flex-1"
                >
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <s.icon size={18} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-semibold text-foreground">{s.label}</span>
                    <p className="text-xs text-muted-foreground font-mono">{s.handle}</p>
                  </div>
                </a>

                {s.label === "Email" ? (
                  <button
                    type="button"
                    onClick={copyEmail}
                    className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                    title="Copy Email Address"
                  >
                    {copiedEmail ? (
                      <FiCheck size={16} className="text-green-500" />
                    ) : (
                      <FiCopy size={16} />
                    )}
                  </button>
                ) : (
                  <a href={s.href} target="_blank" rel="noopener noreferrer">
                    <FiArrowUpRight
                      size={16}
                      className="text-muted-foreground group-hover:text-primary transition-colors"
                    />
                  </a>
                )}
              </div>
            ))}
          </motion.div>

          <motion.form
            onSubmit={handleSubmit(onSubmit)}
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.25 }}
            className="space-y-4"
            noValidate
          >
            {(["name", "email", "message"] as const).map((field) => (
              <div key={field}>
                <label
                  htmlFor={field}
                  className="block text-sm font-medium text-foreground mb-1.5 capitalize"
                >
                  {field}
                </label>
                {field === "message" ? (
                  <textarea
                    id={field}
                    rows={4}
                    {...register(field)}
                    className="w-full px-4 py-2.5 rounded-xl glass border border-border/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition resize-none placeholder:text-muted-foreground"
                    placeholder="Your message..."
                  />
                ) : (
                  <input
                    id={field}
                    type={field === "email" ? "email" : "text"}
                    {...register(field)}
                    className="w-full px-4 py-2.5 rounded-xl glass border border-border/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition placeholder:text-muted-foreground"
                    placeholder={field === "email" ? "your@email.com" : "Your name"}
                  />
                )}
                {errors[field] && (
                  <p className="text-xs text-destructive mt-1">{errors[field]?.message}</p>
                )}
              </div>
            ))}
            <div className="space-y-2">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all glow-sm"
              >
                <FiSend size={14} />
                Send via email
              </button>
              <p className="text-[11px] text-muted-foreground">
                This opens your default email app with the message pre-filled. You can also copy the
                address from the contact card.
              </p>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
