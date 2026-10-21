"use client";

import type { FirebaseApp } from "firebase/app";
import { getApp, getApps, initializeApp } from "firebase/app";
import type { Auth } from "firebase/auth";
import { getAuth } from "firebase/auth";

import { firebaseClientConfig, isFirebaseClientConfigured } from "./config";

/**
 * Client-side Firebase is only used by the admin login form. Public pages never
 * touch it, so it stays out of the main bundle unless /admin is visited.
 */
export function getFirebaseApp(): FirebaseApp | null {
  if (!isFirebaseClientConfigured()) return null;

  return getApps().length > 0 ? getApp() : initializeApp(firebaseClientConfig);
}

export function getFirebaseAuth(): Auth | null {
  const app = getFirebaseApp();
  return app ? getAuth(app) : null;
}
