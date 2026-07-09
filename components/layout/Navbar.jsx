"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, ShoppingBag, Heart, User, Menu, X, ChevronDown,
  LogOut, Settings, Package, LayoutDashboard,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import useCartStore from "@/store/useCartStore";
import useWishlistStore from "@/store/useWishlistStore";
import useUIStore from "@/store/useUIStore";

/* ── Mega-menu data ────────────────────────────────────────── */
const navLinks = [
  { label: "Home",        href: "/" },
  {
    label: "Shop",
    href: "/shop",
    mega: {
      collections: [
        { label: "Men",       href: "/shop?gender=Men",    icon: "👔" },
        { label: "Women",     href: "/shop?gender=Women",  icon: "👗" },
        { label: "Unisex",    href: "/shop?gender=Unisex", icon: "✨" },
        { label: "Arabic",    href: "/shop?category=arabic", icon: "🌙" },
        { label: "French",    href: "/shop?category=french", icon: "🗼" },
      ],
      featured: [
        { label: "Best Sellers", href: "/shop?sort=best-selling" },
        { label: "New Arrivals", href: "/shop?sort=newest" },
        { label: "On Sale",      href: "/shop?discount=true" },
        { label: "Luxury Picks", href: "/shop?featured=true" },
      ],
    },
  },
  { label: "Brands",  href: "/brands" },
  { label: "About",   href: "/about" },
  { label: "Contact", href: "/contact" },
];

/* ── Animation variants ────────────────────────────────────── */
const megaVariants = {
  hidden : { opacity: 0, y: -6, scale: 0.98 },
  visible: { opacity: 1, y: 0,  scale: 1, transition: { duration: 0.2, ease: "easeOut" } },
  exit   : { opacity: 0, y: -4, scale: 0.97, transition: { duration: 0.15 } },
};
const drawerVariants = {
  hidden : { x: "-100%", opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { type: "spring", damping: 28, stiffness: 260 } },
  exit   : { x: "-100%", opacity: 0, transition: { duration: 0.25 } },
};

