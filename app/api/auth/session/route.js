import { NextResponse } from "next/server";
import { verifyIdToken, isAdminConfigured } from "@/lib/firebase-admin";
import { createSession } from "@/lib/session";
import connectDB from "@/lib/mongoose";
import User from "@/models/User";

/**
 * POST /api/auth/session
 * Exchanges a Firebase ID token for a secure httpOnly session cookie.
 * Creates the user document in MongoDB on first sign-in.
 */
export async function POST(request) {
  try {
    // Check if Firebase Admin SDK credentials are configured
    if (!isAdminConfigured()) {
      return NextResponse.json(
        {
          error: "Firebase Admin SDK not configured. Add FIREBASE_ADMIN_PROJECT_ID, " +
                 "FIREBASE_ADMIN_CLIENT_EMAIL, and FIREBASE_ADMIN_PRIVATE_KEY to .env.local. " +
                 "Download from: Firebase Console → Project Settings → Service Accounts."
        },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { idToken } = body;

    if (!idToken || typeof idToken !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid ID token." },
        { status: 400 }
      );
    }

    // 1. Verify the Firebase ID token server-side
    const decoded = await verifyIdToken(idToken);

    // 2. Find or create the user in MongoDB
    await connectDB();

    let user = await User.findOne({ firebaseUid: decoded.uid }).lean();

    if (!user) {
      // First-time login — create the user document
      const newUser = await User.create({
        firebaseUid    : decoded.uid,
        email          : decoded.email,
        name           : decoded.name ?? decoded.email.split("@")[0],
        role           : "customer",
        avatar         : decoded.picture ?? null,
        isEmailVerified: decoded.email_verified ?? false,
      });
      user = newUser.toObject();
    } else {
      // Update last login and avatar if changed
      await User.findByIdAndUpdate(user._id, {
        lastLoginAt: new Date(),
        ...(decoded.picture && { avatar: decoded.picture }),
        ...(decoded.email_verified && { isEmailVerified: true }),
      });
    }

    if (user.isBlocked) {
      return NextResponse.json(
        { error: "Your account has been suspended. Contact support." },
        { status: 403 }
      );
    }

    // 3. Create the session cookie
    await createSession({
      uid  : decoded.uid,
      email: decoded.email,
      role : user.role,
      name : user.name,
    });

    return NextResponse.json({ ok: true, role: user.role });
  } catch (error) {
    console.error("[session/POST]", error);

    if (error.code === "auth/id-token-expired") {
      return NextResponse.json({ error: "Token expired. Please sign in again." }, { status: 401 });
    }
    if (error.code?.startsWith("auth/")) {
      return NextResponse.json({ error: "Invalid authentication token." }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
