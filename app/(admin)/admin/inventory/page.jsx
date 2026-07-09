"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, AlertTriangle, Package, TrendingDown, ArrowUpDown } from "lucide-react";
import GoldButton from "@/components/ui/GoldButton";

export default function AdminInventoryPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [filter, setFilter]     = useState("all"); // all | low | out
  const [sortBy, setSortBy]     = useState("stock-asc");
  const [editId, setEditId]     = useState(null);
  const [editStock, setEditStock] = useState("");
  const [saving, setSaving]     = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/admin/products?limit=200&fields=name,sku,stock,price,isActive");
      const d = await r.json();
      setProducts(d.products ?? []);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSaveStock = async (id) => {
    const val = parseInt(editStock, 10);
    if (isNaN(val) || val < 0) return;
    setSaving(true);
    await fetch(`/api/admin/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stock: val }),
    });
    setSaving(false);
    setEditId(null);
    load();
  };

  const sorted = [...products].sort((a, b) => {
    if (sortBy === "stock-asc") return a.stock - b.stock;
    if (sortBy === "stock-desc") return b.stock - a.stock;
    if (sortBy === "name") return a.name.localeCompare(b.name);
    return 0;
  });

  const filtered = sorted.filter((p) => {
    const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase()) ||
                        p.sku?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" ||
                        (filter === "low"  && p.stock > 0  && p.stock <= 10) ||
                        (filter === "out"  && p.stock === 0);
    return matchSearch && matchFilter;
  });

  const outOfStock = products.filter((p) => p.stock === 0).length;
  const lowStock   = products.filter((p) => p.stock > 0 && p.stock <= 10).length;
  const totalUnits = products.reduce((s, p) => s + (p.stock ?? 0), 0);

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-2xl text-white">Inventory</h1>
        <p className="text-xs text-[#B8B8B8] mt-0.5">{products.length} products tracked</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Units",   value: totalUnits.toLocaleString("en-IN"), icon: Package,      color: "text-white" },
          { label: "Low Stock",     value: lowStock,                            icon: TrendingDown,  color: "text-amber-400" },
          { label: "Out of Stock",  value: outOfStock,                          icon: AlertTriangle, color: "text-red-400" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="p-4 rounded-xl border border-[rgba(212,175,55,0.1)] bg-white/[0.02] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[rgba(212,175,55,0.08)] flex items-center justify-center flex-shrink-0">
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div>
              <p className={`text-xl font-bold ${color}`}>{value}</p>
              <p className="text-[10px] text-[#B8B8B8]">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B8B8B8]" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or SKU…"
            className="pl-9 pr-4 py-2.5 w-full bg-white/5 border border-[rgba(212,175,55,0.12)] rounded-xl text-sm text-white placeholder:text-[#B8B8B8]/50 focus:outline-none focus:border-[rgba(212,175,55,0.3)]" />
        </div>
        <div className="flex rounded-xl border border-[rgba(212,175,55,0.12)] overflow-hidden">
          {[
            { key: "all", label: "All" },
            { key: "low", label: "Low Stock" },
            { key: "out", label: "Out of Stock" },
          ].map(({ key, label }) => (
            <button key={key} onClick={() => setFilter(key)}
              className={`px-4 py-2 text-xs font-medium transition-colors ${filter === key ? "bg-[rgba(212,175,55,0.15)] text-[#D4AF37]" : "text-[#B8B8B8] hover:text-white"}`}>
              {label}
            </button>
          ))}
        </div>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 bg-white/5 border border-[rgba(212,175,55,0.12)] rounded-xl text-sm text-white focus:outline-none appearance-none">
          <option value="stock-asc">Stock: Low → High</option>
          <option value="stock-desc">Stock: High → Low</option>
          <option value="name">Name A–Z</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-2">{[...Array(8)].map((_, i) => <div key={i} className="h-12 rounded-xl bg-white/[0.03] animate-pulse" />)}</div>
      ) : (
        <div className="rounded-2xl border border-[rgba(212,175,55,0.1)] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[rgba(212,175,55,0.08)] bg-white/[0.02]">
                <th className="text-left px-4 py-3 text-xs text-[#D4AF37] font-semibold uppercase tracking-widest">Product</th>
                <th className="text-left px-4 py-3 text-xs text-[#D4AF37] font-semibold uppercase tracking-widest">SKU</th>
                <th className="text-left px-4 py-3 text-xs text-[#D4AF37] font-semibold uppercase tracking-widest">Status</th>
                <th className="text-left px-4 py-3 text-xs text-[#D4AF37] font-semibold uppercase tracking-widest">Stock</th>
                <th className="text-left px-4 py-3 text-xs text-[#D4AF37] font-semibold uppercase tracking-widest">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(212,175,55,0.05)]">
              {filtered.map((product) => {
                const isOut = product.stock === 0;
                const isLow = product.stock > 0 && product.stock <= 10;
                return (
                  <tr key={product._id} className="hover:bg-white/[0.015] transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-white font-medium line-clamp-1">{product.name}</p>
                    </td>
                    <td className="px-4 py-3 text-[#B8B8B8] font-mono text-xs">{product.sku ?? "—"}</td>
                    <td className="px-4 py-3">
                      {isOut ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-400">Out of Stock</span>
                      ) : isLow ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400">Low Stock</span>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400">In Stock</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {editId === product._id ? (
                        <input
                          type="number"
                          value={editStock}
                          onChange={(e) => setEditStock(e.target.value)}
                          className="w-24 px-2 py-1 bg-white/10 border border-[rgba(212,175,55,0.3)] rounded-lg text-white text-xs focus:outline-none"
                          autoFocus
                          onKeyDown={(e) => { if (e.key === "Enter") handleSaveStock(product._id); if (e.key === "Escape") setEditId(null); }}
                        />
                      ) : (
                        <span className={`font-semibold ${isOut ? "text-red-400" : isLow ? "text-amber-400" : "text-white"}`}>{product.stock}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {editId === product._id ? (
                        <div className="flex gap-2">
                          <button onClick={() => handleSaveStock(product._id)} disabled={saving}
                            className="px-3 py-1 rounded-lg bg-[rgba(212,175,55,0.2)] text-[#D4AF37] text-xs hover:bg-[rgba(212,175,55,0.3)] transition-colors disabled:opacity-50">
                            {saving ? "…" : "Save"}
                          </button>
                          <button onClick={() => setEditId(null)} className="px-3 py-1 rounded-lg border border-[rgba(212,175,55,0.1)] text-[#B8B8B8] text-xs hover:bg-white/5 transition-colors">Cancel</button>
                        </div>
                      ) : (
                        <button onClick={() => { setEditId(product._id); setEditStock(String(product.stock)); }}
                          className="px-3 py-1 rounded-lg border border-[rgba(212,175,55,0.12)] text-[#B8B8B8] text-xs hover:text-white hover:bg-white/5 transition-colors">
                          Update
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="text-center py-12 text-[#B8B8B8]">No products found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
