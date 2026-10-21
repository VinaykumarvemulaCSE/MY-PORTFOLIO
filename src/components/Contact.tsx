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
  company: z.string().optional(),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function Contact({ profileData }: { profileData: ProfileViewModel }) {
  const { ref, isVisible } = useScrollAnimation();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [sending, setSending] = useState(false);

  const recipientEmail = profileData.contact.email;
  const phoneDigits = profileData.contact.phone.replace(/[^0-9]/g, "");
  const whatsapp =
    profileData.social.whatsapp || (phoneDigits ? `https://wa.me/${phoneDigits}` : "");

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

  const onSubmit = async (data: ContactForm) => {
    // Honeypot: bots fill hidden fields, humans never see this one.
    if (data.company) return;

    setSending(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          message: data.message,
          company: data.company,
        }),
      });
      const payload = (await response.json().catch(() => ({}))) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? "Could not send your message.");
      }

      toast.success("Message sent — thanks for reaching out!");
      reset();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not send your message. Try again."
      );
    } finally {
      setSending(false);
    }
  };

  const socials = [
    profileData.social.github
      ? {
          icon: FiGithub,
          label: "GitHub",
          href: profileData.social.github,
          handle: "GitHub Profile",
        }
      : null,
    profileData.social.linkedin
      ? {
          icon: FiLinkedin,
          label: "LinkedIn",
          href: profileData.social.linkedin,
          handle: "LinkedIn Profile",
        }
      : null,
    {
      icon: FiMail,
      label: "Email",
      href: `mailto:${recipientEmail}`,
      handle: recipientEmail,
    },
    whatsapp
      ? {
          icon: FaWhatsapp,
          label: "WhatsApp",
          href: whatsapp,
          handle: profileData.contact.phone,
        }
      : null,
  ].filter((social) => social !== null);

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
            <input
              type="text"
              {...register("company")}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="pointer-events-none absolute -left-[9999px] h-0 w-0 opacity-0"
            />
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
                disabled={sending}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all glow-sm disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FiSend size={14} />
                {sending ? "Sending…" : "Send message"}
              </button>
              <p className="text-[11px] text-muted-foreground">
                Delivered straight to my inbox. You can also copy the address from the contact card.
              </p>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
