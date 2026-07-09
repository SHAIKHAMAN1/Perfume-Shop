"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Search, Layers } from "lucide-react";
import GoldButton from "@/components/ui/GoldButton";

function CategoryModal({ category, onClose, onSave }) {
  const [form, setForm] = useState(
    category ?? { name: "", slug: "", description: "", isActive: true }
  );
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    const slug = form.slug || form.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    await onSave({ ...form, slug });
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-[#0F0F0F] border border-[rgba(212,175,55,0.2)] rounded-2xl p-6 shadow-2xl"
      >
        <h2 className="font-serif text-xl text-white mb-5">{category ? "Edit Category" : "Add Category"}</h2>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-[#D4AF37] uppercase tracking-widest font-semibold mb-1.5 block">Category Name *</label>
            <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full px-4 py-3 bg-white/5 border border-[rgba(212,175,55,0.12)] rounded-xl text-white text-sm focus:outline-none focus:border-[rgba(212,175,55,0.4)]"
              placeholder="e.g. Eau de Parfum" />
          </div>
          <div>
            <label className="text-xs text-[#D4AF37] uppercase tracking-widest font-semibold mb-1.5 block">Slug</label>
            <input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              className="w-full px-4 py-3 bg-white/5 border border-[rgba(212,175,55,0.12)] rounded-xl text-white text-sm focus:outline-none focus:border-[rgba(212,175,55,0.4)]"
              placeholder="auto-generated if empty" />
          </div>
          <div>
            <label className="text-xs text-[#D4AF37] uppercase tracking-widest font-semibold mb-1.5 block">Description</label>
            <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={3} className="w-full px-4 py-3 bg-white/5 border border-[rgba(212,175,55,0.12)] rounded-xl text-white text-sm focus:outline-none focus:border-[rgba(212,175,55,0.4)] resize-none"
              placeholder="Category description…" />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} className="accent-[#D4AF37]" />
            <span className="text-sm text-white">Active</span>
          </label>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-[rgba(212,175,55,0.15)] text-[#B8B8B8] text-sm hover:bg-white/5 transition-colors">Cancel</button>
          <GoldButton onClick={handleSave} disabled={saving} className="flex-1">{saving ? "Saving…" : "Save"}</GoldButton>
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [modal, setModal]           = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/admin/categories?limit=100");
      const d = await r.json();
      setCategories(d.categories ?? d ?? []);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = async (data) => {
    const isEdit = !!data._id;
    await fetch(isEdit ? `/api/admin/categories/${data._id}` : "/api/admin/categories", {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setModal(null);
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this category?")) return;
    await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    load();
  };

  const filtered = categories.filter((c) => c.name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl text-white">Categories</h1>
          <p className="text-xs text-[#B8B8B8] mt-0.5">{categories.length} categories total</p>
        </div>
        <GoldButton onClick={() => setModal("new")}><Plus className="w-4 h-4" /> Add Category</GoldButton>
      </div>

      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B8B8B8]" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search categories…"
          className="pl-9 pr-4 py-2.5 w-full bg-white/5 border border-[rgba(212,175,55,0.12)] rounded-xl text-sm text-white placeholder:text-[#B8B8B8]/50 focus:outline-none focus:border-[rgba(212,175,55,0.3)]" />
      </div>

      {loading ? (
        <div className="space-y-2">{[...Array(6)].map((_, i) => <div key={i} className="h-16 rounded-xl bg-white/[0.03] animate-pulse" />)}</div>
      ) : (
        <div className="space-y-2">
          {filtered.map((cat, i) => (
            <motion.div key={cat._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
              className="flex items-center gap-4 p-4 rounded-xl border border-[rgba(212,175,55,0.08)] bg-white/[0.02] hover:border-[rgba(212,175,55,0.18)] transition-colors">
              <div className="w-9 h-9 rounded-xl bg-[rgba(212,175,55,0.1)] flex items-center justify-center flex-shrink-0">
                <Layers className="w-4 h-4 text-[#D4AF37]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-white">{cat.name}</p>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${cat.isActive !== false ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                    {cat.isActive !== false ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="text-xs text-[#B8B8B8] truncate">{cat.slug}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setModal(cat)} className="p-1.5 text-[#B8B8B8] hover:text-white hover:bg-white/5 rounded-lg transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                <button onClick={() => handleDelete(cat._id)} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-16 text-[#B8B8B8]">{categories.length === 0 ? "No categories yet." : "No matches found."}</div>
          )}
        </div>
      )}

      {modal && <CategoryModal category={modal === "new" ? null : modal} onClose={() => setModal(null)} onSave={handleSave} />}
    </div>
  );
}
