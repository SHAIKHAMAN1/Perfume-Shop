"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Star, Trash2, CheckCircle, XCircle, Search, Filter } from "lucide-react";

function StarRow({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={`w-3.5 h-3.5 ${s <= rating ? "text-[#D4AF37] fill-[#D4AF37]" : "text-[#B8B8B8]/30"}`} />
      ))}
    </div>
  );
}

export default function AdminReviewsPage() {
  const [reviews, setReviews]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/admin/reviews?limit=50");
      const d = await r.json();
      setReviews(d.reviews ?? d ?? []);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleApprove = async (id) => {
    await fetch(`/api/admin/reviews/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isApproved: true }) });
    load();
  };

  const handleReject = async (id) => {
    await fetch(`/api/admin/reviews/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isApproved: false }) });
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this review?")) return;
    await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
    load();
  };

  const filtered = reviews.filter((r) => {
    const matchSearch = r.comment?.toLowerCase().includes(search.toLowerCase()) ||
                        r.user?.displayName?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" ||
                        (statusFilter === "approved" && r.isApproved) ||
                        (statusFilter === "pending" && !r.isApproved);
    return matchSearch && matchStatus;
  });

  const pending   = reviews.filter((r) => !r.isApproved).length;
  const approved  = reviews.filter((r) => r.isApproved).length;
  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : "—";

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-2xl text-white">Reviews</h1>
        <p className="text-xs text-[#B8B8B8] mt-0.5">{reviews.length} total reviews</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Average Rating", value: avgRating, color: "text-[#D4AF37]" },
          { label: "Approved",       value: approved,  color: "text-green-400" },
          { label: "Pending",        value: pending,   color: "text-amber-400" },
        ].map((s) => (
          <div key={s.label} className="p-4 rounded-xl border border-[rgba(212,175,55,0.1)] bg-white/[0.02] text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-[#B8B8B8] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B8B8B8]" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search reviews…"
            className="pl-9 pr-4 py-2.5 w-full bg-white/5 border border-[rgba(212,175,55,0.12)] rounded-xl text-sm text-white placeholder:text-[#B8B8B8]/50 focus:outline-none focus:border-[rgba(212,175,55,0.3)]" />
        </div>
        <div className="flex rounded-xl border border-[rgba(212,175,55,0.12)] overflow-hidden">
          {["all", "pending", "approved"].map((f) => (
            <button key={f} onClick={() => setStatusFilter(f)}
              className={`px-4 py-2 text-xs font-medium capitalize transition-colors ${statusFilter === f ? "bg-[rgba(212,175,55,0.15)] text-[#D4AF37]" : "text-[#B8B8B8] hover:text-white"}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-24 rounded-xl bg-white/[0.03] animate-pulse" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-[#B8B8B8]">No reviews found.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((review, i) => (
            <motion.div key={review._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
              className="p-5 rounded-2xl border border-[rgba(212,175,55,0.08)] bg-white/[0.02] hover:border-[rgba(212,175,55,0.15)] transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1.5">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#A8891C] flex items-center justify-center flex-shrink-0">
                      <span className="text-black text-xs font-bold">{(review.user?.displayName ?? "U")[0].toUpperCase()}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{review.user?.displayName ?? "Anonymous"}</p>
                      <p className="text-[10px] text-[#B8B8B8]">{review.product?.name ?? "Product"}</p>
                    </div>
                    <StarRow rating={review.rating} />
                    <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full ${review.isApproved ? "bg-green-500/10 text-green-400" : "bg-amber-500/10 text-amber-400"}`}>
                      {review.isApproved ? "Approved" : "Pending"}
                    </span>
                  </div>
                  {review.title && <p className="text-sm font-medium text-white mb-1">{review.title}</p>}
                  <p className="text-sm text-[#B8B8B8] line-clamp-2">{review.comment}</p>
                  <p className="text-[10px] text-[#B8B8B8]/50 mt-1.5">{new Date(review.createdAt).toLocaleDateString("en-IN")}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-3 pt-3 border-t border-[rgba(212,175,55,0.06)]">
                {!review.isApproved && (
                  <button onClick={() => handleApprove(review._id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-green-400 hover:bg-green-500/10 transition-colors">
                    <CheckCircle className="w-3.5 h-3.5" /> Approve
                  </button>
                )}
                {review.isApproved && (
                  <button onClick={() => handleReject(review._id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-amber-400 hover:bg-amber-500/10 transition-colors">
                    <XCircle className="w-3.5 h-3.5" /> Unapprove
                  </button>
                )}
                <button onClick={() => handleDelete(review._id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-red-400 hover:bg-red-500/10 transition-colors ml-auto">
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
