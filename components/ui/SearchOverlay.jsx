"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight, TrendingUp } from "lucide-react";
import Link from "next/link";
import useUIStore from "@/store/useUIStore";
import { useRouter } from "next/navigation";

const POPULAR = ["Dior Sauvage", "Tom Ford Oud Wood", "Creed Aventus", "Arabic Oud", "Chanel No.5"];

export default function SearchOverlay() {
  const { searchOpen, closeSearch } = useUIStore();
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const router   = useRouter();

  useEffect(() => {
    if (searchOpen) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [searchOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
    closeSearch();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") closeSearch();
  };

  return (
    <AnimatePresence>
      {searchOpen && (
        <motion.div
          key="search-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-md flex items-start justify-center pt-20 px-4"
          onClick={(e) => e.target === e.currentTarget && closeSearch()}
        >
          <motion.div
            initial={{ y: -24, opacity: 0, scale: 0.97 }}
            animate={{ y: 0,   opacity: 1, scale: 1 }}
            exit  ={{ y: -16,  opacity: 0, scale: 0.97 }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="w-full max-w-2xl"
          >
            {/* Search input */}
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D4AF37]" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search fragrances, brands..."
                className="w-full pl-14 pr-14 py-5 bg-[#171717] border border-[rgba(212,175,55,0.2)] text-white text-lg placeholder:text-[#B8B8B8]/50 rounded-2xl focus:outline-none focus:border-[#D4AF37]/50 focus:ring-2 focus:ring-[rgba(212,175,55,0.1)] transition-all"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-14 top-1/2 -translate-y-1/2 text-[#B8B8B8] hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="submit"
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 bg-[#D4AF37] text-black rounded-xl hover:bg-[#F0D060] transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Popular searches */}
            <div className="mt-8 px-2">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
                <p className="text-xs font-semibold text-[#D4AF37] uppercase tracking-widest">Popular Searches</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {POPULAR.map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      router.push(`/shop?q=${encodeURIComponent(term)}`);
                      closeSearch();
                    }}
                    className="px-4 py-2 text-sm text-[#B8B8B8] rounded-full glass border border-[rgba(212,175,55,0.1)] hover:border-[rgba(212,175,55,0.3)] hover:text-white transition-all"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick links */}
            <div className="mt-6 px-2 border-t border-[rgba(212,175,55,0.08)] pt-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "New Arrivals",  href: "/shop?sort=newest" },
                  { label: "Best Sellers",  href: "/shop?sort=best-selling" },
                  { label: "Men",           href: "/shop?gender=Men" },
                  { label: "Women",         href: "/shop?gender=Women" },
                ].map((l) => (
                  <Link
                    key={l.label}
                    href={l.href}
                    onClick={closeSearch}
                    className="text-center py-3 text-sm text-[#B8B8B8] rounded-xl glass border border-[rgba(212,175,55,0.08)] hover:text-white hover:border-[rgba(212,175,55,0.2)] transition-all"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>

            <button
              onClick={closeSearch}
              className="mt-6 flex items-center gap-1 text-xs text-[#B8B8B8]/50 hover:text-[#B8B8B8] transition-colors mx-auto"
            >
              <X className="w-3 h-3" /> Press ESC to close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
