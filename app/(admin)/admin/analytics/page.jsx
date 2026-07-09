"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp, IndianRupee, ShoppingCart, Users,
  Package, BarChart3, ArrowUpRight,
} from "lucide-react";

function MiniBar({ values }) {
  const max = Math.max(...values, 1);
  return (
    <div className="flex items-end gap-0.5 h-10">
      {values.map((v, i) => (
        <div
          key={i}
          className="flex-1 bg-[#D4AF37]/30 hover:bg-[#D4AF37]/60 rounded-sm transition-colors"
          style={{ height: `${Math.max(4, (v / max) * 40)}px` }}
        />
      ))}
    </div>
  );
}

export default function AdminAnalyticsPage() {
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange]     = useState("30"); // days

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/stats?days=${range}`)
      .then((r) => r.json())
      .then((d) => setStats(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [range]);

  const METRICS = stats ? [
    { label: "Total Revenue",   value: `₹${(stats.totalRevenue ?? 0).toLocaleString("en-IN")}`, icon: IndianRupee, color: "text-[#D4AF37]", growth: stats.revenueGrowth },
    { label: "Total Orders",    value: stats.totalOrders ?? 0,                                    icon: ShoppingCart, color: "text-blue-400",    growth: stats.ordersGrowth },
    { label: "New Customers",   value: stats.newCustomers ?? 0,                                   icon: Users,        color: "text-green-400",   growth: stats.customersGrowth },
    { label: "Avg Order Value", value: `₹${(stats.avgOrderValue ?? 0).toLocaleString("en-IN")}`, icon: TrendingUp,  color: "text-purple-400",  growth: stats.aovGrowth },
  ] : [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl text-white">Analytics</h1>
          <p className="text-xs text-[#B8B8B8] mt-0.5">Performance overview</p>
        </div>
        <div className="flex rounded-xl border border-[rgba(212,175,55,0.12)] overflow-hidden">
          {[["7", "7d"], ["30", "30d"], ["90", "90d"]].map(([val, label]) => (
            <button key={val} onClick={() => setRange(val)}
              className={`px-4 py-2 text-xs font-medium transition-colors ${range === val ? "bg-[rgba(212,175,55,0.15)] text-[#D4AF37]" : "text-[#B8B8B8] hover:text-white"}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => <div key={i} className="h-28 rounded-2xl bg-white/[0.03] animate-pulse" />)}
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {METRICS.map(({ label, value, icon: Icon, color, growth }, i) => (
              <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                className="p-5 rounded-2xl border border-[rgba(212,175,55,0.1)] bg-white/[0.02]">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-[rgba(212,175,55,0.08)] flex items-center justify-center">
                    <Icon className={`w-4.5 h-4.5 ${color}`} />
                  </div>
                  {growth != null && (
                    <span className={`text-[10px] font-semibold flex items-center gap-0.5 ${growth >= 0 ? "text-green-400" : "text-red-400"}`}>
                      <ArrowUpRight className={`w-3 h-3 ${growth < 0 ? "rotate-90" : ""}`} />
                      {Math.abs(growth)}%
                    </span>
                  )}
                </div>
                <p className={`text-xl font-bold ${color}`}>{value}</p>
                <p className="text-[10px] text-[#B8B8B8] mt-0.5">{label}</p>
              </motion.div>
            ))}
          </div>

          {/* Revenue chart placeholder */}
          <div className="p-6 rounded-2xl border border-[rgba(212,175,55,0.1)] bg-white/[0.02] mb-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-4 h-4 text-[#D4AF37]" />
              <h2 className="text-sm font-semibold text-white">Revenue Trend</h2>
            </div>
            {stats?.dailyRevenue?.length ? (
              <div>
                <div className="flex items-end gap-1 h-24">
                  {stats.dailyRevenue.map((d, i) => {
                    const max = Math.max(...stats.dailyRevenue.map((x) => x.revenue), 1);
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                        <div className="w-full bg-[#D4AF37]/20 hover:bg-[#D4AF37]/50 rounded-sm transition-colors"
                          style={{ height: `${Math.max(4, (d.revenue / max) * 80)}px` }} />
                        <p className="text-[8px] text-[#B8B8B8]/40 truncate w-full text-center">
                          {d.date?.split("-").slice(1).join("/")}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="h-24 flex items-center justify-center text-[#B8B8B8] text-sm">No data for this period.</div>
            )}
          </div>

          {/* Top Products */}
          {stats?.topProducts?.length > 0 && (
            <div className="p-6 rounded-2xl border border-[rgba(212,175,55,0.1)] bg-white/[0.02]">
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-4 h-4 text-[#D4AF37]" />
                <h2 className="text-sm font-semibold text-white">Top Products</h2>
              </div>
              <div className="space-y-3">
                {stats.topProducts.slice(0, 5).map((p, i) => (
                  <div key={p._id} className="flex items-center gap-3">
                    <span className="text-xs text-[#B8B8B8]/50 w-4">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{p.name}</p>
                      <div className="mt-1 h-1 rounded-full bg-[rgba(212,175,55,0.1)] overflow-hidden">
                        <div className="h-full bg-[#D4AF37] rounded-full"
                          style={{ width: `${Math.min(100, (p.sold / (stats.topProducts[0]?.sold ?? 1)) * 100)}%` }} />
                      </div>
                    </div>
                    <p className="text-xs text-[#D4AF37] font-semibold">{p.sold} sold</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Fallback if API has no detail */}
          {!stats?.dailyRevenue && !stats?.topProducts && (
            <div className="text-center py-16 text-[#B8B8B8]">
              <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Detailed analytics data not yet available.</p>
              <p className="text-xs mt-1">Stats will appear once you have orders.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
