"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";

/* Custom SVG social icons (lucide removed brand icons in v0.396+) */
const SocialIcons = {
  Instagram: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".5" fill="currentColor"/>
    </svg>
  ),
  Twitter: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  Facebook: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  ),
  Youtube: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>
    </svg>
  ),
};

const footerLinks = {
  shop: [
    { label: "All Products",  href: "/shop" },
    { label: "Best Sellers",  href: "/shop?sort=best-selling" },
    { label: "New Arrivals",  href: "/shop?sort=newest" },
    { label: "Men",           href: "/shop?gender=Men" },
    { label: "Women",         href: "/shop?gender=Women" },
    { label: "Luxury Picks",  href: "/shop?featured=true" },
  ],
  company: [
    { label: "About Us",  href: "/about" },
    { label: "Our Story", href: "/about#story" },
    { label: "Careers",   href: "/careers" },
    { label: "Press",     href: "/press" },
    { label: "Contact",   href: "/contact" },
  ],
  support: [
    { label: "FAQ",              href: "/faq" },
    { label: "Order Tracking",   href: "/track-order" },
    { label: "Shipping Policy",  href: "/shipping-policy" },
    { label: "Return Policy",    href: "/return-policy" },
    { label: "Authenticity",     href: "/authenticity" },
  ],
  legal: [
    { label: "Privacy Policy",   href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms" },
    { label: "Cookie Policy",    href: "/cookies" },
  ],
};

const socials = [
  { Icon: SocialIcons.Instagram, href: "#", label: "Instagram" },
  { Icon: SocialIcons.Twitter,   href: "#", label: "Twitter (X)" },
  { Icon: SocialIcons.Facebook,  href: "#", label: "Facebook" },
  { Icon: SocialIcons.Youtube,   href: "#", label: "YouTube" },
];

const fadeUp = {
  hidden : { opacity: 0, y: 20 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

export default function Footer() {
  return (
    <footer className="relative bg-[#0A0A0A] border-t border-[rgba(212,175,55,0.1)] mt-24">
      {/* Gold strip */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-40" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Newsletter ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="py-14 flex flex-col lg:flex-row items-center gap-8 border-b border-[rgba(212,175,55,0.08)]"
        >
          <div className="flex-1 text-center lg:text-left">
            <h2 className="font-serif text-2xl lg:text-3xl text-white mb-2">
              Join the Inner Circle
            </h2>
            <p className="text-[#B8B8B8] text-sm">
              Be the first to discover new collections, exclusive offers, and luxury stories.
            </p>
          </div>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex gap-2 w-full max-w-md"
          >
            <div className="flex-1 relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B8B8B8]" />
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full pl-10 pr-4 py-3 bg-[rgba(255,255,255,0.04)] border border-[rgba(212,175,55,0.15)] text-white placeholder:text-[#B8B8B8]/60 text-sm rounded-xl focus:outline-none focus:border-[#D4AF37]/50 focus:ring-2 focus:ring-[rgba(212,175,55,0.1)] transition-all"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="px-5 py-3 bg-gradient-to-r from-[#D4AF37] to-[#A8891C] text-black text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              Subscribe
            </motion.button>
          </form>
        </motion.div>

        {/* ── Main footer grid ── */}
        <div className="py-14 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 border-b border-[rgba(212,175,55,0.08)]">

          {/* Brand column */}
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="col-span-2 md:col-span-3 lg:col-span-1"
          >
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#A8891C] flex items-center justify-center">
                <span className="text-black text-xs font-bold">✦</span>
              </div>
              <span className="font-serif text-xl text-white tracking-[0.15em] group-hover:text-[#D4AF37] transition-colors">
                LUXEURE
              </span>
            </Link>
            <p className="text-[#B8B8B8] text-sm leading-relaxed mb-6">
              Curated luxury fragrances from the world&apos;s most celebrated perfume houses.
            </p>

            {/* Social links */}
            <div className="flex gap-3">
              {socials.map(({ Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  aria-label={label}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-9 h-9 flex items-center justify-center rounded-full glass border border-[rgba(212,175,55,0.12)] text-[#B8B8B8] hover:text-[#D4AF37] hover:border-[rgba(212,175,55,0.3)] transition-all"
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Link columns */}
          {[
            { title: "Shop",    links: footerLinks.shop },
            { title: "Company", links: footerLinks.company },
            { title: "Support", links: footerLinks.support },
          ].map((col, i) => (
            <motion.div
              key={col.title}
              custom={i + 1}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h3 className="text-xs font-semibold tracking-widest text-[#D4AF37] uppercase mb-4">
                {col.title}
              </h3>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#B8B8B8] hover:text-white transition-colors hover:translate-x-0.5 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* ── Contact strip ── */}
        <div className="py-6 flex flex-col sm:flex-row gap-4 sm:gap-8 items-center justify-center border-b border-[rgba(212,175,55,0.08)]">
          {[
            { icon: Phone,  text: "+91 98765 43210" },
            { icon: Mail,   text: "hello@luxeure.com" },
            { icon: MapPin, text: "Mumbai, India" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2 text-sm text-[#B8B8B8]">
              <Icon className="w-4 h-4 text-[#D4AF37]" />
              {text}
            </div>
          ))}
        </div>

        {/* ── Bottom bar ── */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#B8B8B8]/60">
            © {new Date().getFullYear()} Luxeure. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs text-[#B8B8B8]/60 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
          {/* Payment icons placeholder */}
          <div className="flex items-center gap-2 text-xs text-[#B8B8B8]/50">
            <span>Secured by</span>
            <span className="text-[#D4AF37] font-semibold">Razorpay</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
