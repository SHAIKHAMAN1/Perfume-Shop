"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import GoldButton from "@/components/ui/GoldButton";

function BannerModal({ banner, onClose, onSave }) {
  const [form, setForm] = useState(
    banner ?? { title: "", subtitle: "", imageUrl: "", link: "", isActive: true, order: 0 }
  );
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.title.trim() || !form.imageUrl.trim()) return;
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg bg-[#0F0F0F] border border-[rgba(212,175,55,0.2)] rounded-2xl p-6 shadow-2xl"
      >
        <h2 className="font-serif text-xl text-white mb-5">{banner ? "Edit Banner" : "Add Banner"}</h2>
        <div className="space-y-4">
          {[
            { key: "title",    label: "Title *",           placeholder: "Summer Sale" },
            { key: "subtitle", label: "Subtitle",          placeholder: "Up to 40% off on select fragrances" },
            { key: "imageUrl", label: "Image URL *",       placeholder: "https://..." },
            { key: "link",     label: "Link (on click)",   placeholder: "/shop" },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="text-xs text-[#D4AF37] uppercase tracking-widest font-semibold mb-1.5 block">{label}</label>
              <input value={form[key]} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                className="w-full px-4 py-3 bg-white/5 border border-[rgba(212,175,55,0.12)] rounded-xl text-white text-sm focus:outline-none focus:border-[rgba(212,175,55,0.4)]"
                placeholder={placeholder} />
            </div>
          ))}
          <div>
            <label className="text-xs text-[#D4AF37] uppercase tracking-widest font-semibold mb-1.5 block">Display Order</label>
            <input type="number" value={form.order} onChange={(e) => setForm((f) => ({ ...f, order: Number(e.target.value) }))}
              className="w-full px-4 py-3 bg-white/5 border border-[rgba(212,175,55,0.12)] rounded-xl text-white text-sm focus:outline-none focus:border-[rgba(212,175,55,0.4)]" />
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

export default function AdminBannersPage() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/admin/banners");
      const d = await r.json();
      setBanners(d.banners ?? d ?? []);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = async (data) => {
    const isEdit = !!data._id;
    await fetch(isEdit ? `/api/admin/banners/${data._id}` : "/api/admin/banners", {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setModal(null);
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this banner?")) return;
    await fetch(`/api/admin/banners/${id}`, { method: "DELETE" });
    load();
  };

  const handleToggle = async (banner) => {
    await fetch(`/api/admin/banners/${banner._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...banner, isActive: !banner.isActive }),
    });
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl text-white">Banners</h1>
          <p className="text-xs text-[#B8B8B8] mt-0.5">{banners.length} banners total</p>
        </div>
        <GoldButton onClick={() => setModal("new")}><Plus className="w-4 h-4" /> Add Banner</GoldButton>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 gap-4">{[...Array(4)].map((_, i) => <div key={i} className="h-48 rounded-2xl bg-white/[0.03] animate-pulse" />)}</div>
      ) : banners.length === 0 ? (
        <div className="text-center py-20 text-[#B8B8B8]">No banners yet. Add your first banner!</div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {banners.map((banner, i) => (
            <motion.div key={banner._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="rounded-2xl border border-[rgba(212,175,55,0.1)] bg-white/[0.02] overflow-hidden">
              {/* Preview */}
              <div className="relative h-40 bg-[#1A1A1A]">
                {banner.imageUrl ? (
                  <Image src={banner.imageUrl} alt={banner.title} fill className="object-cover opacity-70" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ImageIcon className="w-10 h-10 text-[#B8B8B8]/30" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-3 left-4">
                  <p className="text-white font-semibold text-sm">{banner.title}</p>
                  {banner.subtitle && <p className="text-[#B8B8B8] text-xs">{banner.subtitle}</p>}
                </div>
                <span className={`absolute top-3 right-3 text-[10px] px-2 py-0.5 rounded-full ${banner.isActive ? "bg-green-500/80 text-white" : "bg-red-500/80 text-white"}`}>
                  {banner.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="flex items-center gap-2 p-3 border-t border-[rgba(212,175,55,0.08)]">
                <span className="text-xs text-[#B8B8B8] flex-1">Order: {banner.order ?? 0}</span>
                <button onClick={() => setModal(banner)} className="p-1.5 text-[#B8B8B8] hover:text-white hover:bg-white/5 rounded-lg transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                <button onClick={() => handleToggle(banner)} className="p-1.5 text-[#B8B8B8] hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                  {banner.isActive ? <ToggleRight className="w-4 h-4 text-green-400" /> : <ToggleLeft className="w-4 h-4" />}
                </button>
                <button onClick={() => handleDelete(banner._id)} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {modal && <BannerModal banner={modal === "new" ? null : modal} onClose={() => setModal(null)} onSave={handleSave} />}
    </div>
  );
}
