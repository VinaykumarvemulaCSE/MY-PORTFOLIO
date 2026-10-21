import Link from "next/link";

import { readCertificates, readProfile, readProjects, readSkillGroups } from "@/lib/firebase/store";

const SECTIONS = [
  { href: "/admin/profile", label: "Profile", description: "Hero, about, contact, socials" },
  { href: "/admin/projects", label: "Projects", description: "Case studies and galleries" },
  {
    href: "/admin/certificates",
    label: "Certificates",
    description: "Credentials and verification",
  },
  { href: "/admin/skills", label: "Skills", description: "Groups and icon keys" },
];

export default async function AdminOverviewPage() {
  const [profile, projects, certificates, skillGroups] = await Promise.all([
    readProfile(),
    readProjects(),
    readCertificates(),
    readSkillGroups(),
  ]);

  const stats = [
    {
      label: "Projects",
      value: projects?.length ?? 0,
      detail: `${projects?.filter((project) => project.published !== false).length ?? 0} published`,
      href: "/admin/projects",
    },
    {
      label: "Certificates",
      value: certificates?.length ?? 0,
      detail: `${certificates?.filter((item) => item.published !== false).length ?? 0} published`,
      href: "/admin/certificates",
    },
    {
      label: "Skill groups",
      value: skillGroups?.length ?? 0,
      detail: `${skillGroups?.reduce((total, group) => total + group.skills.length, 0) ?? 0} skills`,
      href: "/admin/skills",
    },
    {
      label: "Profile",
      value: profile ? "Live" : "Missing",
      detail: profile ? profile.contact.email || "No contact email" : "Create a profile record",
      href: "/admin/profile",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Content updates publish to the live site as soon as they are saved.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-2xl border border-border bg-card/60 p-5 transition hover:border-primary/40"
          >
            <p className="text-xs uppercase tracking-wider text-muted-foreground">{stat.label}</p>
            <p className="mt-2 font-heading text-3xl text-foreground">{stat.value}</p>
            <p className="mt-1 truncate text-xs text-muted-foreground">{stat.detail}</p>
          </Link>
        ))}
      </div>

      <section className="rounded-2xl border border-border bg-card/60 p-5 sm:p-6">
        <h2 className="font-heading text-lg">Manage content</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Every public page reads directly from Firestore — there is no hardcoded fallback.
        </p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {SECTIONS.map((section) => (
            <li key={section.href}>
              <Link
                href={section.href}
                className="flex items-center justify-between gap-3 rounded-xl border border-border/60 px-4 py-3 text-sm transition hover:border-primary/40"
              >
                <span>
                  <span className="font-medium text-foreground">{section.label}</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    {section.description}
                  </span>
                </span>
                <span aria-hidden="true" className="text-muted-foreground">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
