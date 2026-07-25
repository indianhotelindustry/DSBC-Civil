import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

/**
 * Firebase configuration.
 *
 * All environments: reads from VITE_ environment variables (see .env.example
 * and docs/FIREBASE_MIGRATION.md). The committed firebase-applet-config.json
 * dev fallback contains empty placeholders only — the app cannot reach
 * Firebase until the VITE_FIREBASE_* variables are set.
 *
 * The env-var approach avoids committing API keys to the repo.
 * Firebase API keys are safe to expose in client code (security is enforced
 * by Firestore rules and Auth), but keeping them out of git is still best practice.
 */
import firebaseConfig from '../../firebase-applet-config.json';

const config = import.meta.env.VITE_FIREBASE_API_KEY
  ? {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
      measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || '',
      firestoreDatabaseId: import.meta.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID || '',
    }
  : firebaseConfig;

const app = initializeApp(config);
export const auth = getAuth(app);
// Use custom database ID if provided, otherwise default database
const firestoreDatabaseId = (config as Record<string, string>).firestoreDatabaseId;
export const db = firestoreDatabaseId
  ? getFirestore(app, firestoreDatabaseId)
  : getFirestore(app);
export const storage = getStorage(app);

// Test connection to Firestore on startup (non-blocking, errors only)
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("[firebase] Client is offline. Check Firebase configuration.");
    }
    // Other errors (e.g., document not found) are expected and ignored
  }
}
testConnection();

export default app;
