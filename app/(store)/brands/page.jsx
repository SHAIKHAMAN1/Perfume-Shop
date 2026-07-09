"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Search, ArrowRight, Globe, Star } from "lucide-react";
import GoldButton from "@/components/ui/GoldButton";
import SectionTitle from "@/components/ui/SectionTitle";

const FALLBACK_BRANDS = [
  { name: "DIOR",      country: "France",  description: "Timeless elegance and haute couture craftsmanship since 1946.", slug: "dior",      isFeatured: true,  emoji: "👑" },
  { name: "TOM FORD",  country: "USA",     description: "Bold, sensual and provocative fragrances for the modern connoisseur.", slug: "tom-ford",  isFeatured: true,  emoji: "🖤" },
  { name: "CREED",     country: "UK",      description: "Royal heritage house with over 260 years of perfumery excellence.", slug: "creed",     isFeatured: true,  emoji: "⚜️" },
  { name: "CHANEL",    country: "France",  description: "Iconic French luxury house — creators of the legendary No. 5.", slug: "chanel",    isFeatured: true,  emoji: "💫" },
  { name: "ARMANI",    country: "Italy",   description: "Italian sophistication distilled into exquisite olfactory masterpieces.", slug: "armani",    isFeatured: false, emoji: "🌹" },
  { name: "VERSACE",   country: "Italy",   description: "Glamorous and bold — the essence of Mediterranean luxury.", slug: "versace",   isFeatured: false, emoji: "🐉" },
  { name: "YSL",       country: "France",  description: "Yves Saint Laurent — where fashion meets fine fragrance.", slug: "ysl",       isFeatured: false, emoji: "✨" },
  { name: "GUCCI",     country: "Italy",   description: "Modern romanticism with a distinctly Florentine character.", slug: "gucci",     isFeatured: false, emoji: "🌿" },
  { name: "HERMÈS",    country: "France",  description: "Understated luxury with an unmistakably French sensibility.", slug: "hermes",    isFeatured: false, emoji: "🎩" },
  { name: "BURBERRY",  country: "UK",      description: "British heritage redefined — from trench coats to eau de parfum.", slug: "burberry",  isFeatured: false, emoji: "🌧️" },
  { name: "MONTBLANC", country: "Germany", description: "Precision, craftsmanship, and masculine elegance perfected.", slug: "montblanc", isFeatured: false, emoji: "🖋️" },
  { name: "PACO RABANNE", country: "France", description: "Futuristic visions translated into audacious, unforgettable scents.", slug: "paco-rabanne", isFeatured: false, emoji: "⚡" },
];

