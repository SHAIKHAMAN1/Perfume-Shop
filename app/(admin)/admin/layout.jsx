"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Package, Tag, Layers, ShoppingCart,
  Users, Star, Ticket, Image, Bell, Settings, BarChart3,
  FileText, LogOut, ChevronLeft, ChevronRight, Cpu,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { label: "Dashboard",  href: "/admin",               icon: LayoutDashboard },
  { label: "Products",   href: "/admin/products",       icon: Package },
  { label: "Categories", href: "/admin/categories",     icon: Layers },
  { label: "Brands",     href: "/admin/brands",         icon: Tag },
  { label: "Orders",     href: "/admin/orders",         icon: ShoppingCart },
  { label: "Customers",  href: "/admin/users",          icon: Users },
  { label: "Reviews",    href: "/admin/reviews",        icon: Star },
  { label: "Coupons",    href: "/admin/coupons",        icon: Ticket },
  { label: "Banners",    href: "/admin/banners",        icon: Image },
  { label: "Inventory",  href: "/admin/inventory",      icon: Cpu },
  { label: "Analytics",  href: "/admin/analytics",      icon: BarChart3 },
  { label: "Reports",    href: "/admin/reports",        icon: FileText },
  { label: "Notifications", href: "/admin/notifications", icon: Bell },
  { label: "Settings",   href: "/admin/settings",       icon: Settings },
];

export default function AdminLayout({ children }) {
  const pathname          = usePathname();
  const router            = useRouter();
  const { user, loading, isAdmin, isSuperAdmin, signOut } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  // Frontend guard: redirect non-admins as soon as auth resolves.
  // Server-side API routes are also independently protected via requireAdmin().
  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
    } else if (!isAdmin) {
      router.replace("/");
    }
  }, [user, loading, isAdmin, router]);

  // Render nothing while auth is pending or redirect is in-flight
  if (loading || !user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#090909]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-[rgba(212,175,55,0.15)] border-t-[#D4AF37] animate-spin" />
          <p className="text-sm text-[#B8B8B8]">Verifying permissions…</p>
        </div>
      </div>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-[#090909]">

      {/* ── Sidebar ── */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 256 }}
        transition={{ type: "spring", damping: 28, stiffness: 260 }}
        className="fixed top-0 left-0 bottom-0 z-40 flex flex-col overflow-hidden border-r border-[rgba(212,175,55,0.1)] bg-[#0F0F0F]"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-[rgba(212,175,55,0.08)]">
          <div className="w-8 h-8 flex-shrink-0 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#A8891C] flex items-center justify-center">
            <span className="text-black text-xs font-bold">✦</span>
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="font-serif text-lg text-white tracking-[0.12em] whitespace-nowrap"
              >
                LUXEURE
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Admin badge — always visible */}
        <div className={`border-b border-[rgba(212,175,55,0.08)] flex items-center ${collapsed ? "justify-center py-3" : "px-4 py-3 gap-2"}`}>
          {collapsed ? (
            <span title={isSuperAdmin ? "Super Admin" : "Admin"}
              className={`w-2 h-2 rounded-full ${isSuperAdmin ? "bg-[#D4AF37]" : "bg-[rgba(212,175,55,0.4)]"}`} />
          ) : (
            <>
              {isSuperAdmin && (
                <span className="w-2 h-2 rounded-full bg-[#D4AF37] flex-shrink-0" />
              )}
              <p className="text-xs tracking-widest text-[#D4AF37] uppercase font-semibold">
                {isSuperAdmin ? "Super Admin" : "Admin Panel"}
              </p>
            </>
          )}
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto py-4 space-y-0.5 px-2">
          {navItems.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href || (href !== "/admin" && pathname.startsWith(href));
            return (
              <Link key={href} href={href}>
                <motion.div
                  whileHover={{ x: 2 }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                    isActive
                      ? "bg-[rgba(212,175,55,0.12)] text-[#D4AF37]"
                      : "text-[#B8B8B8] hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-4.5 h-4.5 flex-shrink-0" strokeWidth={1.8} />
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-sm font-medium whitespace-nowrap"
                      >
                        {label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {isActive && (
                    <motion.div
                      layoutId="admin-active"
                      className="ml-auto w-1 h-4 rounded-full bg-[#D4AF37]"
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Bottom: user + signout */}
        <div className="border-t border-[rgba(212,175,55,0.08)] p-3 space-y-1">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#A8891C] flex items-center justify-center flex-shrink-0">
              <span className="text-black text-xs font-bold">
                {user?.displayName?.[0]?.toUpperCase() ?? "A"}
              </span>
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-xs font-medium text-white truncate">{user?.displayName}</p>
                <p className="text-[10px] text-[#B8B8B8] truncate">{user?.email}</p>
              </div>
            )}
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span className="text-sm">Sign Out</span>}
          </button>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 rounded-full bg-[#1A1A1A] border border-[rgba(212,175,55,0.2)] flex items-center justify-center text-[#D4AF37] hover:bg-[rgba(212,175,55,0.1)] transition-colors"
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </motion.aside>

      {/* ── Main content ── */}
      <div
        className="flex-1 flex flex-col min-h-screen transition-all duration-300"
        style={{ marginLeft: collapsed ? 72 : 256 }}
      >
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 flex items-center justify-between px-6 bg-[#090909]/80 backdrop-blur-md border-b border-[rgba(212,175,55,0.08)]">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-medium text-white capitalize">
                {navItems.find((n) => n.href === pathname)?.label ?? "Admin Panel"}
              </h1>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold tracking-widest uppercase ${
                isSuperAdmin
                  ? "bg-[rgba(212,175,55,0.15)] text-[#D4AF37]"
                  : "bg-white/5 text-[#B8B8B8]"
              }`}>
                {isSuperAdmin ? "Super Admin" : "Admin"}
              </span>
            </div>
            <p className="text-xs text-[#B8B8B8]">{new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs text-[#B8B8B8] hover:text-white transition-colors px-3 py-1.5 rounded-lg border border-[rgba(212,175,55,0.12)] hover:border-[rgba(212,175,55,0.3)]"
            >
              View Store →
            </Link>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
