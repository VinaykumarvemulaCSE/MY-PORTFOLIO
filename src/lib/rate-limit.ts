import { createHash } from "node:crypto";

import { getDb } from "@/lib/firebase/admin";
import { isFirebaseAdminConfigured } from "@/lib/firebase/config";

const LIMIT = 5;
const WINDOW_MS = 10 * 60 * 1000;

/** Last-resort fallback when Firestore is not configured or is unavailable. */
const attempts = new Map<string, number[]>();

function memoryRateLimited(ip: string): boolean {
  const now = Date.now();

  if (attempts.size > 5000) {
    for (const [key, times] of attempts) {
      if (!times.some((time) => now - time < WINDOW_MS)) attempts.delete(key);
    }
  }

  const recent = (attempts.get(ip) ?? []).filter((time) => now - time < WINDOW_MS);
  recent.push(now);
  attempts.set(ip, recent);
  return recent.length > LIMIT;
}

/**
 * Shared rate limiter. Serverless instances do not share memory, so the counter
 * lives in Firestore and is updated atomically. The IP is hashed before it is
 * used as a document id. Add a Firestore TTL policy on `rateLimits.expiresAt`
 * to let expired counters disappear on their own.
 */
export async function isRateLimited(ip: string): Promise<boolean> {
  if (!isFirebaseAdminConfigured()) return memoryRateLimited(ip);

  const db = getDb();
  if (!db) return memoryRateLimited(ip);

  const id = createHash("sha256").update(ip).digest("hex");
  const ref = db.collection("rateLimits").doc(id);

  try {
    return await db.runTransaction(async (transaction) => {
      const snapshot = await transaction.get(ref);
      const now = Date.now();
      const data = snapshot.data() as { windowStart?: number; count?: number } | undefined;

      if (!data || typeof data.windowStart !== "number" || now - data.windowStart > WINDOW_MS) {
        transaction.set(ref, {
          windowStart: now,
          count: 1,
          expiresAt: new Date(now + WINDOW_MS),
        });
        return false;
      }

      const count = (data.count ?? 0) + 1;
      transaction.set(ref, {
        windowStart: data.windowStart,
        count,
        expiresAt: new Date(data.windowStart + WINDOW_MS),
      });
      return count > LIMIT;
    });
  } catch (error) {
    console.error("[contact] shared rate limiter failed", error);
    return memoryRateLimited(ip);
  }
}
