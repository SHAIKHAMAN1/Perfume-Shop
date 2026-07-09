import Link from "next/link";
import { motion } from "framer-motion";

export const metadata = {
  title: "404 — Page Not Found | LUXEURE",
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#090909]">
      <div className="text-center max-w-lg">
        {/* Decorative 404 */}
        <div className="relative mb-8">
          <p className="font-serif text-[9rem] leading-none font-bold text-gradient-gold opacity-10 select-none">
            404
          </p>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl">🌸</span>
          </div>
        </div>

        <h1 className="font-serif text-3xl text-white mb-3">Page Not Found</h1>
        <p className="text-[#B8B8B8] text-sm mb-8 leading-relaxed">
          The fragrance you&apos;re looking for seems to have evaporated.<br />
          Let us guide you back to our collection.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/"
            className="px-6 py-3 bg-gradient-to-r from-[#D4AF37] to-[#A8891C] text-black font-semibold rounded-xl hover:opacity-90 transition-opacity text-sm"
          >
            Return Home
          </Link>
          <Link href="/shop"
            className="px-6 py-3 border border-[rgba(212,175,55,0.2)] text-[#D4AF37] rounded-xl hover:bg-[rgba(212,175,55,0.05)] transition-all text-sm"
          >
            Explore Collections
          </Link>
        </div>

        {/* Decorative dots */}
        <div className="flex justify-center gap-2 mt-10">
          {[1,2,3].map((i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]/30" />
          ))}
        </div>
      </div>
    </div>
  );
}
