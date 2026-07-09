"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { X, ShoppingBag, Trash2, Plus, Minus } from "lucide-react";
import useCartStore from "@/store/useCartStore";
import useUIStore from "@/store/useUIStore";
import { useAuth } from "@/contexts/AuthContext";
import GoldButton from "@/components/ui/GoldButton";

export default function CartDrawer() {
  const { cartOpen, closeCart } = useUIStore();
  const { items, count, removeItem, updateQuantity, getSubtotal, couponDiscount } = useCartStore();
  const { user } = useAuth();
  const router   = useRouter();

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = cartOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [cartOpen]);

  const subtotal = getSubtotal();
  const shipping = subtotal >= 1999 ? 0 : 149;
  const discount = couponDiscount ?? 0;
  const total    = subtotal - discount + shipping;

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            key="cart-drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md flex flex-col glass-dark border-l border-[rgba(212,175,55,0.12)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[rgba(212,175,55,0.1)]">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
                <h2 className="font-serif text-lg text-white">Your Cart</h2>
                {count > 0 && (
                  <span className="text-xs bg-[#D4AF37] text-black px-2 py-0.5 rounded-full font-semibold">
                    {count}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="p-1.5 text-[#B8B8B8] hover:text-white rounded-full hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto py-4 px-5 space-y-4">
              <AnimatePresence>
                {items.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-full gap-4 py-20 text-center"
                  >
                    <div className="text-6xl">🛍️</div>
                    <p className="font-serif text-lg text-white">Your cart is empty</p>
                    <p className="text-sm text-[#B8B8B8]">Add some luxury fragrances to get started</p>
                    <Link href="/shop" onClick={closeCart}>
                      <GoldButton size="sm">Browse Collection</GoldButton>
                    </Link>
                  </motion.div>
                ) : (
                  items.map((item) => (
                    <motion.div
                      key={`${item._id}-${item.volume}`}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
                      className="flex gap-3 p-3 rounded-xl bg-white/[0.03] border border-[rgba(212,175,55,0.08)]"
                    >
                      {/* Image */}
                      <div className="relative w-16 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-[#1A1A1A]">
                        {item.image ? (
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-2xl opacity-30">🌸</div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-[#D4AF37] font-semibold tracking-widest mb-0.5">{item.brand}</p>
                        <p className="text-sm text-white font-medium leading-tight line-clamp-2">{item.name}</p>
                        {item.volume && (
                          <p className="text-[10px] text-[#B8B8B8] mt-0.5">{item.volume}</p>
                        )}
                        <div className="flex items-center justify-between mt-2">
                          {/* Quantity controls */}
                          <div className="flex items-center gap-1.5 bg-white/5 rounded-lg px-1">
                            <button
                              onClick={() => updateQuantity(item._id, item.volume, item.quantity - 1)}
                              className="p-1 text-[#B8B8B8] hover:text-white transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-sm text-white w-5 text-center font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item._id, item.volume, item.quantity + 1)}
                              className="p-1 text-[#B8B8B8] hover:text-white transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <p className="text-sm font-semibold text-white">
                            ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeItem(item._id, item.volume)}
                        className="p-1.5 text-[#B8B8B8]/50 hover:text-red-400 transition-colors self-start"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Footer: totals + checkout */}
            {items.length > 0 && (
              <div className="border-t border-[rgba(212,175,55,0.1)] px-5 py-5 space-y-4">
                {/* Totals */}
                <div className="space-y-2 text-sm">
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
                    <span className={shipping === 0 ? "text-green-400" : ""}>
                      {shipping === 0 ? "FREE" : `₹${shipping}`}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-[10px] text-[#B8B8B8]/60">
                      Add ₹{(1999 - subtotal).toLocaleString("en-IN")} more for free shipping
                    </p>
                  )}
                  <div className="flex justify-between text-white font-semibold text-base pt-2 border-t border-[rgba(212,175,55,0.1)]">
                    <span>Total</span>
                    <span className="text-gradient-gold">₹{total.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                {/* CTA buttons */}
                <div
                  onClick={() => {
                    closeCart();
                    if (user) {
                      router.push("/checkout");
                    } else {
                      router.push("/login?redirect=/checkout");
                    }
                  }}
                  className="block w-full cursor-pointer"
                >
                  <GoldButton className="w-full">Proceed to Checkout</GoldButton>
                </div>
                <Link href="/cart" onClick={closeCart} className="block">
                  <GoldButton variant="outline" className="w-full">View Full Cart</GoldButton>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
