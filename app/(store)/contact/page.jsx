"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail, Phone, MapPin, Clock, MessageCircle,
  Send, CheckCircle, Globe, Share2, AtSign,
} from "lucide-react";
import GoldButton from "@/components/ui/GoldButton";
import SectionTitle from "@/components/ui/SectionTitle";

const CONTACT_INFO = [
  {
    icon: Phone,
    title: "Phone / WhatsApp",
    lines: ["+91 98765 43210", "Mon–Sat, 10 AM – 7 PM"],
    href: "tel:+919876543210",
  },
  {
    icon: Mail,
    title: "Email",
    lines: ["support@luxeure.in", "We reply within 24 hours"],
    href: "mailto:support@luxeure.in",
  },
  {
    icon: MapPin,
    title: "Warehouse",
    lines: ["Mumbai, Maharashtra, India", "Dispatch: Mon–Sat"],
    href: "#",
  },
  {
    icon: Clock,
    title: "Support Hours",
    lines: ["Mon–Sat: 10 AM – 7 PM", "Sun: 11 AM – 4 PM"],
    href: "#",
  },
];

const FAQS = [
  {
    q: "Are all your fragrances 100% authentic?",
    a: "Yes, absolutely. Every product is sourced directly from authorized distributors and comes with a certificate of authenticity. We have a zero-tolerance policy for counterfeits.",
  },
  {
    q: "How long does delivery take?",
    a: "Standard delivery takes 3–5 business days. Express delivery (2 business days) is available at checkout. Orders placed before 2 PM are dispatched the same day.",
  },
  {
    q: "What is your return policy?",
    a: "We offer a 30-day hassle-free return policy. If you're not satisfied with your purchase, contact our support team and we'll arrange a pickup and full refund.",
  },
  {
    q: "Do you ship internationally?",
    a: "Currently we ship across all major cities in India. International shipping is coming soon — sign up for our newsletter to get notified.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit/debit cards, UPI (PhonePe, GPay, Paytm), net banking, and cash on delivery for orders under ₹5,000.",
  },
];

