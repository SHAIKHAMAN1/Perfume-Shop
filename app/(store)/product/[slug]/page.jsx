"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star, Heart, ShoppingBag, Share2, ShieldCheck,
  Truck, RotateCcw, ChevronLeft, Minus, Plus, Check,
} from "lucide-react";
import GoldButton from "@/components/ui/GoldButton";
import ProductCard from "@/components/products/ProductCard";
import SectionTitle from "@/components/ui/SectionTitle";
import { ProductDetailSkeleton } from "@/components/ui/LoadingSkeleton";
import useCartStore from "@/store/useCartStore";
import useWishlistStore from "@/store/useWishlistStore";
import useUIStore from "@/store/useUIStore";

export default function ProductDetailPage({ params }) {
  const [product, setProduct]         = useState(null);
  const [related, setRelated]         = useState([]);
  const [loading, setLoading]         = useState(true);
  const [activeImage, setActiveImage]  = useState(0);
  const [quantity, setQuantity]        = useState(1);
  const [selectedVolume, setVolume]    = useState(null);
  const [addedToCart, setAddedToCart]  = useState(false);
  const [activeTab, setActiveTab]      = useState("description");

  const addItem       = useCartStore((s) => s.addItem);
  const isWishlisted  = useWishlistStore((s) => s.isWishlisted);
  const toggleWishlist= useWishlistStore((s) => s.toggle);
  const { addToast, openCart } = useUIStore();

  // Unwrap params (Next.js 16 requires await in Server Components but here we use useEffect)
  const [slug, setSlug] = useState("");
  useEffect(() => {
    params.then ? params.then((p) => setSlug(p.slug)) : setSlug(params.slug);
  }, [params]);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`/api/products/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.product) {
          setProduct(data.product);
          setRelated(data.related ?? []);
          setVolume(data.product.volumes?.[0] ?? null);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, quantity, selectedVolume);
    setAddedToCart(true);
    addToast({ type: "success", message: `${product.name} added to cart` });
    openCart();
    setTimeout(() => setAddedToCart(false), 2500);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: product?.name, url: window.location.href });
    } else {
      navigator.clipboard?.writeText(window.location.href);
      addToast({ type: "info", message: "Link copied to clipboard!" });
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <ProductDetailSkeleton />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="font-serif text-2xl text-white mb-2">Product Not Found</h1>
        <p className="text-[#B8B8B8] mb-6">This fragrance doesn&apos;t exist or has been removed.</p>
        <Link href="/shop"><GoldButton>Back to Shop</GoldButton></Link>
      </div>
    );
  }

  const displayPrice  = product.salePrice ?? product.price;
  const discount      = product.salePrice && product.price > product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;
  const wishlisted    = isWishlisted(product._id);
  const images        = product.images?.length ? product.images : [null];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">

      {/* ── Breadcrumb ── */}
      <nav className="flex items-center gap-2 text-xs text-[#B8B8B8] mb-8">
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <span className="text-[#D4AF37]">/</span>
        <Link href="/shop" className="hover:text-white transition-colors">Shop</Link>
        {product.category && (
          <>
            <span className="text-[#D4AF37]">/</span>
            <Link href={`/shop?category=${product.category.slug}`} className="hover:text-white transition-colors">
              {product.category.name}
            </Link>
          </>
        )}
        <span className="text-[#D4AF37]">/</span>
        <span className="text-white line-clamp-1">{product.name}</span>
      </nav>

      {/* ── Main section ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">

        {/* LEFT: Image Gallery */}
        <div className="space-y-3">
          {/* Main image */}
          <motion.div
            key={activeImage}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="relative aspect-square rounded-2xl overflow-hidden bg-[#1A1A1A] border border-[rgba(212,175,55,0.1)]"
          >
            {images[activeImage] ? (
              <Image
                src={images[activeImage]}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <div className="text-8xl opacity-20">🌸</div>
                <p className="text-xs text-[#B8B8B8]/40 tracking-widest uppercase">No Image</p>
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.isNewArrival && (
                <span className="bg-white text-black text-[10px] font-bold px-2.5 py-1 rounded-full">New</span>
              )}
              {discount > 0 && (
                <span className="bg-[#D4AF37] text-black text-[10px] font-bold px-2.5 py-1 rounded-full">-{discount}%</span>
              )}
            </div>
          </motion.div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                    activeImage === i
                      ? "border-[#D4AF37]"
                      : "border-[rgba(212,175,55,0.1)] opacity-60 hover:opacity-100"
                  }`}
                >
                  {img ? (
                    <Image src={img} alt="" fill className="object-cover" />
                  ) : (
                    <div className="absolute inset-0 bg-[#1A1A1A] flex items-center justify-center text-lg">🌸</div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: Product info */}
        <div className="space-y-6">

          {/* Brand + name */}
          {product.brand && (
            <Link href={`/shop?brand=${product.brand.slug}`}>
              <p className="text-xs font-semibold tracking-[0.3em] text-[#D4AF37] uppercase hover:opacity-80 transition-opacity">
                {product.brand.name}
              </p>
            </Link>
          )}
          <h1 className="font-serif text-3xl sm:text-4xl text-white leading-tight">{product.name}</h1>

          {/* Rating */}
          {product.reviewCount > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.round(product.rating) ? "text-[#D4AF37] fill-[#D4AF37]" : "text-white/20"}`} />
                ))}
              </div>
              <span className="text-sm text-[#B8B8B8]">{product.rating} ({product.reviewCount} reviews)</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="font-serif text-3xl text-gradient-gold">
              ₹{displayPrice.toLocaleString("en-IN")}
            </span>
            {discount > 0 && (
              <span className="text-[#B8B8B8] text-lg line-through">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
            )}
            {discount > 0 && (
              <span className="text-green-400 text-sm font-semibold">Save {discount}%</span>
            )}
          </div>

          <div className="h-px bg-gradient-to-r from-[rgba(212,175,55,0.3)] to-transparent" />

          {/* Chips */}
          <div className="flex flex-wrap gap-2">
            {product.concentration && (
              <span className="px-3 py-1 text-xs glass border border-[rgba(212,175,55,0.15)] text-[#B8B8B8] rounded-full">
                {product.concentration}
              </span>
            )}
            {product.gender && (
              <span className="px-3 py-1 text-xs glass border border-[rgba(212,175,55,0.15)] text-[#B8B8B8] rounded-full">
                {product.gender}
              </span>
            )}
            {product.fragranceFamily && (
              <span className="px-3 py-1 text-xs glass border border-[rgba(212,175,55,0.15)] text-[#B8B8B8] rounded-full">
                {product.fragranceFamily}
              </span>
            )}
          </div>

          {/* Volume selector */}
          {product.volumes?.length > 0 && (
            <div>
              <p className="text-xs text-[#D4AF37] font-semibold uppercase tracking-widest mb-2">Size</p>
              <div className="flex flex-wrap gap-2">
                {product.volumes.map((vol) => (
                  <button
                    key={vol}
                    onClick={() => setVolume(vol)}
                    className={`px-4 py-2 rounded-xl text-sm border transition-all ${
                      selectedVolume === vol
                        ? "border-[#D4AF37] text-[#D4AF37] bg-[rgba(212,175,55,0.08)]"
                        : "border-[rgba(212,175,55,0.12)] text-[#B8B8B8] hover:border-[rgba(212,175,55,0.3)] hover:text-white"
                    }`}
                  >
                    {vol}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity + Add to Cart */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Quantity */}
            <div className="flex items-center gap-0 bg-[rgba(255,255,255,0.04)] border border-[rgba(212,175,55,0.12)] rounded-xl overflow-hidden">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-4 py-3 text-[#B8B8B8] hover:text-white transition-colors hover:bg-white/5"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-5 py-3 text-white font-medium text-base min-w-[48px] text-center">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stock > 0 ? 10 : 0, q + 1))}
                className="px-4 py-3 text-[#B8B8B8] hover:text-white transition-colors hover:bg-white/5"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Add to cart */}
            <GoldButton
              className="flex-1"
              disabled={product.stock === 0}
              onClick={handleAddToCart}
            >
              <AnimatePresence mode="wait">
                {addedToCart ? (
                  <motion.span key="added" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                    <Check className="w-4 h-4" /> Added!
                  </motion.span>
                ) : (
                  <motion.span key="add" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4" />
                    {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                  </motion.span>
                )}
              </AnimatePresence>
            </GoldButton>

            {/* Wishlist */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => { toggleWishlist(product._id); addToast({ type: wishlisted ? "info" : "success", message: wishlisted ? "Removed from wishlist" : "Added to wishlist ❤️" }); }}
              className={`p-3 rounded-xl border transition-all ${wishlisted ? "border-red-500/50 text-red-400 bg-red-500/5" : "border-[rgba(212,175,55,0.12)] text-[#B8B8B8] hover:border-red-500/30 hover:text-red-400"}`}
              aria-label="Wishlist"
            >
              <Heart className={`w-5 h-5 ${wishlisted ? "fill-current" : ""}`} />
            </motion.button>

            {/* Share */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleShare}
              className="p-3 rounded-xl border border-[rgba(212,175,55,0.12)] text-[#B8B8B8] hover:text-white hover:border-[rgba(212,175,55,0.3)] transition-all"
              aria-label="Share"
            >
              <Share2 className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Stock indicator */}
          {product.stock > 0 && product.stock <= 10 && (
            <p className="text-xs text-orange-400">⚠️ Only {product.stock} left in stock — order soon!</p>
          )}

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            {[
              { icon: ShieldCheck, text: "100% Authentic" },
              { icon: Truck,       text: "Express Delivery" },
              { icon: RotateCcw,   text: "30-Day Returns" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex flex-col items-center gap-1.5 p-3 rounded-xl glass border border-[rgba(212,175,55,0.08)] text-center">
                <Icon className="w-4 h-4 text-[#D4AF37]" />
                <p className="text-[10px] text-[#B8B8B8] leading-tight">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tabs: Description / Notes / Details ── */}
      <div className="mt-14 border-t border-[rgba(212,175,55,0.1)]">
        <div className="flex gap-0 overflow-x-auto border-b border-[rgba(212,175,55,0.08)]">
          {["description", "notes", "details"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 text-sm font-medium capitalize tracking-wide whitespace-nowrap transition-colors border-b-2 -mb-px ${
                activeTab === tab
                  ? "border-[#D4AF37] text-[#D4AF37]"
                  : "border-transparent text-[#B8B8B8] hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="py-8">
          <AnimatePresence mode="wait">
            {activeTab === "description" && (
              <motion.div key="desc" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <p className="text-[#B8B8B8] leading-relaxed text-sm sm:text-base max-w-3xl">
                  {product.description}
                </p>
              </motion.div>
            )}

            {activeTab === "notes" && (
              <motion.div key="notes" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="space-y-6 max-w-2xl"
              >
                {[
                  { label: "Top Notes",    notes: product.topNotes,    icon: "🌬️" },
                  { label: "Heart Notes",  notes: product.middleNotes, icon: "🌸" },
                  { label: "Base Notes",   notes: product.baseNotes,   icon: "🌿" },
                ].filter(({ notes }) => notes?.length).map(({ label, notes, icon }) => (
                  <div key={label} className="flex gap-4">
                    <div className="text-2xl mt-0.5">{icon}</div>
                    <div>
                      <p className="text-xs font-semibold text-[#D4AF37] uppercase tracking-widest mb-2">{label}</p>
                      <div className="flex flex-wrap gap-2">
                        {notes.map((n) => (
                          <span key={n} className="px-3 py-1 text-xs glass border border-[rgba(212,175,55,0.12)] text-[#B8B8B8] rounded-full">
                            {n}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
                {/* Longevity & projection */}
                {(product.longevity || product.projection) && (
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[rgba(212,175,55,0.08)]">
                    {product.longevity && (
                      <div>
                        <p className="text-xs text-[#D4AF37] uppercase tracking-widest mb-2">Longevity</p>
                        <div className="flex gap-1">
                          {Array.from({ length: 10 }).map((_, i) => (
                            <div key={i} className={`h-2 flex-1 rounded-full ${i < product.longevity ? "bg-[#D4AF37]" : "bg-white/10"}`} />
                          ))}
                        </div>
                        <p className="text-xs text-[#B8B8B8] mt-1">{product.longevity}/10</p>
                      </div>
                    )}
                    {product.projection && (
                      <div>
                        <p className="text-xs text-[#D4AF37] uppercase tracking-widest mb-2">Projection</p>
                        <div className="flex gap-1">
                          {Array.from({ length: 10 }).map((_, i) => (
                            <div key={i} className={`h-2 flex-1 rounded-full ${i < product.projection ? "bg-[#D4AF37]" : "bg-white/10"}`} />
                          ))}
                        </div>
                        <p className="text-xs text-[#B8B8B8] mt-1">{product.projection}/10</p>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "details" && (
              <motion.div key="details" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <table className="w-full max-w-md text-sm">
                  <tbody className="divide-y divide-[rgba(212,175,55,0.06)]">
                    {[
                      { label: "Brand",           value: product.brand?.name },
                      { label: "SKU",             value: product.sku },
                      { label: "Concentration",   value: product.concentration },
                      { label: "Gender",          value: product.gender },
                      { label: "Fragrance Family", value: product.fragranceFamily },
                      { label: "Occasion",        value: product.occasion?.join(", ") },
                      { label: "Season",          value: product.season?.join(", ") },
                      { label: "Available Sizes", value: product.volumes?.join(", ") },
                    ].filter(({ value }) => value).map(({ label, value }) => (
                      <tr key={label}>
                        <td className="py-2.5 pr-6 text-[#B8B8B8] font-medium w-40">{label}</td>
                        <td className="py-2.5 text-white">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Related Products ── */}
      {related.length > 0 && (
        <div className="mt-12 border-t border-[rgba(212,175,55,0.1)] pt-12">
          <SectionTitle title="You May Also Like" subtitle="Related Fragrances" center={false} />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {related.slice(0, 8).map((p, i) => (
              <ProductCard key={p._id} product={p} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
