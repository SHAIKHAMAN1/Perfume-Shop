/**
 * Checkout layout — requires authentication.
 * Guests are redirected to /login?redirect=/checkout.
 * After login the login page sends them back here.
 */
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function CheckoutLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login?redirect=/checkout");
    }
  }, [user, loading, router]);

  // While auth is resolving, show a minimal loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-[rgba(212,175,55,0.2)] border-t-[#D4AF37] animate-spin" />
          <p className="text-sm text-[#B8B8B8]">Verifying session…</p>
        </div>
      </div>
    );
  }

  // Not authenticated — null while redirect fires
  if (!user) return null;

  return children;
}
