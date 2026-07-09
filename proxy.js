/**
 * Next.js 16 Proxy (formerly Middleware) — route protection & session verification.
 * File must export a named `proxy` function (or default export).
 * Uses jose (edge-compatible) to verify the perfume_session JWT cookie.
 *
 * Protected routes:
 *  /admin/*      → admin | super_admin role required
 *  /account/*    → any authenticated user
 *  /checkout     → any authenticated user
 *  /login        → redirects already-authenticated users to home
 */
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "perfume_session";

function getKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) return null;
  return new TextEncoder().encode(secret);
}

async function getSession(req) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const key = getKey();
  if (!key) return null;
  try {
    const { payload } = await jwtVerify(token, key, { algorithms: ["HS256"] });
    return payload;
  } catch {
    return null;
  }
}

const ADMIN_ROUTES     = ["/admin"];
const PROTECTED_ROUTES = ["/account", "/checkout"];
const PUBLIC_ONLY      = ["/login", "/register"];

/** Named proxy export — required by Next.js 16 */
export async function proxy(request) {
  const { pathname } = request.nextUrl;
  const session      = await getSession(request);

  // Admin-only routes
  if (ADMIN_ROUTES.some((p) => pathname.startsWith(p))) {
    if (!session || !["admin", "super_admin"].includes(session.role)) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
  }

  // Customer protected routes
  if (PROTECTED_ROUTES.some((p) => pathname.startsWith(p))) {
    if (!session) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
  }

  // Bounce logged-in users away from auth pages
  if (PUBLIC_ONLY.some((p) => pathname.startsWith(p))) {
    if (session) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon\\.ico|robots\\.txt|sitemap\\.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2)).*)",
  ],
};
