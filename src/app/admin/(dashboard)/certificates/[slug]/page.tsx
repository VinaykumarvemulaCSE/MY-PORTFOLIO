import Link from "next/link";
import { notFound } from "next/navigation";

import { CertificateForm } from "@/components/admin/CertificateForm";
import { readCertificates } from "@/lib/firebase/store";

export default async function EditCertificatePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const certificates = (await readCertificates()) ?? [];
  const certificate = certificates.find((item) => item.slug === slug);

  if (!certificate) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href="/admin/certificates"
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          ← Certificates
        </Link>
        <h1 className="mt-2 font-heading text-2xl font-semibold">{certificate.title}</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          /certificates/{certificate.slug} · order {certificate.order ?? 0}
        </p>
      </div>
      <CertificateForm certificate={certificate} />
    </div>
  );
}
