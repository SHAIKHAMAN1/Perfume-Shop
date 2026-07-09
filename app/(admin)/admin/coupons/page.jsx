"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Edit2, X, Save, Check } from "lucide-react";
import useUIStore from "@/store/useUIStore";
import GoldButton from "@/components/ui/GoldButton";

const EMPTY = { code:"", type:"percentage", value:"", maxDiscount:"", minOrderValue:"", maxUses:"", perUserLimit:"1", expiresAt:"", description:"", isActive:true };

function CouponModal({ coupon, onClose, onSaved }) {
  const addToast   = useUIStore((s) => s.addToast);
  const [form, setForm] = useState(coupon ? { ...coupon, value: String(coupon.value ?? ""), maxDiscount: String(coupon.maxDiscount ?? ""), minOrderValue: String(coupon.minOrderValue ?? ""), maxUses: String(coupon.maxUses ?? ""), perUserLimit: String(coupon.perUserLimit ?? "1"), expiresAt: coupon.expiresAt ? new Date(coupon.expiresAt).toISOString().split("T")[0] : "" } : EMPTY);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { ...form, value: parseFloat(form.value), maxDiscount: form.maxDiscount ? parseFloat(form.maxDiscount) : undefined, minOrderValue: form.minOrderValue ? parseFloat(form.minOrderValue) : 0, maxUses: form.maxUses ? parseInt(form.maxUses) : null, perUserLimit: parseInt(form.perUserLimit), expiresAt: form.expiresAt || undefined };
      const url     = coupon?._id ? `/api/admin/coupons/${coupon._id}` : "/api/admin/coupons";
      const method  = coupon?._id ? "PUT" : "POST";
      const res     = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data    = await res.json();
      if (res.ok) {
        addToast({ type: "success", message: `Coupon ${coupon ? "updated" : "created"}!` });
        onSaved(data.coupon);
      } else {
        addToast({ type: "error", message: data.error });
      }
    } catch { addToast({ type: "error", message: "Failed to save coupon." }); }
    finally { setSaving(false); }
  };

  const F = ({ label, name, type = "text", placeholder, half = false }) => (
    <div className={half ? "" : "col-span-2"}>
      <label className="block text-xs text-[#D4AF37] font-semibold uppercase tracking-widest mb-1">{label}</label>
      <input type={type} name={name} value={form[name]} onChange={handleChange} placeholder={placeholder}
        className="w-full px-3 py-2 bg-[rgba(255,255,255,0.04)] border border-[rgba(212,175,55,0.12)] text-white text-sm rounded-xl focus:outline-none focus:border-[rgba(212,175,55,0.3)] placeholder:text-[#B8B8B8]/40"
      />
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
        className="w-full max-w-lg luxury-card p-6 overflow-y-auto max-h-[90vh]"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-serif text-lg text-white">{coupon ? "Edit Coupon" : "Create Coupon"}</h2>
          <button onClick={onClose} className="text-[#B8B8B8] hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="block text-xs text-[#D4AF37] font-semibold uppercase tracking-widest mb-1">Code</label>
            <input name="code" value={form.code} onChange={handleChange} placeholder="LUXE20"
              className="w-full px-3 py-2 bg-[rgba(255,255,255,0.04)] border border-[rgba(212,175,55,0.12)] text-white text-sm rounded-xl uppercase tracking-widest focus:outline-none focus:border-[rgba(212,175,55,0.3)]"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-xs text-[#D4AF37] font-semibold uppercase tracking-widest mb-1">Type</label>
            <div className="flex gap-2">
              {["flat","percentage"].map((t) => (
                <button key={t} type="button" onClick={() => setForm((f) => ({...f, type: t}))}
                  className={`flex-1 py-2 text-sm rounded-xl border transition-all capitalize ${form.type === t ? "bg-[rgba(212,175,55,0.12)] border-[rgba(212,175,55,0.3)] text-[#D4AF37]" : "border-[rgba(212,175,55,0.08)] text-[#B8B8B8] hover:text-white"}`}>
                  {t === "flat" ? "Flat ₹" : "Percentage %"}
                </button>
              ))}
            </div>
          </div>
          <F label={form.type === "flat" ? "Amount (₹)" : "Percentage (%)"} name="value" type="number" placeholder={form.type === "flat" ? "200" : "15"} half />
          <F label="Max Discount (₹)" name="maxDiscount" type="number" placeholder="Optional cap" half />
          <F label="Min Order Value (₹)" name="minOrderValue" type="number" placeholder="0" half />
          <F label="Max Uses" name="maxUses" type="number" placeholder="Unlimited" half />
          <F label="Per User Limit" name="perUserLimit" type="number" placeholder="1" half />
          <F label="Expiry Date" name="expiresAt" type="date" half />
          <div className="col-span-2">
            <F label="Description" name="description" placeholder="Summer sale coupon" />
          </div>
          <div className="col-span-2 flex items-center gap-2">
            <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} className="accent-[#D4AF37] w-4 h-4" id="isActiveCoupon" />
            <label htmlFor="isActiveCoupon" className="text-sm text-white cursor-pointer">Active (visible to customers)</label>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <GoldButton className="flex-1" onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : <><Save className="w-4 h-4" /> {coupon ? "Update" : "Create"}</>}
          </GoldButton>
          <GoldButton variant="outline" onClick={onClose}>Cancel</GoldButton>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function AdminCouponsPage() {
  const addToast  = useUIStore((s) => s.addToast);
  const [coupons,  setCoupons]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [modal,    setModal]    = useState(null); // null | "new" | {coupon}
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetch("/api/admin/coupons").then((r) => r.json()).then((d) => setCoupons(d.coupons ?? [])).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id, code) => {
    if (!confirm(`Delete coupon "${code}"?`)) return;
    setDeleting(id);
    const res = await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" });
    if (res.ok) { setCoupons((c) => c.filter((x) => x._id !== id)); addToast({ type: "success", message: `Coupon "${code}" deleted.` }); }
    else addToast({ type: "error", message: "Failed to delete coupon." });
    setDeleting(null);
  };

  const handleSaved = (coupon) => {
    setCoupons((c) => {
      const exists = c.find((x) => x._id === coupon._id);
      return exists ? c.map((x) => x._id === coupon._id ? coupon : x) : [coupon, ...c];
    });
    setModal(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-white">Coupons</h1>
          <p className="text-sm text-[#B8B8B8]">{coupons.length} coupons</p>
        </div>
        <GoldButton onClick={() => setModal("new")}><Plus className="w-4 h-4" /> Create Coupon</GoldButton>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading
          ? Array.from({length: 6}).map((_,i) => <div key={i} className="skeleton h-36 rounded-2xl" />)
          : coupons.map((coupon) => (
            <motion.div key={coupon._id} layout className="luxury-card p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-mono text-base font-bold text-[#D4AF37] tracking-widest">{coupon.code}</p>
                  <p className="text-xs text-[#B8B8B8] mt-0.5">{coupon.description || "—"}</p>
                </div>
                <span className={`text-[9px] px-2 py-0.5 rounded-full border font-medium ${coupon.isActive ? "border-green-500/30 bg-green-500/10 text-green-400" : "border-red-500/30 bg-red-500/10 text-red-400"}`}>
                  {coupon.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-2 py-1 bg-[rgba(212,175,55,0.08)] text-[#D4AF37] rounded-lg">
                  {coupon.type === "flat" ? `₹${coupon.value} off` : `${coupon.value}% off`}
                </span>
                {coupon.minOrderValue > 0 && <span className="px-2 py-1 bg-white/5 text-[#B8B8B8] rounded-lg">Min ₹{coupon.minOrderValue}</span>}
                {coupon.maxUses && <span className="px-2 py-1 bg-white/5 text-[#B8B8B8] rounded-lg">{coupon.usedCount}/{coupon.maxUses} used</span>}
                {coupon.expiresAt && <span className="px-2 py-1 bg-white/5 text-[#B8B8B8] rounded-lg">Expires {new Date(coupon.expiresAt).toLocaleDateString("en-IN")}</span>}
              </div>
              <div className="flex gap-2 pt-1">
                <button onClick={() => setModal(coupon)} className="flex items-center gap-1 px-3 py-1.5 text-xs border border-[rgba(212,175,55,0.15)] text-[#D4AF37] rounded-xl hover:bg-[rgba(212,175,55,0.08)] transition-colors">
                  <Edit2 className="w-3 h-3" /> Edit
                </button>
                <button onClick={() => handleDelete(coupon._id, coupon.code)} disabled={deleting === coupon._id}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs border border-red-500/20 text-red-400 rounded-xl hover:bg-red-500/5 transition-colors disabled:opacity-50">
                  <Trash2 className="w-3 h-3" /> Delete
                </button>
              </div>
            </motion.div>
          ))
        }
      </div>

      {!loading && coupons.length === 0 && (
        <div className="text-center py-20">
          <div className="text-5xl mb-3">🏷️</div>
          <p className="text-[#B8B8B8] text-sm mb-5">No coupons yet. Create one to reward your customers!</p>
          <GoldButton onClick={() => setModal("new")}><Plus className="w-4 h-4" /> Create First Coupon</GoldButton>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <CouponModal
            coupon={modal === "new" ? null : modal}
            onClose={() => setModal(null)}
            onSaved={handleSaved}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
