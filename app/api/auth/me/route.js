/**
 * GET /api/auth/me
 * Returns the current session user's role.
 * Used by AuthContext on mount to restore role after page refresh.
 */
import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/getSessionUser";

export async function GET(request) {
  try {
    const user = await getSessionUser(request);
    if (!user) {
      return NextResponse.json({ role: "customer", authenticated: false });
    }
    return NextResponse.json({
      role          : user.role,
      authenticated : true,
      name          : user.name,
      email         : user.email,
    });
  } catch {
    return NextResponse.json({ role: "customer", authenticated: false });
  }
}
