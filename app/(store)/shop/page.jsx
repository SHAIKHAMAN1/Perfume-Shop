"use client";

import { Suspense } from "react";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X, ChevronDown, Search } from "lucide-react";
import ProductCard from "@/components/products/ProductCard";
import { ProductGridSkeleton } from "@/components/ui/LoadingSkeleton";
import GoldButton from "@/components/ui/GoldButton";
import SectionTitle from "@/components/ui/SectionTitle";

/* ── Filter options ─────────────────────────────────────────── */
const GENDERS  = ["Men", "Women", "Unisex"];
const SORTS    = [
  { value: "newest",       label: "New Arrivals" },
  { value: "best-selling", label: "Best Selling" },
  { value: "top-rated",    label: "Top Rated" },
  { value: "price-asc",    label: "Price: Low → High" },
  { value: "price-desc",   label: "Price: High → Low" },
];
const CONCENTRATIONS = ["EDP", "EDT", "Parfum", "EDC", "Attar", "Body Mist"];
const PRICE_RANGES = [
  { label: "Under ₹1,000",    min: 0,     max: 1000 },
  { label: "₹1,000 – ₹3,000", min: 1000,  max: 3000 },
  { label: "₹3,000 – ₹7,000", min: 3000,  max: 7000 },
  { label: "Above ₹7,000",    min: 7000,  max: 0 },
];

