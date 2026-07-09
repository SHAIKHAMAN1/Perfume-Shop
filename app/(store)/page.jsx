"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import GoldButton from "@/components/ui/GoldButton";
import SectionTitle from "@/components/ui/SectionTitle";
import GlassCard from "@/components/ui/GlassCard";

/* ── Dummy placeholder data (replaced by DB in Phase 2 API) ── */
const collections = [
  {
    id: "men", label: "For Him", icon: "👔", href: "/shop?gender=Men",
    desc: "Bold, powerful, and unforgettable. Discover masculine elegance.",
    gradient: "from-blue-900/60 to-black",
  },
  {
    id: "women", label: "For Her", icon: "🌸", href: "/shop?gender=Women",
    desc: "Delicate florals to sensual orientals. Femininity redefined.",
    gradient: "from-rose-900/60 to-black",
  },
  {
    id: "unisex", label: "Unisex", icon: "✦", href: "/shop?gender=Unisex",
    desc: "Boundary-defying fragrances for the free spirit.",
    gradient: "from-purple-900/60 to-black",
  },
  {
    id: "arabic", label: "Arabic Oud", icon: "🌙", href: "/shop?category=oud",
    desc: "Rich, smoky and deeply luxurious. The essence of Arabia.",
    gradient: "from-amber-900/60 to-black",
  },
];

const brands = [
  "DIOR", "TOM FORD", "CREED", "CHANEL", "ARMANI",
  "VERSACE", "YSL", "GUCCI", "HERMÈS", "BURBERRY",
];

const testimonials = [
  {
    name: "Priya S.", location: "Mumbai",
    text: "The packaging was exquisite and the fragrance is exactly as described. Will definitely order again!",
    rating: 5, avatar: "P",
  },
  {
    name: "Rahul M.", location: "Delhi",
    text: "Received my Creed Aventus in just 2 days. 100% authentic, very happy with the experience.",
    rating: 5, avatar: "R",
  },
  {
    name: "Anjali K.", location: "Bangalore",
    text: "Finally a luxury fragrance store that feels truly premium. The website itself is beautiful!",
    rating: 5, avatar: "A",
  },
];

const features = [
  { icon: "✦", title: "100% Authentic",    desc: "Sourced directly from brand-authorised distributors" },
  { icon: "🚚", title: "Express Delivery",  desc: "Pan-India delivery in 2–5 business days" },
  { icon: "↩", title: "30-Day Returns",    desc: "Hassle-free returns if you are not fully satisfied" },
  { icon: "🔒", title: "Secure Checkout",   desc: "Razorpay-powered 256-bit SSL encryption" },
  { icon: "🎁", title: "Gift Wrapping",     desc: "Luxury gift boxes available for all orders" },
  { icon: "💬", title: "Expert Support",    desc: "Fragrance consultants available Mon–Sat, 10am–7pm" },
];

/* ── Animation helpers ─────────────────────────────────────── */
const fadeUp = (delay = 0) => ({
  initial   : { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport  : { once: true, margin: "-60px" },
  transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] },
});

