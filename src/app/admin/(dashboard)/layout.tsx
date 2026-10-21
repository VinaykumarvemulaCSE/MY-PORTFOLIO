import type { Metadata } from "next";

import { AdminShell } from "@/components/admin/AdminShell";
import { Toaster } from "@/components/ui/sonner";
import { requireAdmin } from "@/lib/firebase/session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard — Portfolio CMS",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  return (
    <>
      <AdminShell email={session.email}>{children}</AdminShell>
      <Toaster />
    </>
  );
}
