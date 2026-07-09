/**
 * Session management using jose (edge-compatible JWT).
 * Creates / reads / deletes the httpOnly session cookie.
 *
 * TODO: Set SESSION_SECRET in .env.local (min 32 chars):
 *   openssl rand -base64 32
 */
import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE_NAME   = "perfume_session";
const SESSION_DAYS  = 7;
const SESSION_MS    = SESSION_DAYS * 24 * 60 * 60 * 1000;

function getSecretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("Missing SESSION_SECRET environment variable.");
  return new TextEncoder().encode(secret);
}

/**
 * Encrypt a payload into a signed JWT.
 * @param {{ uid: string, email: string, role: string }} payload
 * @returns {Promise<string>} signed JWT
 */
export async function encryptSession(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(getSecretKey());
}

/**
 * Decrypt and verify a session JWT.
 * Returns null if invalid or expired.
 * @param {string | undefined} token
 * @returns {Promise<{ uid: string, email: string, role: string } | null>}
 */
export async function decryptSession(token) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecretKey(), {
      algorithms: ["HS256"],
    });
    return payload;
  } catch {
    return null;
  }
}

/**
 * Create a session cookie after successful authentication.
 * @param {{ uid: string, email: string, role: string }} sessionData
 */
export async function createSession(sessionData) {
  const expiresAt = new Date(Date.now() + SESSION_MS);
  const token     = await encryptSession({ ...sessionData, expiresAt: expiresAt.toISOString() });
  const store     = await cookies();

  store.set(COOKIE_NAME, token, {
    httpOnly : true,
    secure   : process.env.NODE_ENV === "production",
    expires  : expiresAt,
    sameSite : "lax",
    path     : "/",
  });
}

/**
 * Read and verify the current session from cookies.
 * @returns {Promise<{ uid: string, email: string, role: string } | null>}
 */
export async function getSession() {
  const store  = await cookies();
  const token  = store.get(COOKIE_NAME)?.value;
  return decryptSession(token);
}

/**
 * Refresh the session expiry (call on each request in middleware).
 */
export async function refreshSession() {
  const store   = await cookies();
  const token   = store.get(COOKIE_NAME)?.value;
  const payload = await decryptSession(token);
  if (!payload) return;

  const expiresAt = new Date(Date.now() + SESSION_MS);
  const newToken  = await encryptSession({
    uid    : payload.uid,
    email  : payload.email,
    role   : payload.role,
  });

  store.set(COOKIE_NAME, newToken, {
    httpOnly : true,
    secure   : process.env.NODE_ENV === "production",
    expires  : expiresAt,
    sameSite : "lax",
    path     : "/",
  });
}

/**
 * Delete the session cookie (logout).
 */
export async function deleteSession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export { COOKIE_NAME };

/**
 * Re-exported here so that existing
 *   import { getSessionUser } from "@/lib/session"
 * call-sites continue to work.
 *
 * The real implementation lives in @/lib/getSessionUser.js
 */
export { getSessionUser } from "@/lib/getSessionUser";
