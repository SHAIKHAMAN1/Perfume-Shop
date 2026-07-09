/**
 * Firebase Admin SDK — server-side only (modular API for firebase-admin v12+).
 *
 * Required env vars in .env.local:
 *   FIREBASE_ADMIN_PROJECT_ID=your-project-id
 *   FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxx@your-project.iam.gserviceaccount.com
 *   FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
 *
 * Get them from:
 *   Firebase Console → Project Settings → Service Accounts → Generate new private key
 */
import "server-only";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

function getAdminApp() {
  // Return existing app if already initialised (singleton pattern)
  const existing = getApps();
  if (existing.length > 0) return existing[0];

  const projectId   = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey  = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Firebase Admin credentials missing. " +
      "Set FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, " +
      "and FIREBASE_ADMIN_PRIVATE_KEY in .env.local.\n" +
      "Download from: Firebase Console → Project Settings → Service Accounts → Generate new private key"
    );
  }

  return initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
}

/**
 * Verify a Firebase ID token issued by the client SDK.
 * @param {string} idToken
 * @returns {Promise<import('firebase-admin/auth').DecodedIdToken>}
 */
export async function verifyIdToken(idToken) {
  const app  = getAdminApp();
  const auth = getAuth(app);
  return auth.verifyIdToken(idToken);
}

/**
 * Get a Firebase Auth user by UID.
 * @param {string} uid
 */
export async function getAuthUser(uid) {
  const app  = getAdminApp();
  const auth = getAuth(app);
  return auth.getUser(uid);
}

/**
 * Check if Firebase Admin credentials are configured.
 * Use this to show helpful error messages instead of crashing.
 */
export function isAdminConfigured() {
  return !!(
    process.env.FIREBASE_ADMIN_PROJECT_ID &&
    process.env.FIREBASE_ADMIN_CLIENT_EMAIL &&
    process.env.FIREBASE_ADMIN_PRIVATE_KEY
  );
}

export default getAdminApp;
