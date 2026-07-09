"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Search, Globe, Star } from "lucide-react";
import GoldButton from "@/components/ui/GoldButton";

function BrandModal({ brand, onClose, onSave }) {
  const [form, setForm] = useState(
    brand ?? { name: "", slug: "", description: "", country: "", website: "", isFeatured: false, isActive: true }
  );
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    // Auto-slug if empty
    const slug = form.slug || form.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    await onSave({ ...form, slug });
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg bg-[#0F0F0F] border border-[rgba(212,175,55,0.2)] rounded-2xl p-6 shadow-2xl"
      >
        <h2 className="font-serif text-xl text-white mb-5">{brand ? "Edit Brand" : "Add Brand"}</h2>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-[#D4AF37] uppercase tracking-widest font-semibold mb-1.5 block">Brand Name *</label>
            <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full px-4 py-3 bg-white/5 border border-[rgba(212,175,55,0.12)] rounded-xl text-white text-sm focus:outline-none focus:border-[rgba(212,175,55,0.4)]"
              placeholder="e.g. DIOR" />
          </div>
          <div>
            <label className="text-xs text-[#D4AF37] uppercase tracking-widest font-semibold mb-1.5 block">Slug</label>
            <input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              className="w-full px-4 py-3 bg-white/5 border border-[rgba(212,175,55,0.12)] rounded-xl text-white text-sm focus:outline-none focus:border-[rgba(212,175,55,0.4)]"
              placeholder="auto-generated if empty" />
          </div>
          <div>
            <label className="text-xs text-[#D4AF37] uppercase tracking-widest font-semibold mb-1.5 block">Country</label>
            <input value={form.country} onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
              className="w-full px-4 py-3 bg-white/5 border border-[rgba(212,175,55,0.12)] rounded-xl text-white text-sm focus:outline-none focus:border-[rgba(212,175,55,0.4)]"
              placeholder="France" />
          </div>
          <div>
            <label className="text-xs text-[#D4AF37] uppercase tracking-widest font-semibold mb-1.5 block">Website</label>
            <input value={form.website} onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
              className="w-full px-4 py-3 bg-white/5 border border-[rgba(212,175,55,0.12)] rounded-xl text-white text-sm focus:outline-none focus:border-[rgba(212,175,55,0.4)]"
              placeholder="https://dior.com" />
          </div>
          <div>
            <label className="text-xs text-[#D4AF37] uppercase tracking-widest font-semibold mb-1.5 block">Description</label>
            <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={3}
              className="w-full px-4 py-3 bg-white/5 border border-[rgba(212,175,55,0.12)] rounded-xl text-white text-sm focus:outline-none focus:border-[rgba(212,175,55,0.4)] resize-none"
              placeholder="Brand description…" />
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm((f) => ({ ...f, isFeatured: e.target.checked }))} className="accent-[#D4AF37]" />
              <span className="text-sm text-white">Featured</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} className="accent-[#D4AF37]" />
              <span className="text-sm text-white">Active</span>
            </label>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-[rgba(212,175,55,0.15)] text-[#B8B8B8] text-sm hover:bg-white/5 transition-colors">Cancel</button>
          <GoldButton onClick={handleSave} disabled={saving} className="flex-1">
            {saving ? "Saving…" : "Save Brand"}
          </GoldButton>
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminBrandsPage() {
  const [brands, setBrands]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [modal, setModal]       = useState(null); // null | "new" | brand object

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/admin/brands?limit=100");
      const d = await r.json();
      setBrands(d.brands ?? []);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = async (data) => {
    const isEdit = !!data._id;
    const url    = isEdit ? `/api/admin/brands/${data._id}` : "/api/admin/brands";
    const method = isEdit ? "PUT" : "POST";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    setModal(null);
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this brand?")) return;
    await fetch(`/api/admin/brands/${id}`, { method: "DELETE" });
    load();
  };

  const handleToggle = async (brand) => {
    await fetch(`/api/admin/brands/${brand._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...brand, isActive: !brand.isActive }),
    });
    load();
  };

  const filtered = brands.filter((b) => b.name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl text-white">Brands</h1>
          <p className="text-xs text-[#B8B8B8] mt-0.5">{brands.length} brands total</p>
        </div>
        <GoldButton onClick={() => setModal("new")}>
          <Plus className="w-4 h-4" /> Add Brand
        </GoldButton>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B8B8B8]" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search brands…"
          className="pl-9 pr-4 py-2.5 w-full bg-white/5 border border-[rgba(212,175,55,0.12)] rounded-xl text-sm text-white placeholder:text-[#B8B8B8]/50 focus:outline-none focus:border-[rgba(212,175,55,0.3)]"
        />
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="h-36 rounded-2xl bg-white/[0.03] animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-[#B8B8B8]">
          {brands.length === 0 ? "No brands yet. Add your first brand!" : "No brands match your search."}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((brand, i) => (
            <motion.div
              key={brand._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="p-5 rounded-2xl border border-[rgba(212,175,55,0.1)] bg-[rgba(255,255,255,0.02)] hover:border-[rgba(212,175,55,0.2)] transition-colors"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-serif text-lg text-white truncate">{brand.name}</p>
                    {brand.isFeatured && <Star className="w-3 h-3 text-[#D4AF37] fill-[#D4AF37] flex-shrink-0" />}
                  </div>
                  {brand.country && (
                    <p className="text-xs text-[#B8B8B8] flex items-center gap-1">
                      <Globe className="w-3 h-3" /> {brand.country}
                    </p>
                  )}
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${brand.isActive ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                  {brand.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              {brand.description && (
                <p className="text-xs text-[#B8B8B8] line-clamp-2 mb-3">{brand.description}</p>
              )}
              <div className="flex items-center gap-2 pt-3 border-t border-[rgba(212,175,55,0.08)]">
                <button onClick={() => setModal(brand)} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs text-[#B8B8B8] hover:text-white hover:bg-white/5 transition-colors">
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </button>
                <button onClick={() => handleToggle(brand)} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs text-[#B8B8B8] hover:text-white hover:bg-white/5 transition-colors">
                  {brand.isActive ? <ToggleRight className="w-3.5 h-3.5 text-green-400" /> : <ToggleLeft className="w-3.5 h-3.5" />}
                  {brand.isActive ? "Disable" : "Enable"}
                </button>
                <button onClick={() => handleDelete(brand._id)} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs text-red-400 hover:bg-red-500/10 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {modal && (
        <BrandModal
          brand={modal === "new" ? null : modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
