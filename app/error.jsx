"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import GoldButton from "@/components/ui/GoldButton";

export default function Error({ error, reset }) {
  useEffect(() => { console.error(error); }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#090909]">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <div className="text-8xl mb-6 select-none">⚠️</div>
        <h1 className="font-serif text-3xl text-white mb-3">Something went wrong</h1>
        <p className="text-[#B8B8B8] text-sm mb-8 leading-relaxed">
          An unexpected error occurred. Our team has been notified.
          {error?.message && (
            <span className="block mt-2 text-xs text-red-400/80 font-mono">
              {error.message}
            </span>
          )}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <GoldButton onClick={reset}>Try Again</GoldButton>
          <Link href="/"><GoldButton variant="outline">Go Home</GoldButton></Link>
        </div>
      </motion.div>
    </div>
  );
}