function ShopContent() {
  const router        = useRouter();
  const pathname      = usePathname();
  const searchParams  = useSearchParams();

  /* ── Filter state (synced with URL) ── */
  const [products,    setProducts]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [pagination,  setPagination]  = useState(null);
  const [filterOpen,  setFilterOpen]  = useState(false);

  const currentPage  = parseInt(searchParams.get("page") ?? "1");
  const currentSort  = searchParams.get("sort") ?? "newest";
  const currentGender= searchParams.get("gender") ?? "";
  const currentQ     = searchParams.get("q") ?? "";

  /* ── Fetch products ── */
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(searchParams.toString());
      const res    = await fetch(`/api/products?${params.toString()}`);
      const data   = await res.json();
      if (res.ok) {
        setProducts(data.products);
        setPagination(data.pagination);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  /* ── URL helpers ── */
  const updateParam = (key, value) => {
    const p = new URLSearchParams(searchParams.toString());
    if (value) p.set(key, value); else p.delete(key);
    p.delete("page"); // reset to page 1 on filter change
    router.push(`${pathname}?${p.toString()}`);
  };

  const clearAll = () => router.push(pathname);

  const activeFilters = ["gender", "q", "minPrice", "maxPrice", "featured", "bestSeller", "newArrival", "discount"]
    .filter((k) => searchParams.has(k));

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-[10px] tracking-[0.4em] text-[#D4AF37] uppercase font-semibold mb-1">
            {currentQ ? `Results for "${currentQ}"` : "Our Collection"}
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-white">
            {currentGender ? `${currentGender}&apos;s Fragrances` : "All Fragrances"}
          </h1>
          {pagination && (
            <p className="text-sm text-[#B8B8B8] mt-1">{pagination.total.toLocaleString()} fragrances</p>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Sort dropdown */}
          <div className="relative">
            <select
              value={currentSort}
              onChange={(e) => updateParam("sort", e.target.value)}
              className="appearance-none pl-4 pr-8 py-2.5 bg-[rgba(255,255,255,0.04)] border border-[rgba(212,175,55,0.15)] text-[#B8B8B8] text-sm rounded-xl focus:outline-none focus:border-[#D4AF37]/40 cursor-pointer"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value} className="bg-[#171717]">{s.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#B8B8B8] pointer-events-none" />
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setFilterOpen(true)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm transition-all ${
              activeFilters.length > 0
                ? "border-[#D4AF37] text-[#D4AF37] bg-[rgba(212,175,55,0.06)]"
                : "border-[rgba(212,175,55,0.15)] text-[#B8B8B8] hover:border-[rgba(212,175,55,0.3)] hover:text-white"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFilters.length > 0 && (
              <span className="w-4 h-4 bg-[#D4AF37] text-black text-[9px] font-bold rounded-full flex items-center justify-center">
                {activeFilters.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ── Active filter chips ── */}
      <AnimatePresence>
        {activeFilters.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap items-center gap-2 mb-6"
          >
            {currentGender && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[rgba(212,175,55,0.1)] border border-[rgba(212,175,55,0.2)] text-[#D4AF37] rounded-full">
                {currentGender}
                <button onClick={() => updateParam("gender", "")}><X className="w-3 h-3" /></button>
              </span>
            )}
            {currentQ && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[rgba(212,175,55,0.1)] border border-[rgba(212,175,55,0.2)] text-[#D4AF37] rounded-full">
                &ldquo;{currentQ}&rdquo;
                <button onClick={() => updateParam("q", "")}><X className="w-3 h-3" /></button>
              </span>
            )}
            <button
              onClick={clearAll}
              className="text-xs text-[#B8B8B8] hover:text-white underline underline-offset-2 transition-colors"
            >
              Clear all
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Gender quick-filter tabs ── */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-1 scrollbar-hide">
        {["", ...GENDERS].map((g) => (
          <button
            key={g || "all"}
            onClick={() => updateParam("gender", g)}
            className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-all ${
              currentGender === g
                ? "bg-gradient-to-r from-[#D4AF37] to-[#A8891C] text-black"
                : "glass border border-[rgba(212,175,55,0.1)] text-[#B8B8B8] hover:text-white hover:border-[rgba(212,175,55,0.25)]"
            }`}
          >
            {g || "All"}
          </button>
        ))}
        <button
          onClick={() => updateParam("featured", searchParams.get("featured") === "true" ? "" : "true")}
          className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-all ${
            searchParams.get("featured") === "true"
              ? "bg-gradient-to-r from-[#D4AF37] to-[#A8891C] text-black"
              : "glass border border-[rgba(212,175,55,0.1)] text-[#B8B8B8] hover:text-white"
          }`}
        >
          ✦ Featured
        </button>
        <button
          onClick={() => updateParam("bestSeller", searchParams.get("bestSeller") === "true" ? "" : "true")}
          className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-all ${
            searchParams.get("bestSeller") === "true"
              ? "bg-gradient-to-r from-[#D4AF37] to-[#A8891C] text-black"
              : "glass border border-[rgba(212,175,55,0.1)] text-[#B8B8B8] hover:text-white"
          }`}
        >
          🔥 Best Sellers
        </button>
        <button
          onClick={() => updateParam("newArrival", searchParams.get("newArrival") === "true" ? "" : "true")}
          className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-all ${
            searchParams.get("newArrival") === "true"
              ? "bg-gradient-to-r from-[#D4AF37] to-[#A8891C] text-black"
              : "glass border border-[rgba(212,175,55,0.1)] text-[#B8B8B8] hover:text-white"
          }`}
        >
          🆕 New Arrivals
        </button>
      </div>

      {/* ── Product Grid ── */}
      {loading ? (
        <ProductGridSkeleton count={12} />
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="font-serif text-xl text-white mb-2">No fragrances found</h3>
          <p className="text-[#B8B8B8] text-sm mb-6">Try adjusting your filters or search query.</p>
          <GoldButton variant="outline" onClick={clearAll}>Clear Filters</GoldButton>
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5"
        >
          {products.map((product, i) => (
            <ProductCard key={product._id} product={product} index={i} />
          ))}
        </motion.div>
      )}

      {/* ── Pagination ── */}
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-12">
          <button
            disabled={!pagination.hasPrev}
            onClick={() => updateParam("page", String(currentPage - 1))}
            className="px-4 py-2 rounded-xl glass border border-[rgba(212,175,55,0.1)] text-[#B8B8B8] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm"
          >
            ← Prev
          </button>

          {Array.from({ length: Math.min(pagination.pages, 7) }).map((_, i) => {
            const p = i + 1;
            return (
              <button
                key={p}
                onClick={() => updateParam("page", String(p))}
                className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${
                  p === currentPage
                    ? "bg-gradient-to-r from-[#D4AF37] to-[#A8891C] text-black"
                    : "glass border border-[rgba(212,175,55,0.1)] text-[#B8B8B8] hover:text-white"
                }`}
              >
                {p}
              </button>
            );
          })}

          <button
            disabled={!pagination.hasNext}
            onClick={() => updateParam("page", String(currentPage + 1))}
            className="px-4 py-2 rounded-xl glass border border-[rgba(212,175,55,0.1)] text-[#B8B8B8] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm"
          >
            Next →
          </button>
        </div>
      )}

      {/* ── Filter Drawer (mobile/tablet) ── */}
      <AnimatePresence>
        {filterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setFilterOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed top-0 left-0 bottom-0 z-50 w-80 glass-dark border-r border-[rgba(212,175,55,0.1)] overflow-y-auto"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between p-5 border-b border-[rgba(212,175,55,0.08)]">
                <h2 className="font-serif text-lg text-white">Filters</h2>
                <button onClick={() => setFilterOpen(false)} className="text-[#B8B8B8] hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 space-y-6">
                {/* Gender */}
                <div>
                  <h3 className="text-xs font-semibold text-[#D4AF37] uppercase tracking-widest mb-3">Gender</h3>
                  <div className="space-y-2">
                    {GENDERS.map((g) => (
                      <button
                        key={g}
                        onClick={() => updateParam("gender", currentGender === g ? "" : g)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all ${
                          currentGender === g
                            ? "bg-[rgba(212,175,55,0.1)] text-[#D4AF37] border border-[rgba(212,175,55,0.2)]"
                            : "text-[#B8B8B8] hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price range */}
                <div>
                  <h3 className="text-xs font-semibold text-[#D4AF37] uppercase tracking-widest mb-3">Price Range</h3>
                  <div className="space-y-2">
                    {PRICE_RANGES.map(({ label, min, max }) => {
                      const isActive = searchParams.get("minPrice") === String(min) && searchParams.get("maxPrice") === String(max);
                      return (
                        <button
                          key={label}
                          onClick={() => {
                            if (isActive) {
                              const p = new URLSearchParams(searchParams.toString());
                              p.delete("minPrice"); p.delete("maxPrice");
                              router.push(`${pathname}?${p.toString()}`);
                            } else {
                              const p = new URLSearchParams(searchParams.toString());
                              p.set("minPrice", String(min));
                              if (max) p.set("maxPrice", String(max)); else p.delete("maxPrice");
                              router.push(`${pathname}?${p.toString()}`);
                            }
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all ${
                            isActive
                              ? "bg-[rgba(212,175,55,0.1)] text-[#D4AF37] border border-[rgba(212,175,55,0.2)]"
                              : "text-[#B8B8B8] hover:text-white hover:bg-white/5"
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Quick flags */}
                <div>
                  <h3 className="text-xs font-semibold text-[#D4AF37] uppercase tracking-widest mb-3">Browse By</h3>
                  <div className="space-y-2">
                    {[
                      { key: "featured",   label: "✦ Featured" },
                      { key: "bestSeller", label: "🔥 Best Sellers" },
                      { key: "newArrival", label: "🆕 New Arrivals" },
                      { key: "discount",   label: "🏷️ On Sale" },
                    ].map(({ key, label }) => (
                      <button
                        key={key}
                        onClick={() => updateParam(key, searchParams.get(key) === "true" ? "" : "true")}
                        className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all ${
                          searchParams.get(key) === "true"
                            ? "bg-[rgba(212,175,55,0.1)] text-[#D4AF37] border border-[rgba(212,175,55,0.2)]"
                            : "text-[#B8B8B8] hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Clear */}
                {activeFilters.length > 0 && (
                  <GoldButton variant="outline" className="w-full" onClick={() => { clearAll(); setFilterOpen(false); }}>
                    Clear All Filters
                  </GoldButton>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Suspense wrapper required by Next.js when useSearchParams is used in a page
export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-[rgba(212,175,55,0.2)] border-t-[#D4AF37] animate-spin" />
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