export default function ContactPage() {
  const [form, setForm]       = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = "Name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.subject.trim()) e.subject = "Subject is required";
    if (!form.message.trim()) e.message = "Message is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1200));
    setSent(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">

      {/* ── Hero ── */}
      <section className="max-w-5xl mx-auto text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-block text-xs tracking-[0.35em] text-[#D4AF37] uppercase mb-4">
            We&apos;re Here to Help
          </span>
          <h1 className="font-serif text-5xl sm:text-6xl text-white mb-5">
            Get in <span className="text-gradient-gold">Touch</span>
          </h1>
          <p className="text-[#B8B8B8] text-lg max-w-xl mx-auto">
            Have a question, need help with an order, or want to request a specific fragrance?
            Our team is happy to assist.
          </p>
        </motion.div>
      </section>

      {/* ── Contact Info Cards ── */}
      <section className="max-w-7xl mx-auto mb-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CONTACT_INFO.map((item, i) => (
            <motion.a
              key={item.title}
              href={item.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group p-6 rounded-2xl border border-[rgba(212,175,55,0.1)] bg-[rgba(255,255,255,0.02)] hover:border-[rgba(212,175,55,0.3)] hover:bg-[rgba(212,175,55,0.04)] transition-all duration-300 block"
            >
              <div className="w-10 h-10 rounded-xl bg-[rgba(212,175,55,0.1)] flex items-center justify-center mb-4 group-hover:bg-[rgba(212,175,55,0.2)] transition-colors">
                <item.icon className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-2">{item.title}</h3>
              {item.lines.map((line) => (
                <p key={line} className="text-xs text-[#B8B8B8] leading-relaxed">{line}</p>
              ))}
            </motion.a>
          ))}
        </div>
      </section>

      {/* ── Form + Social ── */}
      <section className="max-w-7xl mx-auto mb-20">
        <div className="grid lg:grid-cols-5 gap-8">

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            <div className="p-8 rounded-3xl border border-[rgba(212,175,55,0.12)] bg-[rgba(255,255,255,0.02)]">
              <div className="flex items-center gap-3 mb-6">
                <MessageCircle className="w-5 h-5 text-[#D4AF37]" />
                <h2 className="font-serif text-2xl text-white">Send a Message</h2>
              </div>

              {sent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 rounded-full bg-green-500/10 border-2 border-green-500/30 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="font-serif text-2xl text-white mb-2">Message Sent!</h3>
                  <p className="text-[#B8B8B8]">We&apos;ll get back to you within 24 hours.</p>
                  <button
                    onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                    className="mt-6 text-sm text-[#D4AF37] hover:underline"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                      <label className="block text-xs text-[#D4AF37] font-semibold uppercase tracking-widest mb-1.5">Your Name</label>
                      <input
                        value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                        placeholder="Amaan Khan"
                        className={`w-full px-4 py-3 bg-[rgba(255,255,255,0.04)] border rounded-xl text-white placeholder:text-[#B8B8B8]/40 text-sm focus:outline-none transition-all ${errors.name ? "border-red-500/60" : "border-[rgba(212,175,55,0.12)] focus:border-[rgba(212,175,55,0.4)]"}`}
                      />
                      {errors.name && <p className="text-red-400 text-[10px] mt-1">{errors.name}</p>}
                    </div>
                    {/* Email */}
                    <div>
                      <label className="block text-xs text-[#D4AF37] font-semibold uppercase tracking-widest mb-1.5">Email Address</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                        placeholder="you@example.com"
                        className={`w-full px-4 py-3 bg-[rgba(255,255,255,0.04)] border rounded-xl text-white placeholder:text-[#B8B8B8]/40 text-sm focus:outline-none transition-all ${errors.email ? "border-red-500/60" : "border-[rgba(212,175,55,0.12)] focus:border-[rgba(212,175,55,0.4)]"}`}
                      />
                      {errors.email && <p className="text-red-400 text-[10px] mt-1">{errors.email}</p>}
                    </div>
                  </div>
                  {/* Subject */}
                  <div>
                    <label className="block text-xs text-[#D4AF37] font-semibold uppercase tracking-widest mb-1.5">Subject</label>
                    <input
                      value={form.subject}
                      onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                      placeholder="Order query, return request, general inquiry…"
                      className={`w-full px-4 py-3 bg-[rgba(255,255,255,0.04)] border rounded-xl text-white placeholder:text-[#B8B8B8]/40 text-sm focus:outline-none transition-all ${errors.subject ? "border-red-500/60" : "border-[rgba(212,175,55,0.12)] focus:border-[rgba(212,175,55,0.4)]"}`}
                    />
                    {errors.subject && <p className="text-red-400 text-[10px] mt-1">{errors.subject}</p>}
                  </div>
                  {/* Message */}
                  <div>
                    <label className="block text-xs text-[#D4AF37] font-semibold uppercase tracking-widest mb-1.5">Message</label>
                    <textarea
                      value={form.message}
                      onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                      placeholder="Tell us how we can help…"
                      rows={5}
                      className={`w-full px-4 py-3 bg-[rgba(255,255,255,0.04)] border rounded-xl text-white placeholder:text-[#B8B8B8]/40 text-sm focus:outline-none transition-all resize-none ${errors.message ? "border-red-500/60" : "border-[rgba(212,175,55,0.12)] focus:border-[rgba(212,175,55,0.4)]"}`}
                    />
                    {errors.message && <p className="text-red-400 text-[10px] mt-1">{errors.message}</p>}
                  </div>
                  <GoldButton type="submit" disabled={loading} className="w-full">
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                        Sending…
                      </span>
                    ) : (
                      <span className="flex items-center gap-2"><Send className="w-4 h-4" /> Send Message</span>
                    )}
                  </GoldButton>
                </form>
              )}
            </div>
          </motion.div>

          {/* Social + Quick Links */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Social */}
            <div className="p-6 rounded-2xl border border-[rgba(212,175,55,0.12)] bg-[rgba(255,255,255,0.02)]">
              <h3 className="font-serif text-xl text-white mb-4">Follow Us</h3>
              <div className="space-y-3">
                {[
                  { icon: Globe,   label: "@luxeure.in",  sub: "Behind-the-scenes & new arrivals", color: "from-pink-500 to-purple-500" },
                  { icon: Share2,  label: "LUXEURE India", sub: "Community, offers & updates",      color: "from-blue-600 to-blue-400" },
                  { icon: AtSign,  label: "@luxeureindia", sub: "Latest news & fragrance drops",     color: "from-sky-400 to-cyan-400" },
                ].map(({ icon: Icon, label, sub, color }) => (
                  <a
                    key={label}
                    href="#"
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group"
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-white font-medium group-hover:text-[#D4AF37] transition-colors">{label}</p>
                      <p className="text-[10px] text-[#B8B8B8]">{sub}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-4 p-6 rounded-2xl bg-gradient-to-r from-green-900/40 to-green-800/20 border border-green-700/30 hover:border-green-500/40 transition-colors group"
            >
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">💬</span>
              </div>
              <div>
                <p className="text-white font-semibold group-hover:text-green-400 transition-colors">Chat on WhatsApp</p>
                <p className="text-xs text-[#B8B8B8]">Fastest response — usually within minutes</p>
              </div>
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <SectionTitle subtitle="Common Questions">FAQ</SectionTitle>
        </div>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl border border-[rgba(212,175,55,0.1)] bg-[rgba(255,255,255,0.02)] overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left"
              >
                <span className="text-sm font-medium text-white">{faq.q}</span>
                <span className={`text-[#D4AF37] text-lg transition-transform ${openFaq === i ? "rotate-45" : ""}`}>+</span>
              </button>
              {openFaq === i && (
                <div className="px-6 pb-4">
                  <p className="text-sm text-[#B8B8B8] leading-relaxed">{faq.a}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
