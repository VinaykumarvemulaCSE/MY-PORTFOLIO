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
 * Reads return `null` only when Firestore is not configured. Once credentials
 * exist, connection errors are thrown so a broken deployment fails at build
 * time instead of silently publishing an empty portfolio.
 */

export const COLLECTIONS = {
  profile: "profile",
  projects: "projects",
  certificates: "certificates",
  skills: "skills",
} as const;

async function readDocs(
  collection: string,
  options: { publishedOnly?: boolean } = {}
): Promise<Record<string, unknown>[] | null> {
  if (!isFirebaseAdminConfigured()) return null;

  const db = getDb();
  if (!db) return null;

  // Filter drafts in Firestore rather than downloading them and filtering in
  // memory. Sorting stays in memory because an equality filter plus orderBy
  // needs a composite index, which is not worth it at this collection size.
  const snapshot = await (options.publishedOnly
    ? db.collection(collection).where("published", "==", true)
    : db.collection(collection)
  ).get();

  return snapshot.docs.map((doc) => ({ ...doc.data(), _docId: doc.id }));
}

function byOrder(a: { order?: number }, b: { order?: number }): number {
  return (a.order ?? 0) - (b.order ?? 0);
}

export async function readProfile(): Promise<ProfileViewModel | null> {
  if (!isFirebaseAdminConfigured()) return null;

  const db = getDb();
  if (!db) return null;
  const doc = await db.collection(COLLECTIONS.profile).doc("main").get();
  if (!doc.exists) return null;
  const parsed = profileSchema.safeParse(doc.data());
  if (!parsed.success) {
    console.error("[firestore] profile/main failed validation", parsed.error.issues);
    return null;
  }
  return parsed.data;
}

export async function readProjects(
  options: { publishedOnly?: boolean } = {}
): Promise<ProjectViewModel[] | null> {
  const docs = await readDocs(COLLECTIONS.projects, options);
  if (!docs) return null;

  return docs
    .map((doc) => {
      const result = projectSchema.safeParse(doc);
      if (!result.success) {
        console.error(
          `[firestore] skipped invalid project ${String(doc._docId)}`,
          result.error.issues
        );
      }
      return result;
    })
    .flatMap((result) => (result.success ? [result.data] : []))
    .sort(byOrder);
}

export async function readCertificates(
  options: { publishedOnly?: boolean } = {}
): Promise<CertificateViewModel[] | null> {
  const docs = await readDocs(COLLECTIONS.certificates, options);
  if (!docs) return null;

  return docs
    .map((doc) => {
      const result = certificateSchema.safeParse(doc);
      if (!result.success) {
        console.error(
          `[firestore] skipped invalid certificate ${String(doc._docId)}`,
          result.error.issues
        );
      }
      return result;
    })
    .flatMap((result) => (result.success ? [result.data] : []))
    .sort(byOrder);
}

export async function readSkillGroups(): Promise<SkillGroupViewModel[] | null> {
  const docs = await readDocs(COLLECTIONS.skills);
  if (!docs) return null;

  return docs
    .map((doc) => {
      const result = skillGroupSchema.safeParse(doc);
      if (!result.success) {
        console.error(
          `[firestore] skipped invalid skill group ${String(doc._docId)}`,
          result.error.issues
        );
      }
      return result;
    })
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
