import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { CommandMenu } from "@/components/CommandMenu";
import FloatingActions from "@/components/FloatingActions";
import MobileBottomNav from "@/components/MobileBottomNav";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import { Toaster } from "@/components/ui/sonner";
import { getProfile } from "@/lib/content";
import { getSiteUrl } from "@/lib/site";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: "Vinay Kumar Vemula | Full Stack Developer",
  description:
    "Official portfolio of Vinay Kumar Vemula — a Full Stack Developer building with React, TypeScript, Next.js and Firebase.",
  applicationName: "Vinay Kumar Vemula — Portfolio",
  authors: [{ name: "Vinay Kumar Vemula", url: getSiteUrl() }],
  creator: "Vinay Kumar Vemula",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export const viewport = {
  themeColor: "#0b0907",
  colorScheme: "dark",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const profile = await getProfile();

  return (
    <html lang="en" className="dark" data-scroll-behavior="smooth">
      <body
        className={`antialiased font-body bg-background text-foreground ${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
      >
        <ServiceWorkerRegister />
        {children}
        <CommandMenu resumeUrl={profile.resumeUrl} />
        <FloatingActions profile={profile} />
        <MobileBottomNav />
        <Toaster />
      </body>
    </html>
  );
}