export default function Navbar() {
  const pathname  = usePathname();
  const router    = useRouter();
  const { user, role, signOut, isAdmin, isSuperAdmin } = useAuth();
  const cartCount = useCartStore((s) => s.count);
  const wishlist  = useWishlistStore((s) => s.items);
  const { openSearch, openCart, mobileMenuOpen, openMobileMenu, closeMobileMenu } = useUIStore();

  const [scrolled,   setScrolled]   = useState(false);
  const [activeMega, setActiveMega] = useState(null);
  const [userMenu,   setUserMenu]   = useState(false);
  const megaRef = useRef(null);
  const userRef = useRef(null);

  // Track scroll for glass effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setActiveMega(null);
    setUserMenu(false);
    closeMobileMenu();
  }, [pathname, closeMobileMenu]);

  // Close menus on outside click
  useEffect(() => {
    const handler = (e) => {
      if (megaRef.current && !megaRef.current.contains(e.target)) setActiveMega(null);
      if (userRef.current  && !userRef.current.contains(e.target))  setUserMenu(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSignOut = async () => {
    setUserMenu(false);
    await signOut();
    router.push("/login");
  };

  return (
    <>
      {/* ── Main Navbar ──────────────────────────────────── */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0,   opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "glass-dark border-b border-[rgba(212,175,55,0.12)] shadow-[0_4px_30px_rgba(0,0,0,0.4)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">

            {/* ── Logo ── */}
            <Link href="/" className="flex-shrink-0 group">
              <motion.div
                className="flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#A8891C] flex items-center justify-center shadow-lg">
                  <span className="text-black text-xs font-bold">✦</span>
                </div>
                <span className="font-serif text-xl lg:text-2xl text-white tracking-[0.15em] group-hover:text-[#D4AF37] transition-colors">
                  LUXEURE
                </span>
              </motion.div>
            </Link>

            {/* ── Desktop Navigation ── */}
            <nav className="hidden lg:flex items-center gap-1" ref={megaRef}>
              {navLinks.map((link) => (
                <div key={link.label} className="relative">
                  <button
                    className={`flex items-center gap-1 px-4 py-2 text-sm font-medium tracking-wide transition-colors rounded-md ${
                      pathname === link.href
                        ? "text-[#D4AF37]"
                        : "text-[#B8B8B8] hover:text-white"
                    }`}
                    onMouseEnter={() => link.mega ? setActiveMega(link.label) : setActiveMega(null)}
                    onClick={() => !link.mega && router.push(link.href)}
                  >
                    {link.label}
                    {link.mega && (
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform ${activeMega === link.label ? "rotate-180 text-[#D4AF37]" : ""}`}
                      />
                    )}
                  </button>

                  {/* Animated underline */}
                  {pathname === link.href && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-[#D4AF37] to-[#A8891C]"
                    />
                  )}

                  {/* Mega menu */}
                  <AnimatePresence>
                    {link.mega && activeMega === link.label && (
                      <motion.div
                        variants={megaVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[460px] glass-dark rounded-2xl p-6 shadow-2xl"
                        onMouseLeave={() => setActiveMega(null)}
                      >
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <p className="text-xs font-semibold tracking-widest text-[#D4AF37] uppercase mb-3">
                              Collections
                            </p>
                            <ul className="space-y-1.5">
                              {link.mega.collections.map((c) => (
                                <li key={c.label}>
                                  <Link
                                    href={c.href}
                                    className="flex items-center gap-2.5 text-sm text-[#B8B8B8] hover:text-white hover:translate-x-1 transition-all py-1"
                                  >
                                    <span>{c.icon}</span>
                                    {c.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-xs font-semibold tracking-widest text-[#D4AF37] uppercase mb-3">
                              Discover
                            </p>
                            <ul className="space-y-1.5">
                              {link.mega.featured.map((f) => (
                                <li key={f.label}>
                                  <Link
                                    href={f.href}
                                    className="text-sm text-[#B8B8B8] hover:text-white hover:translate-x-1 transition-all block py-1"
                                  >
                                    {f.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-[rgba(212,175,55,0.1)]">
                          <Link
                            href="/shop"
                            className="flex items-center justify-center w-full py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#A8891C] text-black text-sm font-semibold tracking-wide hover:opacity-90 transition-opacity"
                          >
                            View All Products →
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>

            {/* ── Right Icons ── */}
            <div className="flex items-center gap-1 sm:gap-2">

              {/* Admin Dashboard button — only for admin / superAdmin */}
              {isAdmin && (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push("/admin")}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide bg-gradient-to-r from-[#D4AF37] to-[#A8891C] text-black hover:opacity-90 transition-opacity"
                  aria-label="Admin Dashboard"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  {isSuperAdmin ? "Super Admin" : "Admin"}
                </motion.button>
              )}

              {/* Search */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={openSearch}
                className="p-2 text-[#B8B8B8] hover:text-white transition-colors rounded-full hover:bg-white/5"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </motion.button>

              {/* Wishlist */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => router.push("/wishlist")}
                className="relative p-2 text-[#B8B8B8] hover:text-white transition-colors rounded-full hover:bg-white/5"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#D4AF37] text-black text-[9px] font-bold rounded-full flex items-center justify-center"
                  >
                    {wishlist.length > 9 ? "9+" : wishlist.length}
                  </motion.span>
                )}
              </motion.button>

              {/* Cart */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={openCart}
                className="relative p-2 text-[#B8B8B8] hover:text-white transition-colors rounded-full hover:bg-white/5"
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#D4AF37] text-black text-[9px] font-bold rounded-full flex items-center justify-center"
                  >
                    {cartCount > 9 ? "9+" : cartCount}
                  </motion.span>
                )}
              </motion.button>

              {/* User */}
              <div className="relative" ref={userRef}>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setUserMenu((v) => !v)}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-white/5 transition-colors"
                  aria-label="User menu"
                >
                  {user?.photoURL ? (
                    <Image
                      src={user.photoURL}
                      alt={user.displayName ?? "User"}
                      width={28}
                      height={28}
                      className="rounded-full ring-1 ring-[#D4AF37]/40"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#A8891C] flex items-center justify-center">
                      <User className="w-4 h-4 text-black" />
                    </div>
                  )}
                </motion.button>

                <AnimatePresence>
                  {userMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0,  scale: 1 }}
                      exit  ={{ opacity: 0, y: -6,  scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-52 glass-dark rounded-2xl p-2 shadow-2xl border border-[rgba(212,175,55,0.12)]"
                    >
                      {user ? (
                        <>
                          <div className="px-3 py-2 border-b border-[rgba(212,175,55,0.1)] mb-1">
                            <p className="text-sm font-medium text-white truncate">{user.displayName}</p>
                            <p className="text-xs text-[#B8B8B8] truncate">{user.email}</p>
                          </div>
                          {isAdmin && (
                            <Link href="/admin" className="flex items-center gap-2 px-3 py-2 text-sm text-[#D4AF37] hover:bg-white/5 rounded-xl transition-colors">
                              <LayoutDashboard className="w-4 h-4" /> Admin Panel
                            </Link>
                          )}
                          <Link href="/account" className="flex items-center gap-2 px-3 py-2 text-sm text-[#B8B8B8] hover:text-white hover:bg-white/5 rounded-xl transition-colors">
                            <User className="w-4 h-4" /> My Account
                          </Link>
                          <Link href="/account/orders" className="flex items-center gap-2 px-3 py-2 text-sm text-[#B8B8B8] hover:text-white hover:bg-white/5 rounded-xl transition-colors">
                            <Package className="w-4 h-4" /> My Orders
                          </Link>
                          <Link href="/account/settings" className="flex items-center gap-2 px-3 py-2 text-sm text-[#B8B8B8] hover:text-white hover:bg-white/5 rounded-xl transition-colors">
                            <Settings className="w-4 h-4" /> Settings
                          </Link>
                          <button
                            onClick={handleSignOut}
                            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                          >
                            <LogOut className="w-4 h-4" /> Sign Out
                          </button>
                        </>
                      ) : (
                        <>
                          <Link href="/login" className="flex items-center gap-2 px-3 py-2 text-sm text-white hover:bg-white/5 rounded-xl transition-colors">
                            Sign In
                          </Link>
                          <Link
                            href="/login?tab=signup"
                            className="flex items-center justify-center gap-2 mx-2 mt-1 px-3 py-2 text-sm font-medium bg-gradient-to-r from-[#D4AF37] to-[#A8891C] text-black rounded-xl hover:opacity-90 transition-opacity"
                          >
                            Create Account
                          </Link>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile menu toggle */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={openMobileMenu}
                className="lg:hidden p-2 text-[#B8B8B8] hover:text-white transition-colors rounded-full hover:bg-white/5"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </motion.button>
            </div>

          </div>
        </div>
      </motion.header>

      {/* ── Mobile Drawer ───────────────────────────────────── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
              onClick={closeMobileMenu}
            />
            {/* Drawer */}
            <motion.div
              variants={drawerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed top-0 left-0 bottom-0 z-50 w-80 glass-dark border-r border-[rgba(212,175,55,0.1)] flex flex-col overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-[rgba(212,175,55,0.1)]">
                <Link href="/" onClick={closeMobileMenu} className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#A8891C] flex items-center justify-center">
                    <span className="text-black text-xs font-bold">✦</span>
                  </div>
                  <span className="font-serif text-lg text-white tracking-[0.12em]">LUXEURE</span>
                </Link>
                <button onClick={closeMobileMenu} className="p-1.5 text-[#B8B8B8] hover:text-white rounded-full hover:bg-white/5">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Nav links */}
              <nav className="p-4 flex-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={closeMobileMenu}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-1 text-sm font-medium transition-colors ${
                        pathname === link.href
                          ? "bg-[rgba(212,175,55,0.1)] text-[#D4AF37]"
                          : "text-[#B8B8B8] hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {link.label}
                    </Link>
                    {link.mega && (
                      <div className="ml-4 mb-2 space-y-0.5">
                        {link.mega.collections.map((c) => (
                          <Link
                            key={c.label}
                            href={c.href}
                            onClick={closeMobileMenu}
                            className="flex items-center gap-2 px-4 py-1.5 text-xs text-[#B8B8B8]/70 hover:text-white transition-colors"
                          >
                            <span>{c.icon}</span>{c.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </nav>

              {/* Bottom auth */}
              <div className="p-4 border-t border-[rgba(212,175,55,0.1)]">
                {user ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 px-2 py-1">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#A8891C] flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-black" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white truncate">{user.displayName}</p>
                        <p className="text-xs text-[#B8B8B8] truncate">{user.email}</p>
                      </div>
                    </div>
                    {/* Admin Dashboard shortcut in mobile drawer */}
                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={closeMobileMenu}
                        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#A8891C] text-black text-sm font-semibold hover:opacity-90 transition-opacity"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        {isSuperAdmin ? "Super Admin Panel" : "Admin Dashboard"}
                      </Link>
                    )}
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-500/30 text-red-400 text-sm hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      href="/login"
                      onClick={closeMobileMenu}
                      className="block w-full text-center py-2.5 rounded-xl border border-[rgba(212,175,55,0.2)] text-white text-sm hover:bg-white/5 transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/login?tab=signup"
                      onClick={closeMobileMenu}
                      className="block w-full text-center py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#A8891C] text-black text-sm font-semibold hover:opacity-90 transition-opacity"
                    >
                      Create Account
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
