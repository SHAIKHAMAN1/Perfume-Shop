"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  User, Package, Heart, LogOut, MapPin,
  ChevronRight, ShoppingBag, Star,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import GoldButton from "@/components/ui/GoldButton";

const MENU = [
  { label: "My Orders",   href: "/account/orders",  icon: Package,  desc: "Track and manage your orders" },
  { label: "Wishlist",    href: "/wishlist",         icon: Heart,    desc: "Your saved fragrances" },
  { label: "Shop Now",    href: "/shop",             icon: ShoppingBag, desc: "Browse our full collection" },
];

export default function AccountPage() {
  const router      = useRouter();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* Profile header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="luxury-card p-6 mb-6"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#A8891C] flex items-center justify-center flex-shrink-0">
            {user?.photoURL ? (
              <img src={user.photoURL} alt={user.displayName} className="w-full h-full rounded-full object-cover" />
            ) : (
              <span className="text-black text-2xl font-bold">
                {user?.displayName?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? "?"}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-serif text-2xl text-white">{user?.displayName ?? "My Account"}</h1>
            <p className="text-sm text-[#B8B8B8] mt-0.5">{user?.email}</p>
            <div className="flex items-center gap-1.5 mt-1.5">
              <Star className="w-3 h-3 text-[#D4AF37]" />
              <span className="text-xs text-[#D4AF37]">Luxury Member</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Menu */}
      <div className="space-y-3">
        {MENU.map(({ label, href, icon: Icon, desc }, i) => (
          <motion.div
            key={href}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Link href={href}>
              <div className="luxury-card p-4 flex items-center gap-4 cursor-pointer group hover:border-[rgba(212,175,55,0.3)] transition-all">
                <div className="w-10 h-10 rounded-xl bg-[rgba(212,175,55,0.08)] flex items-center justify-center flex-shrink-0 group-hover:bg-[rgba(212,175,55,0.12)] transition-colors">
                  <Icon className="w-4.5 h-4.5 text-[#D4AF37]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white font-medium">{label}</p>
                  <p className="text-xs text-[#B8B8B8]">{desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-[#B8B8B8] group-hover:text-[#D4AF37] transition-colors" />
              </div>
            </Link>
          </motion.div>
        ))}

        {/* Sign out */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: MENU.length * 0.08 }}
        >
          <button
            onClick={handleSignOut}
            className="w-full luxury-card p-4 flex items-center gap-4 cursor-pointer group hover:border-red-500/20 transition-all text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0">
              <LogOut className="w-4.5 h-4.5 text-red-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-red-400 font-medium">Sign Out</p>
              <p className="text-xs text-[#B8B8B8]">Sign out of your account</p>
            </div>
          </button>
        </motion.div>
      </div>

      {/* Not signed in */}
      {!user && (
        <div className="luxury-card p-8 text-center mt-6">
          <User className="w-12 h-12 text-[#D4AF37] mx-auto mb-4 opacity-50" />
          <h2 className="font-serif text-xl text-white mb-2">You&apos;re not signed in</h2>
          <p className="text-sm text-[#B8B8B8] mb-5">Sign in to view your profile, orders, and wishlist.</p>
          <Link href="/login"><GoldButton>Sign In</GoldButton></Link>
        </div>
      )}
    </div>
  );
}
