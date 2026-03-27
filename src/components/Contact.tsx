import { useState } from "react";
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useForm } from "react-hook-form";
import { FiGithub, FiLinkedin, FiMail, FiSend, FiArrowUpRight } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import emailjs from "@emailjs/browser";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  message: z.string().trim().min(1, "Message is required").max(1000),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function Contact() {
  const { ref, isVisible } = useScrollAnimation();
  const [sending, setSending] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactForm>({ resolver: zodResolver(contactSchema) });


const onSubmit = async (data: ContactForm) => {
  setSending(true);

  try {
    await emailjs.send(
      "service_iased9k",
      "template_51sf5e6",
      {
        name: data.name,
        email: data.email,
        message: data.message,
      },
      "9lCKHbqstw6tgHVqb"
    );

    toast.success("Message sent!");
    reset();
  } catch (error) {
    console.error(error);
    toast.error("Failed to send message");
  }

  setSending(false);
};

  const socials = [
    { icon: FiGithub, label: "GitHub", href: "https://github.com/VinaykumarvemulaCSE", handle: "@VinaykumarvemulaCSE" },
    { icon: FiLinkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/vinay-kumar-vemula-220056382?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app", handle: "VEMULA VINAY KUMAR" },
    { icon: FiMail, label: "Email", href: "mailto:kumarvinay072007@gmail.com", handle: "kumarvinay072007@gmail.com" },
    { icon: FaWhatsapp, label: "WhatsApp", href: "https://wa.me/918019551015", handle: "+91 80195 51015" },
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
            Let's <span className="text-gradient">Connect</span>
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
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="card-hover flex items-center gap-4 p-4 rounded-xl glass border border-border/50 hover:border-primary/30 group"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <s.icon size={18} className="text-primary" />
                </div>
                <div className="flex-1">
                  <span className="text-sm font-semibold text-foreground">{s.label}</span>
                  <p className="text-xs text-muted-foreground font-mono">{s.handle}</p>
                </div>
                <FiArrowUpRight size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
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
                <label htmlFor={field} className="block text-sm font-medium text-foreground mb-1.5 capitalize">
                  {field}
                </label>
                {field === "message" ? (
                  <textarea
                    id={field}
                    rows={4}
                    {...register(field)}
                    className="w-full px-4 py-2.5 rounded-xl glass border border-border/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition resize-none placeholder:text-muted-foreground/50"
                    placeholder="Your message..."
                  />
                ) : (
                  <input
                    id={field}
                    type={field === "email" ? "email" : "text"}
                    {...register(field)}
                    className="w-full px-4 py-2.5 rounded-xl glass border border-border/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition placeholder:text-muted-foreground/50"
                    placeholder={field === "email" ? "your@email.com" : "Your name"}
                  />
                )}
                {errors[field] && <p className="text-xs text-destructive mt-1">{errors[field]?.message}</p>}
              </div>
            ))}
            <button
              type="submit"
              disabled={sending}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all glow-sm disabled:opacity-50"
            >
              <FiSend size={14} />
              {sending ? "Sending..." : "Send Message"}
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
