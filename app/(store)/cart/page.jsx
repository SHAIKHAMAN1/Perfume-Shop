"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, Minus, Tag, ArrowRight, ShoppingBag } from "lucide-react";
import useCartStore from "@/store/useCartStore";
import useUIStore from "@/store/useUIStore";
import { useAuth } from "@/contexts/AuthContext";
import GoldButton from "@/components/ui/GoldButton";
import SectionTitle from "@/components/ui/SectionTitle";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getSubtotal, couponCode, couponDiscount, setCoupon, clearCoupon } = useCartStore();
  const addToast = useUIStore((s) => s.addToast);
  const { user }  = useAuth();
  const router    = useRouter();
  const [couponInput, setCouponInput] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);

  const subtotal = getSubtotal();
  const shipping  = subtotal >= 1999 ? 0 : 149;
  const discount  = couponDiscount ?? 0;
  const total     = subtotal - discount + shipping;

  const applyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    try {
      const res  = await fetch(`/api/coupons/validate`, {
        method : "POST",
        headers: { "Content-Type": "application/json" },
        body   : JSON.stringify({ code: couponInput.trim().toUpperCase(), subtotal }),
      });
      const data = await res.json();
      if (res.ok) {
        setCoupon(couponInput.trim().toUpperCase(), data.discount);
        addToast({ type: "success", message: `Coupon applied! You saved ₹${data.discount}` });
      } else {
        addToast({ type: "error", message: data.error || "Invalid coupon code" });
      }
    } catch {
      addToast({ type: "error", message: "Failed to validate coupon" });
    } finally {
      setCouponLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="text-7xl mb-6">🛍️</div>
          <h1 className="font-serif text-3xl text-white mb-3">Your cart is empty</h1>
          <p className="text-[#B8B8B8] mb-8">Add some luxury fragrances to get started.</p>
          <Link href="/shop"><GoldButton size="lg">Browse Collection</GoldButton></Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <p className="text-[10px] tracking-[0.4em] text-[#D4AF37] uppercase font-semibold mb-1">Shopping</p>
        <h1 className="font-serif text-3xl sm:text-4xl text-white">Your Cart</h1>
        <p className="text-sm text-[#B8B8B8] mt-1">{items.reduce((s, i) => s + i.quantity, 0)} items</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ── Cart Items ── */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={`${item._id}-${item.volume}`}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                className="luxury-card p-4 sm:p-5"
              >
                <div className="flex gap-4">
                  {/* Image */}
                  <div className="relative w-20 h-24 sm:w-24 sm:h-28 rounded-xl overflow-hidden flex-shrink-0 bg-[#1A1A1A]">
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-3xl opacity-20">🌸</div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-[#D4AF37] font-semibold tracking-widest mb-0.5">{item.brand}</p>
                    <p className="text-sm sm:text-base text-white font-medium leading-snug">{item.name}</p>
                    {item.volume && (
                      <p className="text-xs text-[#B8B8B8] mt-0.5">{item.volume}</p>
                    )}

                    <div className="flex items-center justify-between mt-3 flex-wrap gap-3">
                      {/* Quantity */}
                      <div className="flex items-center bg-white/[0.04] border border-[rgba(212,175,55,0.1)] rounded-xl overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item._id, item.volume, item.quantity - 1)}
                          className="px-3 py-2 text-[#B8B8B8] hover:text-white transition-colors hover:bg-white/5"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-4 py-2 text-white text-sm font-medium w-10 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item._id, item.volume, item.quantity + 1)}
                          className="px-3 py-2 text-[#B8B8B8] hover:text-white transition-colors hover:bg-white/5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Price + Remove */}
                      <div className="flex items-center gap-4">
                        <span className="font-semibold text-white text-sm sm:text-base">
                          ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                        </span>
                        <button
                          onClick={() => { removeItem(item._id, item.volume); addToast({ type: "info", message: "Item removed from cart" }); }}
                          className="text-[#B8B8B8]/50 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Continue shopping */}
          <Link href="/shop" className="flex items-center gap-2 text-sm text-[#B8B8B8] hover:text-[#D4AF37] transition-colors mt-2">
            <ShoppingBag className="w-4 h-4" />
            Continue Shopping
          </Link>
        </div>

        {/* ── Order Summary ── */}
        <div className="space-y-4">
          <div className="luxury-card p-5 sm:p-6 space-y-5 sticky top-24">
            <h2 className="font-serif text-lg text-white">Order Summary</h2>

            {/* Coupon */}
            <div className="space-y-2">
              <p className="text-xs text-[#D4AF37] font-semibold uppercase tracking-widest">Coupon Code</p>
              {couponCode ? (
                <div className="flex items-center justify-between px-3 py-2.5 bg-[rgba(212,175,55,0.06)] border border-[rgba(212,175,55,0.2)] rounded-xl">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-[#D4AF37]" />
                    <span className="text-sm text-[#D4AF37] font-semibold">{couponCode}</span>
                  </div>
                  <button onClick={clearCoupon} className="text-xs text-[#B8B8B8] hover:text-white">Remove</button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
                    placeholder="Enter code"
                    className="flex-1 px-3 py-2.5 bg-[rgba(255,255,255,0.04)] border border-[rgba(212,175,55,0.12)] text-white placeholder:text-[#B8B8B8]/50 text-sm rounded-xl focus:outline-none focus:border-[rgba(212,175,55,0.3)]"
                  />
                  <button
                    onClick={applyCoupon}
                    disabled={couponLoading || !couponInput}
                    className="px-4 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#A8891C] text-black text-sm font-semibold rounded-xl hover:opacity-90 disabled:opacity-50 transition-all"
                  >
                    {couponLoading ? "..." : "Apply"}
                  </button>
                </div>
              )}
            </div>

            {/* Breakdown */}
            <div className="space-y-3 text-sm border-t border-[rgba(212,175,55,0.08)] pt-4">
              <div className="flex justify-between text-[#B8B8B8]">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Coupon discount</span>
                  <span>-₹{discount.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between text-[#B8B8B8]">
                <span>Shipping</span>
                <span className={shipping === 0 ? "text-green-400 font-medium" : ""}>
                  {shipping === 0 ? "FREE" : `₹${shipping}`}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-[10px] text-[#B8B8B8]/50">
                  Add ₹{(1999 - subtotal).toLocaleString("en-IN")} more for free shipping
                </p>
              )}
              <div className="flex justify-between text-white font-semibold text-base border-t border-[rgba(212,175,55,0.1)] pt-3 mt-1">
                <span>Total</span>
                <span className="text-gradient-gold text-lg">₹{total.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={() => router.push(user ? "/checkout" : "/login?redirect=/checkout")}
              className="block w-full"
            >
              <GoldButton className="w-full gap-2">
                Checkout <ArrowRight className="w-4 h-4" />
              </GoldButton>
            </button>

            {/* Secure badge */}
            <p className="text-[10px] text-[#B8B8B8]/50 text-center">
              🔒 Secured by Razorpay · 100% Authentic
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
