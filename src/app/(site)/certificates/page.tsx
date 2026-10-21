import type { Metadata } from "next";

import CertificatesBrowser from "@/components/CertificatesBrowser";
import { getCertificates, getProfile } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  const title = `Certificates — ${profile?.name ?? "Portfolio"}`;
  const description =
    "Verified certifications and completed courses, with issuer links so every credential can be checked independently.";

  return {
    title,
    description,
    alternates: { canonical: "/certificates" },
    openGraph: {
      title,
      description,
      type: "website",
      url: "/certificates",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function CertificatesPage() {
  const certificates = await getCertificates();

  return <CertificatesBrowser certificates={certificates} />;
}
