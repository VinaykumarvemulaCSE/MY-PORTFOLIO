import type { App } from "firebase-admin/app";
import { cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import type { Auth } from "firebase-admin/auth";
import { getAuth } from "firebase-admin/auth";
import type { Firestore } from "firebase-admin/firestore";
import { getFirestore } from "firebase-admin/firestore";

import { isFirebaseAdminConfigured } from "./config";

let app: App | null = null;

function getAdminApp(): App | null {
  if (!isFirebaseAdminConfigured()) return null;
  if (app) return app;

  if (getApps().length > 0) {
    app = getApp();
    return app;
  }

  app = initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // Vercel stores the key with literal \n sequences.
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });

  return app;
}

export function getDb(): Firestore | null {
  const adminApp = getAdminApp();
  return adminApp ? getFirestore(adminApp) : null;
}

export function getAdminAuth(): Auth | null {
  const adminApp = getAdminApp();
  return adminApp ? getAuth(adminApp) : null;
}
