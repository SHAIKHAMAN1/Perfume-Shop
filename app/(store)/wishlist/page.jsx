"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import useWishlistStore from "@/store/useWishlistStore";
import useCartStore from "@/store/useCartStore";
import useUIStore from "@/store/useUIStore";
import GoldButton from "@/components/ui/GoldButton";
import SectionTitle from "@/components/ui/SectionTitle";

export default function WishlistPage() {
  const { items: wishedItems, toggle } = useWishlistStore();
  const addItem  = useCartStore((s) => s.addItem);
  const { addToast, openCart } = useUIStore();

  const moveToCart = (product) => {
    addItem(product);
    addToast({ type: "success", message: `${product.name} added to cart` });
    openCart();
  };

  if (wishedItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="text-7xl mb-6">❤️</div>
          <h1 className="font-serif text-3xl text-white mb-3">Your wishlist is empty</h1>
          <p className="text-[#B8B8B8] mb-8">Save your favourite fragrances here.</p>
          <Link href="/shop"><GoldButton size="lg">Discover Fragrances</GoldButton></Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <p className="text-[10px] tracking-[0.4em] text-[#D4AF37] uppercase font-semibold mb-1">Your Wishlist</p>
        <h1 className="font-serif text-3xl sm:text-4xl text-white">Saved Fragrances</h1>
        <p className="text-sm text-[#B8B8B8] mt-1">{wishedItems.length} items</p>
      </div>

      <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
        <AnimatePresence>
          {wishedItems.map((item, i) => (
            <motion.div
              key={item._id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              transition={{ delay: i * 0.05 }}
              className="luxury-card overflow-hidden group"
            >
              <Link href={`/product/${item.slug}`}>
                <div className="relative aspect-[3/4] bg-[#1A1A1A]">
                  {item.image ? (
                    <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-5xl opacity-15">🌸</div>
                  )}
                  {/* Remove from wishlist */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggle(item._id);
                      addToast({ type: "info", message: "Removed from wishlist" });
                    }}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center glass border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </Link>

              <div className="p-4 space-y-2">
                {item.brand && (
                  <p className="text-[10px] text-[#D4AF37] font-semibold tracking-widest">{item.brand}</p>
                )}
                <Link href={`/product/${item.slug}`}>
                  <p className="text-sm text-white font-medium leading-snug hover:text-[#D4AF37] transition-colors line-clamp-2">{item.name}</p>
                </Link>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-white">₹{(item.price ?? 0).toLocaleString("en-IN")}</p>
                  <button
                    onClick={() => moveToCart(item)}
                    className="p-2 rounded-xl bg-[rgba(212,175,55,0.08)] border border-[rgba(212,175,55,0.2)] text-[#D4AF37] hover:bg-[rgba(212,175,55,0.15)] transition-all"
                    aria-label="Add to cart"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Add all to cart */}
      <div className="mt-10 flex justify-center">
        <GoldButton
          onClick={() => {
            wishedItems.forEach((p) => addItem(p));
            addToast({ type: "success", message: `${wishedItems.length} items added to cart!` });
            openCart();
          }}
          size="lg"
        >
          <ShoppingBag className="w-5 h-5" />
          Add All to Cart
        </GoldButton>
      </div>
    </div>
  );
}
