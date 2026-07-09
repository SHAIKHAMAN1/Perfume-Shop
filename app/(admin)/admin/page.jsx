"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp, TrendingDown, ShoppingCart, Package,
  Users, IndianRupee, AlertTriangle, Clock,
} from "lucide-react";
import Link from "next/link";

/* ── Mini bar chart ─────────────────────────────────────────── */
function MiniBarChart({ data }) {
  const max = Math.max(...data.map((d) => d.revenue), 1);
  return (
    <div className="flex items-end gap-1 h-16 mt-4">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
          <div className="w-full relative">
            <div
              className="w-full rounded-sm bg-[#D4AF37]/20 group-hover:bg-[#D4AF37]/40 transition-colors"
              style={{ height: `${Math.max(4, (d.revenue / max) * 52)}px` }}
            />
          </div>
          <p className="text-[8px] text-[#B8B8B8]/50 rotate-0 whitespace-nowrap truncate w-full text-center">
            {d.date.split(" ")[0]}
          </p>
        </div>
      ))}
    </div>
  );
}

/* ── Stat card ─────────────────────────────────────────────── */
function StatCard({ title, value, sub, icon: Icon, color, growth, delay = 0 }) {
  const isPositive = growth >= 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="luxury-card p-5"
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs text-[#B8B8B8] font-medium">{title}</p>
        <div className={`p-2 rounded-xl ${color}`}>
          <Icon className="w-4 h-4 text-[#D4AF37]" />
        </div>
      </div>
      <p className="font-serif text-2xl text-white mb-1">{value}</p>
      {sub && <p className="text-xs text-[#B8B8B8]">{sub}</p>}
      {growth !== undefined && (
        <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${isPositive ? "text-green-400" : "text-red-400"}`}>
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {Math.abs(growth)}% vs last month
        </div>
      )}
    </motion.div>
  );
}

/* ── Status badge ───────────────────────────────────────────── */
const STATUS_COLORS = {
  pending  : "bg-yellow-500/10 text-yellow-400",
  confirmed: "bg-blue-500/10 text-blue-400",
  packed   : "bg-purple-500/10 text-purple-400",
  shipped  : "bg-orange-500/10 text-orange-400",
  delivered: "bg-green-500/10 text-green-400",
  cancelled: "bg-red-500/10 text-red-400",
};

export default function AdminDashboard() {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-28 skeleton rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const { stats, revenueChart, recentOrders } = data ?? {};

  const statCards = [
    {
      title: "Total Revenue",
      value: `₹${(stats?.totalRevenue ?? 0).toLocaleString("en-IN")}`,
      sub: `₹${(stats?.monthRevenue ?? 0).toLocaleString("en-IN")} this month`,
      icon: IndianRupee,
      color: "bg-[rgba(212,175,55,0.1)]",
      growth: stats?.revenueGrowth,
    },
    {
      title: "Total Orders",
      value: (stats?.totalOrders ?? 0).toLocaleString(),
      sub: `${stats?.monthOrders ?? 0} this month`,
      icon: ShoppingCart,
      color: "bg-blue-500/10",
    },
    {
      title: "Pending Orders",
      value: stats?.pendingOrders ?? 0,
      sub: "Awaiting processing",
      icon: Clock,
      color: "bg-yellow-500/10",
    },
    {
      title: "Total Customers",
      value: (stats?.totalCustomers ?? 0).toLocaleString(),
      sub: `+${stats?.newCustomersMonth ?? 0} this month`,
      icon: Users,
      color: "bg-green-500/10",
    },
    {
      title: "Active Products",
      value: stats?.totalProducts ?? 0,
      sub: "In catalogue",
      icon: Package,
      color: "bg-purple-500/10",
    },
    {
      title: "Low Stock",
      value: stats?.lowStockProducts ?? 0,
      sub: "Products ≤ 10 units",
      icon: AlertTriangle,
      color: "bg-red-500/10",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl text-white">Dashboard</h1>
        <p className="text-sm text-[#B8B8B8] mt-0.5">Welcome back. Here&apos;s what&apos;s happening today.</p>
      </div>

      {/* Stat grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((card, i) => (
          <div key={card.title} className={i < 2 ? "xl:col-span-2 lg:col-span-2" : ""}>
            <StatCard {...card} delay={i * 0.06} />
          </div>
        ))}
      </div>

      {/* Chart + Recent orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Revenue chart */}
        <div className="lg:col-span-2 luxury-card p-5">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-medium text-white text-sm">Revenue — Last 7 Days</h2>
            <p className="text-xs text-[#B8B8B8]">
              ₹{(revenueChart ?? []).reduce((s, d) => s + d.revenue, 0).toLocaleString("en-IN")}
            </p>
          </div>
          <MiniBarChart data={revenueChart ?? []} />
        </div>

        {/* Quick actions */}
        <div className="luxury-card p-5 space-y-3">
          <h2 className="font-medium text-white text-sm mb-4">Quick Actions</h2>
          {[
            { label: "Add Product",    href: "/admin/products/new",  emoji: "📦" },
            { label: "Manage Orders",  href: "/admin/orders",        emoji: "🛒" },
            { label: "Create Coupon",  href: "/admin/coupons",       emoji: "🏷️" },
            { label: "View Customers", href: "/admin/users",         emoji: "👥" },
          ].map(({ label, href, emoji }) => (
            <Link key={href} href={href}>
              <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-[rgba(212,175,55,0.12)] transition-all cursor-pointer group">
                <span className="text-xl">{emoji}</span>
                <span className="text-sm text-[#B8B8B8] group-hover:text-white transition-colors">{label}</span>
                <span className="ml-auto text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity text-xs">→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="luxury-card overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-[rgba(212,175,55,0.08)]">
          <h2 className="font-medium text-white text-sm">Recent Orders</h2>
          <Link href="/admin/orders" className="text-xs text-[#D4AF37] hover:underline">View all →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[rgba(212,175,55,0.06)]">
                {["Order #", "Customer", "Items", "Total", "Status", "Date"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] text-[#B8B8B8] uppercase tracking-widest font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(212,175,55,0.05)]">
              {(recentOrders ?? []).map((order) => (
                <tr key={order._id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/admin/orders/${order._id}`} className="font-mono text-xs text-[#D4AF37] hover:underline">
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#B8B8B8]">
                    {order.user?.name ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-xs text-[#B8B8B8]">
                    {order.items?.length ?? 0}
                  </td>
                  <td className="px-4 py-3 text-sm text-white font-medium">
                    ₹{order.total.toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] px-2 py-1 rounded-full font-medium ${STATUS_COLORS[order.status] ?? "bg-white/5 text-white"}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#B8B8B8]">
                    {new Date(order.createdAt).toLocaleDateString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!recentOrders?.length && (
            <p className="text-center py-10 text-sm text-[#B8B8B8]">No orders yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
