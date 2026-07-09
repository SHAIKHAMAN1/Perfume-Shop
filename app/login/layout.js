import { Suspense } from "react";

export const metadata = {
  title: "Sign In — LUXEURE",
  description: "Sign in to your LUXEURE account.",
};

function LoginFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950">
      <div className="w-10 h-10 animate-spin rounded-full border-4 border-zinc-700 border-t-[#D4AF37]" />
    </div>
  );
}

export default function LoginLayout({ children }) {
  return <Suspense fallback={<LoginFallback />}>{children}</Suspense>;
}
