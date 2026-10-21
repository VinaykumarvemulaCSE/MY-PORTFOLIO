import { getDb } from "@/lib/firebase/admin";
import { isFirebaseAdminConfigured } from "@/lib/firebase/config";
import { certificateSchema, profileSchema, projectSchema, skillGroupSchema } from "@/lib/schemas";
import type {
  CertificateViewModel,
  ProfileViewModel,
  ProjectViewModel,
  SkillGroupViewModel,
} from "@/lib/types";

/**
 * Firestore access for the CMS and the public content layer.
 *
 * Reads return `null` when Firestore is not configured or a document fails
 * validation. Callers (`src/lib/content.ts`) then fall back to the static
 * content in `src/content`, so the site keeps rendering before the CMS is set up.
 */

export const COLLECTIONS = {
  profile: "profile",
  projects: "projects",
  certificates: "certificates",
  skills: "skills",
} as const;

async function readDocs(collection: string): Promise<Record<string, unknown>[] | null> {
  if (!isFirebaseAdminConfigured()) return null;

  try {
    const db = getDb();
    if (!db) return null;
    const snapshot = await db.collection(collection).get();
    return snapshot.docs.map((doc) => ({ ...doc.data(), _docId: doc.id }));
  } catch (error) {
    console.error(`[firestore] failed to read ${collection}`, error);
    return null;
  }
}

function byOrder(a: { order?: number }, b: { order?: number }): number {
  return (a.order ?? 0) - (b.order ?? 0);
}

export async function readProfile(): Promise<ProfileViewModel | null> {
  if (!isFirebaseAdminConfigured()) return null;

  try {
    const db = getDb();
    if (!db) return null;
    const doc = await db.collection(COLLECTIONS.profile).doc("main").get();
    if (!doc.exists) return null;
    const parsed = profileSchema.safeParse(doc.data());
    return parsed.success ? parsed.data : null;
  } catch (error) {
    console.error("[firestore] failed to read profile", error);
    return null;
  }
}

export async function readProjects(): Promise<ProjectViewModel[] | null> {
  const docs = await readDocs(COLLECTIONS.projects);
  if (!docs) return null;

  return docs
    .map((doc) => projectSchema.safeParse(doc))
    .flatMap((result) => (result.success ? [result.data] : []))
    .sort(byOrder);
}

export async function readCertificates(): Promise<CertificateViewModel[] | null> {
  const docs = await readDocs(COLLECTIONS.certificates);
  if (!docs) return null;

  return docs
    .map((doc) => certificateSchema.safeParse(doc))
    .flatMap((result) => (result.success ? [result.data] : []))
    .sort(byOrder);
}

export async function readSkillGroups(): Promise<SkillGroupViewModel[] | null> {
  const docs = await readDocs(COLLECTIONS.skills);
  if (!docs) return null;

  return docs
    .map((doc) => skillGroupSchema.safeParse(doc))
    .flatMap((result) => (result.success ? [result.data] : []))
    .sort(byOrder);
}

/** Strip `undefined` (Firestore rejects it) and normalise dates. */
function clean<T extends object>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

export async function saveDoc(collection: string, id: string, data: object): Promise<boolean> {
  const db = getDb();
  if (!db) return false;
  await db.collection(collection).doc(id).set(clean(data));
  return true;
}

export async function deleteDoc(collection: string, id: string): Promise<boolean> {
  const db = getDb();
  if (!db) return false;
  await db.collection(collection).doc(id).delete();
  return true;
}

export async function saveProfile(data: ProfileViewModel): Promise<boolean> {
  return saveDoc(COLLECTIONS.profile, "main", data);
}

export async function saveProject(data: ProjectViewModel): Promise<boolean> {
  return saveDoc(COLLECTIONS.projects, data.slug, data);
}

export async function saveCertificate(data: CertificateViewModel): Promise<boolean> {
  return saveDoc(COLLECTIONS.certificates, data.slug, data);
}

export async function saveSkillGroup(data: SkillGroupViewModel): Promise<boolean> {
  return saveDoc(COLLECTIONS.skills, data.id, data);
}
