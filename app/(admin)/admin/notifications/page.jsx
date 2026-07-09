"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Bell, CheckCheck, Trash2, Package, ShoppingCart, Users, AlertTriangle, Info } from "lucide-react";

const TYPE_CONFIG = {
  order     : { icon: ShoppingCart, color: "text-blue-400",   bg: "bg-blue-400/10" },
  stock     : { icon: Package,      color: "text-amber-400",  bg: "bg-amber-400/10" },
  user      : { icon: Users,        color: "text-green-400",  bg: "bg-green-400/10" },
  alert     : { icon: AlertTriangle,color: "text-red-400",    bg: "bg-red-400/10" },
  info      : { icon: Info,         color: "text-[#D4AF37]",  bg: "bg-[rgba(212,175,55,0.1)]" },
};

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading]             = useState(true);
  const [filter, setFilter]               = useState("all");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/admin/notifications?limit=50");
      const d = await r.json();
      setNotifications(d.notifications ?? d ?? []);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleMarkRead = async (id) => {
    await fetch(`/api/admin/notifications/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isRead: true }) });
    setNotifications((prev) => prev.map((n) => n._id === id ? { ...n, isRead: true } : n));
  };

  const handleMarkAllRead = async () => {
    await fetch("/api/admin/notifications/mark-all-read", { method: "PUT" });
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleDelete = async (id) => {
    await fetch(`/api/admin/notifications/${id}`, { method: "DELETE" });
    setNotifications((prev) => prev.filter((n) => n._id !== id));
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const filtered = notifications.filter((n) =>
    filter === "all" ? true : filter === "unread" ? !n.isRead : n.type === filter
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl text-white flex items-center gap-3">
            Notifications
            {unreadCount > 0 && (
              <span className="text-sm font-normal px-2 py-0.5 rounded-full bg-[rgba(212,175,55,0.15)] text-[#D4AF37]">{unreadCount} unread</span>
            )}
          </h1>
        </div>
        {unreadCount > 0 && (
          <button onClick={handleMarkAllRead} className="flex items-center gap-1.5 text-sm text-[#D4AF37] hover:underline">
            <CheckCheck className="w-4 h-4" /> Mark all read
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { key: "all",    label: "All" },
          { key: "unread", label: "Unread" },
          { key: "order",  label: "Orders" },
          { key: "stock",  label: "Stock" },
          { key: "user",   label: "Users" },
          { key: "alert",  label: "Alerts" },
        ].map(({ key, label }) => (
          <button key={key} onClick={() => setFilter(key)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${filter === key ? "bg-[rgba(212,175,55,0.15)] text-[#D4AF37] border border-[rgba(212,175,55,0.2)]" : "text-[#B8B8B8] border border-[rgba(212,175,55,0.08)] hover:text-white hover:bg-white/5"}`}>
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-2">{[...Array(6)].map((_, i) => <div key={i} className="h-20 rounded-xl bg-white/[0.03] animate-pulse" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <Bell className="w-14 h-14 mx-auto text-[#B8B8B8]/20 mb-4" />
          <p className="text-[#B8B8B8]">No notifications</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((n, i) => {
            const cfg = TYPE_CONFIG[n.type] ?? TYPE_CONFIG.info;
            const Icon = cfg.icon;
            return (
              <motion.div key={n._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                className={`flex items-start gap-4 p-4 rounded-2xl border transition-colors ${n.isRead ? "border-[rgba(212,175,55,0.06)] bg-white/[0.01]" : "border-[rgba(212,175,55,0.15)] bg-[rgba(212,175,55,0.03)]"}`}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.bg}`}>
                  <Icon className={`w-4 h-4 ${cfg.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-medium ${n.isRead ? "text-[#B8B8B8]" : "text-white"}`}>{n.title ?? "Notification"}</p>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {!n.isRead && (
                        <button onClick={() => handleMarkRead(n._id)} className="p-1 text-[#D4AF37] hover:bg-[rgba(212,175,55,0.1)] rounded-lg transition-colors" title="Mark as read">
                          <CheckCheck className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button onClick={() => handleDelete(n._id)} className="p-1 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors" title="Delete">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-[#B8B8B8] mt-0.5 line-clamp-2">{n.message ?? n.body}</p>
                  <p className="text-[10px] text-[#B8B8B8]/40 mt-1.5">{new Date(n.createdAt).toLocaleString("en-IN")}</p>
                </div>
                {!n.isRead && <div className="w-2 h-2 rounded-full bg-[#D4AF37] mt-1 flex-shrink-0" />}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
