import Link from "next/link";

import { CertificateForm } from "@/components/admin/CertificateForm";
import { readCertificates } from "@/lib/firebase/store";

export default async function NewCertificatePage() {
  const certificates = (await readCertificates()) ?? [];
  const nextOrder =
    certificates.reduce((max, certificate) => Math.max(max, certificate.order ?? 0), -1) + 1;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href="/admin/certificates"
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          ← Certificates
        </Link>
        <h1 className="mt-2 font-heading text-2xl font-semibold">New certificate</h1>
      </div>
      <CertificateForm
        submitLabel="Create certificate"
        certificate={{
          id: "",
          slug: "",
          title: "",
          issuer: "",
          skills: [],
          published: true,
          featured: false,
          order: nextOrder,
        }}
      />
    </div>
  );
}
