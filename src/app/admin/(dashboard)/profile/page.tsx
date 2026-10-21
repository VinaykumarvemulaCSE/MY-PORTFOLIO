import { ProfileForm } from "@/components/admin/ProfileForm";
import { readProfile } from "@/lib/firebase/store";
import type { ProfileViewModel } from "@/lib/types";

const emptyProfile: ProfileViewModel = {
  name: "",
  roles: [],
  bio: "",
  statusText: "",
  availableForOpportunities: false,
  profileImage: "",
  resumeUrl: "",
  education: { degree: "", institution: "", period: "", status: "", cgpa: "", highlights: [] },
  contact: { email: "", customEmail: "", phone: "", location: "" },
  social: { github: "", linkedin: "", whatsapp: "" },
  siteConfig: { title: "", description: "" },
};

export default async function AdminProfilePage() {
  const stored = await readProfile();
  const profile = stored ?? emptyProfile;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Hero, about, education and contact details.
        </p>
      </div>
      {!stored ? (
        <p className="rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm text-amber-200/90">
          No profile document yet. Fill this form and save it to create one.
        </p>
      ) : null}
      <ProfileForm profile={profile} />
    </div>
  );
}