export default function BrandsPage() {
  const [brands, setBrands]       = useState(FALLBACK_BRANDS);
  const [search, setSearch]       = useState("");
  const [filter, setFilter]       = useState("all"); // all | featured
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    fetch("/api/admin/brands?limit=100&isActive=true")
      .then((r) => r.json())
      .then((data) => {
        if (data?.brands?.length) setBrands(data.brands);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = brands.filter((b) => {
    const matchSearch  = b.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter  = filter === "all" || b.isFeatured;
    return matchSearch && matchFilter;
  });

  const featured = brands.filter((b) => b.isFeatured).slice(0, 4);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">

      {/* ── Hero ── */}
      <section className="max-w-7xl mx-auto text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-block text-xs tracking-[0.35em] text-[#D4AF37] uppercase mb-4">
            Our Curated Collection
          </span>
          <h1 className="font-serif text-5xl sm:text-6xl text-white mb-5">
            The World&apos;s Finest{" "}
            <span className="text-gradient-gold">Fragrance Houses</span>
          </h1>
          <p className="text-[#B8B8B8] text-lg max-w-2xl mx-auto">
            From French heritage maisons to modern luxury powerhouses — every brand
            we carry is authenticated and sourced directly.
          </p>
        </motion.div>
      </section>

      {/* ── Featured Brands ── */}
      <section className="max-w-7xl mx-auto mb-20">
        <SectionTitle subtitle="Iconic Houses">Signature Brands</SectionTitle>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {featured.map((brand, i) => (
            <motion.div
              key={brand.slug ?? brand.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={`/shop?brand=${brand.slug ?? brand.name}`}>
                <div className="group relative p-8 rounded-2xl bg-gradient-to-b from-[rgba(212,175,55,0.08)] to-[rgba(212,175,55,0.02)] border border-[rgba(212,175,55,0.15)] hover:border-[rgba(212,175,55,0.4)] transition-all duration-300 text-center cursor-pointer overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-[rgba(212,175,55,0.05)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="text-4xl mb-4 block">{brand.emoji ?? "✦"}</span>
                  <p className="font-serif text-xl text-white group-hover:text-[#D4AF37] transition-colors">{brand.name}</p>
                  <p className="text-xs text-[#B8B8B8] mt-1 flex items-center justify-center gap-1">
                    <Globe className="w-3 h-3" /> {brand.country}
                  </p>
                  <div className="mt-3 flex items-center justify-center gap-1 text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity text-xs font-medium">
                    Shop Now <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── All Brands ── */}
      <section className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <SectionTitle>All Brands</SectionTitle>
          <div className="flex items-center gap-3">
            {/* Filter */}
            <div className="flex rounded-xl border border-[rgba(212,175,55,0.15)] overflow-hidden">
              {["all", "featured"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 text-xs font-medium capitalize transition-colors ${
                    filter === f
                      ? "bg-[rgba(212,175,55,0.15)] text-[#D4AF37]"
                      : "text-[#B8B8B8] hover:text-white"
                  }`}
                >
                  {f === "all" ? "All Brands" : "Featured"}
                </button>
              ))}
            </div>
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B8B8B8]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search brands…"
                className="pl-9 pr-4 py-2 bg-[rgba(255,255,255,0.04)] border border-[rgba(212,175,55,0.12)] rounded-xl text-sm text-white placeholder:text-[#B8B8B8]/50 focus:outline-none focus:border-[rgba(212,175,55,0.4)] w-48"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-32 rounded-2xl bg-white/[0.03] animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#B8B8B8] text-lg">No brands found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filtered.map((brand, i) => (
              <motion.div
                key={brand.slug ?? brand.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04 }}
              >
                <Link href={`/shop?brand=${brand.slug ?? brand.name}`}>
                  <div className="group p-6 rounded-2xl bg-[rgba(255,255,255,0.02)] border border-[rgba(212,175,55,0.08)] hover:border-[rgba(212,175,55,0.3)] hover:bg-[rgba(212,175,55,0.04)] transition-all duration-300 text-center cursor-pointer">
                    <span className="text-3xl mb-3 block">{brand.emoji ?? "✦"}</span>
                    {brand.isFeatured && (
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Star className="w-2.5 h-2.5 text-[#D4AF37] fill-[#D4AF37]" />
                        <span className="text-[8px] text-[#D4AF37] font-semibold uppercase tracking-widest">Featured</span>
                      </div>
                    )}
                    <p className="font-serif text-sm text-white group-hover:text-[#D4AF37] transition-colors font-medium">{brand.name}</p>
                    <p className="text-[10px] text-[#B8B8B8]/60 mt-0.5">{brand.country}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* ── CTA ── */}
      <section className="max-w-3xl mx-auto mt-24 text-center">
        <div className="p-12 rounded-3xl bg-gradient-to-b from-[rgba(212,175,55,0.08)] to-transparent border border-[rgba(212,175,55,0.12)]">
          <h2 className="font-serif text-3xl text-white mb-4">Can't find your brand?</h2>
          <p className="text-[#B8B8B8] mb-8">
            We source from over 50+ luxury fragrance houses worldwide. Contact us for special requests.
          </p>
          <Link href="/contact">
            <GoldButton>Contact Us</GoldButton>
          </Link>
        </div>
      </section>
    </div>
  );
}
