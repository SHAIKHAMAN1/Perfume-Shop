/**
 * lib/getSessionUser.js
 *
 * Reads the JWT session cookie and returns the full MongoDB User document.
 * Used in API route handlers to authenticate requests.
 *
 * Usage:
 *   import { getSessionUser } from "@/lib/getSessionUser";
 *   const user = await getSessionUser();   // no args needed
 */
import "server-only";
import { getSession } from "@/lib/session";
import connectDB from "@/lib/mongoose";
import User from "@/models/User";

/**
 * @param {Request} [_request] — accepted for call-site compat, not used.
 *   Next.js cookies() reads from the current request context automatically.
 * @returns {Promise<object|null>} Lean MongoDB User document, or null if
 *   unauthenticated / blocked.
 */
export async function getSessionUser(_request) {
  try {
    const session = await getSession();
    if (!session?.uid) return null;

    await connectDB();

    const user = await User.findOne({ firebaseUid: session.uid })
      .select("_id firebaseUid email name role isBlocked avatar")
      .lean();

    if (!user || user.isBlocked) return null;
    return user;
  } catch (err) {
    console.error("[getSessionUser]", err.message);
    return null;
  }
}
