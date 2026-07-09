/**
 * lib/adminAuth.js
 * Reusable server-side admin guard for API routes.
 * Returns null if authorized, NextResponse error if not.
 */
import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/getSessionUser";

export async function requireAdmin(request) {
  try {
    const user = await getSessionUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
    }
    if (user.role !== "admin" && user.role !== "super_admin") {
      return NextResponse.json({ error: "Forbidden. Admin access required." }, { status: 403 });
    }
    return null; // authorized
  } catch {
    return NextResponse.json({ error: "Authentication error." }, { status: 401 });
  }
}

export async function requireSuperAdmin(request) {
  try {
    const user = await getSessionUser(request);
    if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    if (user.role !== "super_admin") return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    return null;
  } catch {
    return NextResponse.json({ error: "Authentication error." }, { status: 401 });
  }
}
