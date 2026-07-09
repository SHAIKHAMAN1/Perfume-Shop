"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Search, Edit2, Trash2, Eye, EyeOff,
  ChevronDown, Filter, Star, AlertTriangle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import useUIStore from "@/store/useUIStore";
import GoldButton from "@/components/ui/GoldButton";

const SORTS = [
  { value: "newest",      label: "Newest" },
  { value: "oldest",      label: "Oldest" },
  { value: "price-desc",  label: "Price ↓" },
  { value: "price-asc",   label: "Price ↑" },
  { value: "stock",       label: "Low Stock" },
  { value: "sold",        label: "Best Selling" },
];

export default function AdminProductsPage() {
  const router       = useRouter();
  const pathname     = usePathname();
  const searchParams = useSearchParams();
  const addToast     = useUIStore((s) => s.addToast);

  const [products,    setProducts]    = useState([]);
  const [pagination,  setPagination]  = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [deleting,    setDeleting]    = useState(null);
  const [q,           setQ]           = useState(searchParams.get("q") ?? "");

  const currentPage = parseInt(searchParams.get("page") ?? "1");
  const currentSort = searchParams.get("sort") ?? "newest";
  const currentStatus = searchParams.get("status") ?? "";

  const updateParam = (key, value) => {
    const p = new URLSearchParams(searchParams.toString());
    if (value) p.set(key, value); else p.delete(key);
    p.delete("page");
    router.push(`${pathname}?${p.toString()}`);
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams(searchParams.toString());
    try {
      const res  = await fetch(`/api/admin/products?${params}`, { cache: "no-store" });
      const data = await res.json();
      if (res.ok) { setProducts(data.products); setPagination(data.pagination); }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [searchParams]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleDelete = async (id, name) => {
    if (!confirm(`Archive "${name}"? It will be hidden from the store.`)) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        addToast({ type: "success", message: `"${name}" archived successfully.` });
        setProducts((p) => p.filter((x) => x._id !== id));
      } else {
        addToast({ type: "error", message: "Failed to archive product." });
      }
    } catch { addToast({ type: "error", message: "Failed to archive product." }); }
    finally { setDeleting(null); }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl text-white">Products</h1>
          <p className="text-sm text-[#B8B8B8]">{pagination?.total ?? 0} products in catalogue</p>
        </div>
        <Link href="/admin/products/new">
          <GoldButton><Plus className="w-4 h-4" /> Add Product</GoldButton>
        </Link>
      </div>

      {/* Filters bar */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Search */}
        <form onSubmit={(e) => { e.preventDefault(); updateParam("q", q); }} className="flex gap-2 flex-1 min-w-48">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B8B8B8]" />
            <input
              value={q} onChange={(e) => setQ(e.target.value)}
              placeholder="Search products…"
              className="w-full pl-9 pr-4 py-2.5 bg-[rgba(255,255,255,0.04)] border border-[rgba(212,175,55,0.12)] text-white text-sm rounded-xl focus:outline-none focus:border-[rgba(212,175,55,0.3)] placeholder:text-[#B8B8B8]/50"
            />
          </div>
          <button type="submit" className="px-4 py-2.5 bg-[rgba(212,175,55,0.1)] border border-[rgba(212,175,55,0.2)] text-[#D4AF37] rounded-xl text-sm hover:bg-[rgba(212,175,55,0.15)] transition-colors">
            Search
          </button>
        </form>

        {/* Status filter */}
        <div className="flex gap-2">
          {[["", "All"], ["active", "Active"], ["inactive", "Inactive"]].map(([val, lbl]) => (
            <button
              key={val}
              onClick={() => updateParam("status", val)}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                currentStatus === val
                  ? "bg-[rgba(212,175,55,0.12)] text-[#D4AF37] border border-[rgba(212,175,55,0.25)]"
                  : "text-[#B8B8B8] border border-[rgba(212,175,55,0.08)] hover:text-white"
              }`}
            >
              {lbl}
            </button>
          ))}
        </div>

        {/* Low stock */}
        <button
          onClick={() => updateParam("lowStock", searchParams.get("lowStock") === "true" ? "" : "true")}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs border transition-all ${
            searchParams.get("lowStock") === "true"
              ? "border-orange-500/40 text-orange-400 bg-orange-500/5"
              : "border-[rgba(212,175,55,0.08)] text-[#B8B8B8] hover:text-white"
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" /> Low Stock
        </button>

        {/* Sort */}
        <div className="relative">
          <select
            value={currentSort}
            onChange={(e) => updateParam("sort", e.target.value)}
            className="pl-3 pr-7 py-2.5 bg-[rgba(255,255,255,0.04)] border border-[rgba(212,175,55,0.12)] text-[#B8B8B8] text-xs rounded-xl focus:outline-none appearance-none cursor-pointer"
          >
            {SORTS.map((s) => <option key={s.value} value={s.value} className="bg-[#171717]">{s.label}</option>)}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-[#B8B8B8] pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="luxury-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="border-b border-[rgba(212,175,55,0.08)]">
                {["Product", "SKU", "Price", "Stock", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] text-[#B8B8B8] uppercase tracking-widest font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(212,175,55,0.04)]">
              <AnimatePresence>
                {loading
                  ? Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i}><td colSpan={6} className="px-4 py-3"><div className="skeleton h-10 rounded" /></td></tr>
                  ))
                  : products.map((product) => (
                    <motion.tr
                      key={product._id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      {/* Product */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-[#1A1A1A]">
                            {product.images?.[0] ? (
                              <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center text-lg opacity-15">🌸</div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-white text-sm font-medium line-clamp-1">{product.name}</p>
                            <p className="text-[10px] text-[#B8B8B8]">
                              {product.brand?.name ?? "—"} · {product.category?.name ?? "—"}
                            </p>
                          </div>
                        </div>
                      </td>
                      {/* SKU */}
                      <td className="px-4 py-3 font-mono text-xs text-[#B8B8B8]">{product.sku ?? "—"}</td>
                      {/* Price */}
                      <td className="px-4 py-3">
                        <p className="text-white text-sm">₹{product.price?.toLocaleString("en-IN")}</p>
                        {product.salePrice && (
                          <p className="text-[10px] text-green-400">Sale: ₹{product.salePrice.toLocaleString("en-IN")}</p>
                        )}
                      </td>
                      {/* Stock */}
                      <td className="px-4 py-3">
                        <span className={`text-sm font-medium ${
                          product.stock === 0 ? "text-red-400" :
                          product.stock <= 10 ? "text-orange-400" : "text-white"
                        }`}>
                          {product.stock}
                        </span>
                      </td>
                      {/* Status */}
                      <td className="px-4 py-3">
                        <span className={`text-[10px] px-2 py-1 rounded-full font-medium ${
                          product.isActive ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
                        }`}>
                          {product.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Link href={`/admin/products/${product._id}/edit`}>
                            <button className="p-1.5 text-[#B8B8B8] hover:text-[#D4AF37] hover:bg-[rgba(212,175,55,0.08)] rounded-lg transition-all">
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          </Link>
                          <Link href={`/product/${product.slug}`} target="_blank">
                            <button className="p-1.5 text-[#B8B8B8] hover:text-white hover:bg-white/5 rounded-lg transition-all">
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          </Link>
                          <button
                            onClick={() => handleDelete(product._id, product.name)}
                            disabled={deleting === product._id}
                            className="p-1.5 text-[#B8B8B8] hover:text-red-400 hover:bg-red-500/5 rounded-lg transition-all disabled:opacity-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                }
              </AnimatePresence>
            </tbody>
          </table>
          {!loading && products.length === 0 && (
            <div className="text-center py-16">
              <div className="text-5xl mb-3">📦</div>
              <p className="text-[#B8B8B8] text-sm">No products found.</p>
              <Link href="/admin/products/new" className="mt-4 inline-block">
                <GoldButton size="sm">Add First Product</GoldButton>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: Math.min(pagination.pages, 10) }).map((_, i) => {
            const p = i + 1;
            return (
              <button
                key={p}
                onClick={() => updateParam("page", String(p))}
                className={`w-8 h-8 rounded-lg text-xs transition-all ${
                  p === currentPage
                    ? "bg-[#D4AF37] text-black font-semibold"
                    : "text-[#B8B8B8] border border-[rgba(212,175,55,0.1)] hover:text-white"
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