export default function HomePage() {
  const heroRef   = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY     = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <div className="overflow-hidden">

      {/* ════════════════════════════════════════
          HERO — Parallax + animated blobs
          ════════════════════════════════════════ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">

        {/* Background layer */}
        <motion.div style={{ y: heroY }} className="absolute inset-0 pointer-events-none">
          {/* Ambient gold blobs */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.12, 0.2, 0.12] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-[#D4AF37] blur-[140px]"
          />
          <motion.div
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.06, 0.14, 0.06] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 3 }}
            className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-[#D4AF37] blur-[120px]"
          />
          {/* Subtle grid */}
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(212,175,55,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.5) 1px, transparent 1px)",
              backgroundSize: "80px 80px",
            }}
          />
        </motion.div>

        {/* Hero content */}
        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 max-w-5xl mx-auto px-4 text-center"
        >
          {/* Eyebrow */}
          <motion.div {...fadeUp(0)}>
            <p className="text-[10px] sm:text-xs font-semibold tracking-[0.5em] text-[#D4AF37] uppercase mb-8">
              ✦ &nbsp; Luxury Fragrance House &nbsp; ✦
            </p>
          </motion.div>

          {/* Floating bottle */}
          <motion.div
            animate={{ y: [0, -18, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="inline-block mb-8"
          >
            <div className="relative">
              <div className="text-8xl sm:text-9xl filter drop-shadow-2xl">🧴</div>
              <motion.div
                animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute inset-0 rounded-full bg-[#D4AF37] blur-2xl opacity-20"
              />
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            {...fadeUp(0.1)}
            className="font-serif text-4xl sm:text-6xl lg:text-8xl font-light text-white leading-[1.03] mb-6"
          >
            Your Signature
            <br />
            <em className="text-gradient-gold not-italic">Scent Awaits</em>
          </motion.h1>

          {/* Sub */}
          <motion.p
            {...fadeUp(0.2)}
            className="text-[#B8B8B8] text-base sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10"
          >
            Curated luxury fragrances from the world&apos;s most celebrated perfume houses —
            delivered to your door with the reverence they deserve.
          </motion.p>

          {/* CTAs */}
          <motion.div {...fadeUp(0.3)} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/shop">
              <GoldButton size="lg">Shop the Collection</GoldButton>
            </Link>
            <Link href="/shop?featured=true">
              <GoldButton variant="outline" size="lg">Luxury Picks</GoldButton>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            {...fadeUp(0.45)}
            className="flex items-center justify-center divide-x divide-[rgba(212,175,55,0.2)] gap-0"
          >
            {[
              { value: "500+", label: "Fragrances" },
              { value: "50+",  label: "Brands" },
              { value: "10K+", label: "Happy Clients" },
              { value: "100%", label: "Authentic" },
            ].map(({ value, label }) => (
              <div key={label} className="px-6 sm:px-10 text-center first:pl-0 last:pr-0">
                <p className="font-serif text-2xl sm:text-3xl text-gradient-gold">{value}</p>
                <p className="text-[10px] text-[#B8B8B8] tracking-widest uppercase mt-0.5">{label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0], opacity: [0.8, 0.4, 0.8] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
        >
          <p className="text-[9px] tracking-[0.4em] text-[#B8B8B8]/40 uppercase">Scroll</p>
          <div className="w-px h-12 bg-gradient-to-b from-[#D4AF37] to-transparent" />
        </motion.div>
      </section>

      {/* ════════════════════════════════════════
          MARQUEE BRAND STRIP
          ════════════════════════════════════════ */}
      <div className="py-5 border-y border-[rgba(212,175,55,0.1)] overflow-hidden bg-[#0A0A0A]">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          className="flex gap-16 whitespace-nowrap"
        >
          {[...brands, ...brands].map((b, i) => (
            <span key={i} className="text-[10px] tracking-[0.4em] text-[#B8B8B8]/40 uppercase font-semibold">
              {b} <span className="text-[#D4AF37]">✦</span>
            </span>
          ))}
        </motion.div>
      </div>

      {/* ════════════════════════════════════════
          COLLECTIONS GRID
          ════════════════════════════════════════ */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <SectionTitle title="Explore Collections" subtitle="Curated for You" />

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {collections.map((col, i) => (
              <motion.div
                key={col.id}
                {...fadeUp(i * 0.08)}
                className="group"
              >
                <Link href={col.href}>
                  <div className={`relative h-52 sm:h-72 rounded-2xl overflow-hidden border border-[rgba(212,175,55,0.1)] bg-gradient-to-b ${col.gradient} cursor-pointer`}>
                    {/* Icon */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4 text-center">
                      <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }}
                        className="text-4xl sm:text-5xl"
                      >
                        {col.icon}
                      </motion.div>
                      <h3 className="font-serif text-lg sm:text-xl text-white group-hover:text-[#D4AF37] transition-colors">
                        {col.label}
                      </h3>
                      <p className="text-xs text-[#B8B8B8] leading-relaxed hidden sm:block">{col.desc}</p>
                    </div>

                    {/* Gold border on hover */}
                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-[rgba(212,175,55,0.4)] rounded-2xl transition-all duration-300" />

                    {/* Shimmer on hover */}
                    <motion.div
                      initial={{ x: "-100%", opacity: 0 }}
                      whileHover={{ x: "200%", opacity: 1 }}
                      transition={{ duration: 0.6 }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12"
                    />

                    {/* CTA */}
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-[10px] text-[#D4AF37] font-semibold tracking-widest uppercase">
                        Explore →
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          GOLD PROMO BANNER
          ════════════════════════════════════════ */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            {...fadeUp()}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1A1400] via-[#271E00] to-[#1A1400] border border-[rgba(212,175,55,0.25)] p-8 sm:p-12"
          >
            {/* BG glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-[rgba(212,175,55,0.05)] to-transparent pointer-events-none" />
            <motion.div
              animate={{ x: ["0%", "100%", "0%"], opacity: [0, 0.08, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent pointer-events-none"
            />

            <div className="relative flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="text-center sm:text-left">
                <p className="text-[10px] tracking-[0.4em] text-[#D4AF37] uppercase font-semibold mb-2">
                  Limited Offer
                </p>
                <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-white mb-2">
                  Free Shipping on Orders Above <span className="text-gradient-gold">₹1,999</span>
                </h2>
                <p className="text-sm text-[#B8B8B8]">Use code LUXESHIP at checkout</p>
              </div>
              <Link href="/shop" className="flex-shrink-0">
                <GoldButton size="lg">Shop Now</GoldButton>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          WHY CHOOSE US — Feature grid
          ════════════════════════════════════════ */}
      <section className="py-24 px-4 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto">
          <SectionTitle title="The Luxeure Promise" subtitle="Why Choose Us" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {features.map(({ icon, title, desc }, i) => (
              <GlassCard key={title} delay={i * 0.07} className="p-6 text-center">
                <div className="text-3xl mb-4">{icon}</div>
                <h3 className="font-serif text-white text-base mb-2">{title}</h3>
                <p className="text-xs text-[#B8B8B8] leading-relaxed">{desc}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          FRAGRANCE NOTES EXPLAINER
          ════════════════════════════════════════ */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div {...fadeUp()}>
              <p className="text-[10px] tracking-[0.4em] text-[#D4AF37] uppercase font-semibold mb-4">The Anatomy</p>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white leading-tight mb-6">
                Understanding Fragrance Notes
              </h2>
              <p className="text-[#B8B8B8] leading-relaxed mb-8">
                Every luxury fragrance unfolds as a story — told in three acts. From the burst of top notes
                to the lingering warmth of the base, each layer reveals a new dimension of your scent.
              </p>
              <div className="space-y-4">
                {[
                  { label: "Top Notes", time: "0–30 min", desc: "First impression — citrus, herbs, light florals" },
                  { label: "Heart Notes", time: "30 min–4 hrs", desc: "The character — rose, jasmine, spices, woods" },
                  { label: "Base Notes", time: "4+ hours", desc: "Long-lasting soul — musk, amber, oud, vanilla" },
                ].map(({ label, time, desc }, i) => (
                  <motion.div
                    key={label}
                    {...fadeUp(i * 0.1)}
                    className="flex gap-4 p-4 rounded-xl bg-white/[0.03] border border-[rgba(212,175,55,0.08)] group hover:border-[rgba(212,175,55,0.2)] transition-colors"
                  >
                    <div className="w-2 self-stretch rounded-full bg-gradient-to-b from-[#D4AF37] to-[#A8891C] flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" />
                    <div>
                      <div className="flex items-baseline gap-2 mb-1">
                        <h3 className="text-white font-medium text-sm">{label}</h3>
                        <span className="text-[10px] text-[#D4AF37] bg-[rgba(212,175,55,0.08)] px-2 py-0.5 rounded-full">{time}</span>
                      </div>
                      <p className="text-xs text-[#B8B8B8]">{desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Visual pyramid */}
            <motion.div {...fadeUp(0.2)} className="flex flex-col items-center gap-3">
              {[
                { label: "TOP NOTES",    width: "40%",  color: "from-[#E8D5A3] to-[#D4AF37]" },
                { label: "HEART NOTES",  width: "65%",  color: "from-[#D4AF37] to-[#B8941F]" },
                { label: "BASE NOTES",   width: "100%", color: "from-[#A8891C] to-[#7A6514]" },
              ].map(({ label, width, color }) => (
                <div key={label} className="w-full flex flex-col items-center gap-1">
                  <div
                    className={`h-16 sm:h-20 rounded-xl bg-gradient-to-r ${color} flex items-center justify-center shadow-lg`}
                    style={{ width }}
                  >
                    <span className="text-black text-[10px] sm:text-xs font-bold tracking-[0.2em]">{label}</span>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          TESTIMONIALS
          ════════════════════════════════════════ */}
      <section className="py-24 px-4 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto">
          <SectionTitle title="What Our Clients Say" subtitle="Testimonials" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(({ name, location, text, rating, avatar }, i) => (
              <GlassCard key={name} delay={i * 0.1} className="p-6">
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: rating }).map((_, j) => (
                    <span key={j} className="text-[#D4AF37] text-sm">★</span>
                  ))}
                </div>
                <p className="text-[#B8B8B8] text-sm leading-relaxed mb-6 italic">&ldquo;{text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#A8891C] flex items-center justify-center flex-shrink-0">
                    <span className="text-black text-sm font-bold">{avatar}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{name}</p>
                    <p className="text-[10px] text-[#B8B8B8]">{location}</p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          NEWSLETTER CTA SECTION
          ════════════════════════════════════════ */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div {...fadeUp()}>
            <p className="text-[10px] tracking-[0.4em] text-[#D4AF37] uppercase font-semibold mb-4">Inner Circle</p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white mb-4">
              Be the First to Know
            </h2>
            <p className="text-[#B8B8B8] mb-8 leading-relaxed">
              Subscribe for exclusive offers, new arrivals, and curated fragrance stories — delivered to your inbox.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-5 py-3.5 bg-[rgba(255,255,255,0.04)] border border-[rgba(212,175,55,0.15)] text-white placeholder:text-[#B8B8B8]/50 text-sm rounded-xl focus:outline-none focus:border-[#D4AF37]/50 focus:ring-2 focus:ring-[rgba(212,175,55,0.1)] transition-all"
              />
              <GoldButton type="submit" size="md">Join</GoldButton>
            </form>
            <p className="text-[10px] text-[#B8B8B8]/40 mt-4">No spam, unsubscribe anytime.</p>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
