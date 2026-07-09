"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, Eye } from "lucide-react";
import Link from "next/link";

const STATUS_OPTIONS = ["all","pending","confirmed","packed","dispatched","out_for_delivery","shipped","delivered","cancelled","refunded"];
const STATUS_LABELS  = {
  pending         : "Pending",
  confirmed       : "Confirmed",
  packed          : "Packed",
  dispatched      : "Dispatched",
  out_for_delivery: "Out for Delivery",
  shipped         : "Shipped",
  delivered       : "Delivered",
  cancelled       : "Cancelled",
  returned        : "Returned",
  refunded        : "Refunded",
};
const STATUS_COLORS  = {
  pending         : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  confirmed       : "bg-blue-500/10 text-blue-400 border-blue-500/20",
  packed          : "bg-purple-500/10 text-purple-400 border-purple-500/20",
  dispatched      : "bg-orange-500/10 text-orange-400 border-orange-500/20",
  out_for_delivery: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  shipped         : "bg-orange-500/10 text-orange-400 border-orange-500/20",
  delivered       : "bg-green-500/10 text-green-400 border-green-500/20",
  cancelled       : "bg-red-500/10 text-red-400 border-red-500/20",
  returned        : "bg-red-500/10 text-red-400 border-red-500/20",
  refunded        : "bg-gray-500/10 text-gray-400 border-gray-500/20",
};

export default function AdminOrdersPage() {
  const router       = useRouter();
  const pathname     = usePathname();
  const searchParams = useSearchParams();

  const [orders,     setOrders]     = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [q,          setQ]          = useState(searchParams.get("q") ?? "");

  const currentStatus = searchParams.get("status") ?? "all";
  const currentPage   = parseInt(searchParams.get("page") ?? "1");

  const updateParam = (key, value) => {
    const p = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") p.set(key, value); else p.delete(key);
    p.delete("page");
    router.push(`${pathname}?${p.toString()}`);
  };

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams(searchParams.toString());
    try {
      const res  = await fetch(`/api/admin/orders?${params}`);
      const data = await res.json();
      if (res.ok) { setOrders(data.orders); setPagination(data.pagination); }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [searchParams]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl text-white">Orders</h1>
        <p className="text-sm text-[#B8B8B8]">{pagination?.total ?? 0} total orders</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <form onSubmit={(e) => { e.preventDefault(); updateParam("q", q); }} className="flex gap-2 flex-1 min-w-48">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B8B8B8]" />
            <input
              value={q} onChange={(e) => setQ(e.target.value)}
              placeholder="Search by order number…"
              className="w-full pl-9 pr-4 py-2.5 bg-[rgba(255,255,255,0.04)] border border-[rgba(212,175,55,0.12)] text-white text-sm rounded-xl focus:outline-none focus:border-[rgba(212,175,55,0.3)] placeholder:text-[#B8B8B8]/50"
            />
          </div>
          <button type="submit" className="px-4 py-2.5 bg-[rgba(212,175,55,0.1)] border border-[rgba(212,175,55,0.2)] text-[#D4AF37] rounded-xl text-sm hover:bg-[rgba(212,175,55,0.15)] transition-colors">
            Search
          </button>
        </form>
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => updateParam("status", s)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all capitalize ${
                currentStatus === s || (s === "all" && (currentStatus === "all" || !searchParams.get("status")))
                  ? "bg-[rgba(212,175,55,0.12)] text-[#D4AF37] border-[rgba(212,175,55,0.25)]"
                  : "text-[#B8B8B8] border-[rgba(212,175,55,0.08)] hover:text-white"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="luxury-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="border-b border-[rgba(212,175,55,0.08)]">
                {["Order #","Customer","Items","Total","Payment","Status","Date",""].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] text-[#B8B8B8] uppercase tracking-widest font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(212,175,55,0.04)]">
              {loading
                ? Array.from({length: 10}).map((_,i) => (
                  <tr key={i}><td colSpan={8} className="px-4 py-3"><div className="skeleton h-8 rounded" /></td></tr>
                ))
                : orders.map((order) => (
                  <tr key={order._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-[#D4AF37]">{order.orderNumber}</td>
                    <td className="px-4 py-3">
                      <p className="text-white text-xs font-medium">{order.user?.name ?? "—"}</p>
                      <p className="text-[10px] text-[#B8B8B8]">{order.user?.email ?? ""}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#B8B8B8]">{order.items?.length} item{order.items?.length !== 1 ? "s" : ""}</td>
                    <td className="px-4 py-3 text-sm text-white font-medium">₹{order.total.toLocaleString("en-IN")}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] px-2 py-1 rounded-full border font-medium ${
                        order.paymentStatus === "paid" ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                      }`}>{order.paymentStatus}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] px-2 py-1 rounded-full border font-medium ${STATUS_COLORS[order.status] ?? "bg-white/5 text-white border-white/10"}`}>
                        {STATUS_LABELS[order.status] ?? order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#B8B8B8]">
                      {new Date(order.createdAt).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/orders/${order._id}`}>
                        <button className="p-1.5 text-[#B8B8B8] hover:text-[#D4AF37] hover:bg-[rgba(212,175,55,0.08)] rounded-lg transition-all">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
          {!loading && orders.length === 0 && (
            <p className="text-center py-16 text-sm text-[#B8B8B8]">No orders found.</p>
          )}
        </div>
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({length: Math.min(pagination.pages, 10)}).map((_,i) => {
            const p = i + 1;
            return (
              <button key={p} onClick={() => updateParam("page", String(p))}
                className={`w-8 h-8 rounded-lg text-xs transition-all ${p === currentPage ? "bg-[#D4AF37] text-black font-semibold" : "text-[#B8B8B8] border border-[rgba(212,175,55,0.1)] hover:text-white"}`}>
                {p}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
