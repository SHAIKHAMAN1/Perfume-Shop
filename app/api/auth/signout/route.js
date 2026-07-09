import { NextResponse } from "next/server";
import { deleteSession } from "@/lib/session";

/**
 * POST /api/auth/signout
 * Deletes the session cookie. Call this after Firebase signOut on the client.
 */
export async function POST() {
  try {
    await deleteSession();
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[signout/POST]", error);
    return NextResponse.json({ error: "Failed to sign out." }, { status: 500 });
  }
}
