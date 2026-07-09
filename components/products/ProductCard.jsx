"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Star, Eye } from "lucide-react";
import useCartStore from "@/store/useCartStore";
import useWishlistStore from "@/store/useWishlistStore";
import useUIStore from "@/store/useUIStore";

/**
 * Luxury product card — used in grid views, carousels, and related-products.
 * @param {{ product: object, index?: number }} props
 */
export default function ProductCard({ product, index = 0 }) {
  const [hovered, setHovered] = useState(false);
  const router       = useRouter();
  const addItem      = useCartStore((s) => s.addItem);
  const isWishlisted = useWishlistStore((s) => s.isWishlisted);
  const toggle       = useWishlistStore((s) => s.toggle);
  const addToast     = useUIStore((s) => s.addToast);
  const openCart     = useUIStore((s) => s.openCart);

  const wishlisted = isWishlisted(product._id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    addToast({
      type   : "success",
      message: `${product.name} added to cart`,
    });
    openCart();
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(product._id, product);
    addToast({
      type   : wishlisted ? "info" : "success",
      message: wishlisted ? "Removed from wishlist" : "Added to wishlist ❤️",
    });
  };

  const discount =
    product.salePrice && product.price > product.salePrice
      ? Math.round(((product.price - product.salePrice) / product.price) * 100)
      : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd  ={() => setHovered(false)}
      className="group"
    >
      <Link href={`/product/${product.slug}`} className="block">
        <div className="luxury-card overflow-hidden cursor-pointer">

          {/* ── Image section ── */}
          <div className="relative overflow-hidden bg-[#1A1A1A] aspect-[3/4]">
            {product.images?.[0] ? (
              <Image
                src={hovered && product.images?.[1] ? product.images[1] : product.images[0]}
                alt={product.name}
                fill
                className="object-cover transition-all duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            ) : (
              /* Elegant placeholder when no image */
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <div className="text-6xl opacity-20">🌸</div>
                <p className="text-xs text-[#B8B8B8]/40 tracking-widest uppercase">No Image</p>
              </div>
            )}

            {/* Overlay on hover */}
            <motion.div
              animate={{ opacity: hovered ? 1 : 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/40 flex items-center justify-center"
            >
              <motion.button
                initial={{ y: 12, opacity: 0 }}
                animate={{ y: hovered ? 0 : 12, opacity: hovered ? 1 : 0 }}
                transition={{ duration: 0.2, delay: 0.05 }}
                onClick={handleAddToCart}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#D4AF37] text-black text-xs font-semibold rounded-full hover:bg-[#F0D060] transition-colors"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                Add to Cart
              </motion.button>
            </motion.div>

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {product.isNewArrival && (
                <span className="bg-white text-black text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-full uppercase">
                  New
                </span>
              )}
              {discount > 0 && (
                <span className="bg-[#D4AF37] text-black text-[9px] font-bold px-2 py-0.5 rounded-full">
                  -{discount}%
                </span>
              )}
              {product.isBestSeller && (
                <span className="bg-black/70 text-[#D4AF37] text-[9px] font-semibold border border-[#D4AF37]/40 px-2 py-0.5 rounded-full tracking-wide">
                  Best Seller
                </span>
              )}
            </div>

            {/* Wishlist + Quick-view buttons */}
            <div className="absolute top-3 right-3 flex flex-col gap-2">
              <motion.button
                onClick={handleWishlist}
                whileTap={{ scale: 0.85 }}
                className={`w-8 h-8 rounded-full flex items-center justify-center glass border transition-all ${
                  wishlisted
                    ? "border-red-500/50 text-red-400"
                    : "border-[rgba(212,175,55,0.2)] text-[#B8B8B8] hover:text-red-400"
                }`}
                aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart className={`w-3.5 h-3.5 ${wishlisted ? "fill-current" : ""}`} />
              </motion.button>
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); router.push(`/product/${product.slug}`); }}
                className="w-8 h-8 rounded-full flex items-center justify-center glass border border-[rgba(212,175,55,0.2)] text-[#B8B8B8] hover:text-white transition-all"
                aria-label="Quick view"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Out of stock overlay */}
            {product.stock === 0 && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="text-xs font-medium text-white/70 tracking-widest uppercase">
                  Out of Stock
                </span>
              </div>
            )}
          </div>

          {/* ── Info section ── */}
          <div className="p-4">
            {/* Brand */}
            {product.brand?.name && (
              <p className="text-[10px] font-semibold tracking-widest text-[#D4AF37] uppercase mb-1">
                {product.brand.name}
              </p>
            )}

            {/* Name */}
            <h3 className="font-serif text-white text-sm leading-snug mb-2 group-hover:text-[#D4AF37] transition-colors line-clamp-2">
              {product.name}
            </h3>

            {/* Concentration + Gender badges */}
            <div className="flex items-center gap-1.5 mb-2 flex-wrap">
              {product.concentration && (
                <span className="text-[9px] text-[#B8B8B8] bg-white/5 border border-white/10 px-1.5 py-0.5 rounded">
                  {product.concentration}
                </span>
              )}
              {product.gender && (
                <span className="text-[9px] text-[#B8B8B8] bg-white/5 border border-white/10 px-1.5 py-0.5 rounded">
                  {product.gender}
                </span>
              )}
            </div>

            {/* Star rating */}
            {product.reviewCount > 0 && (
              <div className="flex items-center gap-1 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i < Math.round(product.rating)
                        ? "text-[#D4AF37] fill-[#D4AF37]"
                        : "text-white/20"
                    }`}
                  />
                ))}
                <span className="text-[10px] text-[#B8B8B8] ml-1">({product.reviewCount})</span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="font-semibold text-white">
                ₹{(product.salePrice ?? product.price).toLocaleString("en-IN")}
              </span>
              {discount > 0 && (
                <span className="text-[#B8B8B8] text-xs line-through">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
              )}
            </div>
          </div>

        </div>
      </Link>
    </motion.div>
  );
}
