"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Shield, Truck, Award, Heart, Users, Package,
  Star, ArrowRight, CheckCircle,
} from "lucide-react";
import GoldButton from "@/components/ui/GoldButton";
import SectionTitle from "@/components/ui/SectionTitle";

const VALUES = [
  {
    icon: Shield,
    title: "100% Authentic",
    desc: "Every bottle is sourced directly from authorized distributors with full chain-of-custody traceability.",
  },
  {
    icon: Award,
    title: "Luxury Curation",
    desc: "Our experts hand-select only the finest fragrances from the world's most prestigious houses.",
  },
  {
    icon: Truck,
    title: "Express Delivery",
    desc: "Premium packaging, bubble-wrapped and sealed, delivered to your door within 2–5 business days.",
  },
  {
    icon: Heart,
    title: "Customer First",
    desc: "We stand behind every purchase with a 30-day return policy and dedicated concierge support.",
  },
];

const STATS = [
  { value: "10,000+", label: "Happy Customers" },
  { value: "50+",     label: "Luxury Brands" },
  { value: "500+",    label: "Unique Fragrances" },
  { value: "4.9★",    label: "Average Rating" },
];

const TEAM = [
  { name: "Aryan Sharma",   role: "Founder & CEO",        avatar: "A", bio: "Fragrance connoisseur with 15 years of experience in luxury retail." },
  { name: "Meera Patel",    role: "Head of Procurement",  avatar: "M", bio: "Sources directly from Parisian ateliers and global luxury houses." },
  { name: "Zain Ali",       role: "Customer Experience",  avatar: "Z", bio: "Dedicated to ensuring every LUXEURE experience is exceptional." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-4">

      {/* ── Hero ── */}
      <section className="max-w-5xl mx-auto text-center mb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-block text-xs tracking-[0.35em] text-[#D4AF37] uppercase mb-4">
            Our Story
          </span>
          <h1 className="font-serif text-5xl sm:text-7xl text-white mb-6 leading-tight">
            Born from a Passion<br />
            <span className="text-gradient-gold">for Luxury</span>
          </h1>
          <p className="text-[#B8B8B8] text-xl max-w-3xl mx-auto leading-relaxed">
            LUXEURE was founded with a singular mission — to make the world's finest
            fragrances accessible to every Indian who appreciates true luxury.
          </p>
        </motion.div>

        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="w-24 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-10"
        />
      </section>

      {/* ── Story section ── */}
      <section className="max-w-7xl mx-auto mb-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <SectionTitle>The LUXEURE Story</SectionTitle>
            <p className="text-[#B8B8B8] leading-relaxed">
              What started as a personal quest to find authentic luxury perfumes in India
              grew into something much larger. Our founder, frustrated by counterfeit
              products and inflated grey-market prices, built LUXEURE as a direct-to-consumer
              platform that bridges the gap between global fragrance houses and Indian customers.
            </p>
            <p className="text-[#B8B8B8] leading-relaxed">
              Today, we partner with authorized distributors across Paris, London, New York,
              and Dubai — ensuring every single bottle that reaches you is 100% genuine,
              sealed, and authenticated with a certificate of authenticity.
            </p>
            <p className="text-[#B8B8B8] leading-relaxed">
              We don't just sell perfume. We deliver an experience — from the moment you
              browse our curated collection to the day your parcel arrives in bespoke
              luxury packaging at your door.
            </p>
            <Link href="/shop">
              <GoldButton className="mt-2">
                Explore Collection <ArrowRight className="w-4 h-4" />
              </GoldButton>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4"
          >
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-2xl bg-gradient-to-b from-[rgba(212,175,55,0.08)] to-transparent border border-[rgba(212,175,55,0.12)] text-center"
              >
                <p className="font-serif text-4xl text-[#D4AF37] mb-2">{stat.value}</p>
                <p className="text-xs text-[#B8B8B8] uppercase tracking-widest">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="max-w-7xl mx-auto mb-24">
        <div className="text-center mb-12">
          <SectionTitle subtitle="What We Stand For">Our Values</SectionTitle>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {VALUES.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl border border-[rgba(212,175,55,0.1)] bg-[rgba(255,255,255,0.02)] hover:border-[rgba(212,175,55,0.25)] transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-[rgba(212,175,55,0.1)] flex items-center justify-center mb-4">
                <v.icon className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <h3 className="font-serif text-lg text-white mb-2">{v.title}</h3>
              <p className="text-sm text-[#B8B8B8] leading-relaxed">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Promises ── */}
      <section className="max-w-4xl mx-auto mb-24">
        <div className="p-10 rounded-3xl bg-gradient-to-b from-[rgba(212,175,55,0.06)] to-transparent border border-[rgba(212,175,55,0.12)]">
          <div className="text-center mb-8">
            <SectionTitle subtitle="Our Guarantee">The LUXEURE Promise</SectionTitle>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              "All fragrances are 100% authentic, sealed and verified",
              "Sourced directly from authorized global distributors",
              "Premium eco-friendly packaging on every order",
              "Free shipping on orders above ₹1,999",
              "30-day hassle-free return policy",
              "Dedicated customer support 7 days a week",
              "Same-day dispatch for orders placed before 2 PM",
              "Secure payments via Razorpay with UPI, cards & wallets",
            ].map((promise) => (
              <div key={promise} className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-[#D4AF37] mt-0.5 flex-shrink-0" />
                <p className="text-sm text-[#B8B8B8]">{promise}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="max-w-7xl mx-auto mb-24">
        <div className="text-center mb-12">
          <SectionTitle subtitle="The People Behind LUXEURE">Meet the Team</SectionTitle>
        </div>
        <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {TEAM.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl border border-[rgba(212,175,55,0.1)] bg-[rgba(255,255,255,0.02)] text-center"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#A8891C] flex items-center justify-center mx-auto mb-4">
                <span className="text-black text-2xl font-bold">{member.avatar}</span>
              </div>
              <h3 className="text-white font-medium text-lg">{member.name}</h3>
              <p className="text-[#D4AF37] text-xs tracking-widest uppercase mt-0.5 mb-3">{member.role}</p>
              <p className="text-sm text-[#B8B8B8] leading-relaxed">{member.bio}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-12 rounded-3xl bg-gradient-to-b from-[rgba(212,175,55,0.08)] to-transparent border border-[rgba(212,175,55,0.12)]"
        >
          <h2 className="font-serif text-3xl text-white mb-4">Ready to discover your signature scent?</h2>
          <p className="text-[#B8B8B8] mb-8">
            Browse our curated collection of 500+ luxury fragrances.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/shop"><GoldButton>Shop Now</GoldButton></Link>
            <Link href="/contact"><GoldButton variant="outline">Contact Us</GoldButton></Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
