/**
 * Firebase Admin SDK initialization.
 * Single source of truth for the Admin app and Firestore instance.
 */

import admin from "firebase-admin";
import fs from "fs";
import path from "path";

// Load local Firebase config if present (local dev / Express harness). In the
// Cloud Functions runtime this file is absent, so we fall back to Application
// Default Credentials (the function's own service account).
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- JSON config shape, matches prior behaviour
let firebaseConfig: any = {};
try {
  firebaseConfig = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "firebase-applet-config.json"), "utf8")
  );
} catch {
  firebaseConfig = {};
}

// Initialize Firebase Admin (idempotent — safe to import from multiple modules)
if (!admin.apps.length) {
  admin.initializeApp(
    firebaseConfig.projectId ? { projectId: firebaseConfig.projectId } : undefined
  );
}

/** Firestore instance — uses custom database ID if provided, otherwise default */
export const db = firebaseConfig.firestoreDatabaseId
  ? admin.firestore(firebaseConfig.firestoreDatabaseId)
  : admin.firestore();

/** Re-export admin for auth verification etc. */
export { admin };
