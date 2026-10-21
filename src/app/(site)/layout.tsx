import type { Metadata } from "next";

import { CommandMenu } from "@/components/CommandMenu";
import FloatingActions from "@/components/FloatingActions";
import MobileBottomNav from "@/components/MobileBottomNav";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import { Toaster } from "@/components/ui/sonner";
import { getProfile } from "@/lib/content";
import { getSiteUrl } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  const settings = profile?.siteConfig;
  const url = getSiteUrl();

  return {
    metadataBase: new URL(url),
    title: settings?.title ?? "Portfolio",
    description: settings?.description ?? "",
    applicationName: profile ? `${profile.name} — Portfolio` : "Portfolio",
    authors: profile ? [{ name: profile.name, url }] : undefined,
    creator: profile?.name,
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
  };
}

/**
 * Chrome for every public page. The admin dashboard lives outside this route
 * group so it doesn't inherit the portfolio navigation, command menu or actions.
 */
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const profile = await getProfile();

  return (
    <>
      <ServiceWorkerRegister />
      {children}
      {profile ? (
        <>
          <CommandMenu resumeUrl={profile.resumeUrl} />
          <FloatingActions profile={profile} />
        </>
      ) : null}
      <MobileBottomNav />
      <Toaster />
    </>
  );
}
