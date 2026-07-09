"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, CreditCard, CheckCircle, ChevronRight,
  Lock, Truck, RotateCcw, ShieldCheck, Package,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import useCartStore from "@/store/useCartStore";
import useUIStore from "@/store/useUIStore";
import GoldButton from "@/components/ui/GoldButton";

/* ── Indian states list ───────────────────────────────────────── */
const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
  "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
  "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab",
  "Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh",
  "Uttarakhand","West Bengal","Andaman and Nicobar Islands","Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu","Delhi","Jammu and Kashmir",
  "Ladakh","Lakshadweep","Puducherry",
];

/* ── Step indicator ─────────────────────────────────────────────── */
const STEPS = [
  { id: 1, label: "Address",  icon: MapPin },
  { id: 2, label: "Review",   icon: Package },
  { id: 3, label: "Payment",  icon: CreditCard },
];

function StepIndicator({ current }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {STEPS.map((step, i) => {
        const done    = current > step.id;
        const active  = current === step.id;
        const Icon    = step.icon;
        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <motion.div
                animate={{
                  backgroundColor: done || active ? "#D4AF37" : "rgba(255,255,255,0.05)",
                  borderColor    : done || active ? "#D4AF37" : "rgba(212,175,55,0.2)",
                }}
                className="w-9 h-9 rounded-full border-2 flex items-center justify-center"
              >
                {done ? (
                  <CheckCircle className="w-4 h-4 text-black" />
                ) : (
                  <Icon className={`w-4 h-4 ${active ? "text-black" : "text-[#B8B8B8]"}`} />
                )}
              </motion.div>
              <span className={`text-[10px] font-medium tracking-wide ${active ? "text-[#D4AF37]" : done ? "text-[#D4AF37]/60" : "text-[#B8B8B8]/50"}`}>
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`w-16 sm:w-24 h-px mx-2 mb-5 transition-colors duration-500 ${current > step.id ? "bg-[#D4AF37]" : "bg-[rgba(212,175,55,0.15)]"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── Address form ───────────────────────────────────────────────── */
const EMPTY_ADDR = { fullName: "", phone: "", line1: "", line2: "", city: "", state: "", pincode: "" };

/* Field must be defined OUTSIDE AddressStep so React doesn't
   recreate (unmount/remount) the <input> on every keystroke,
   which would cause the input to lose focus after each character. */
function AddressField({ name, label, placeholder, type = "text", half = false, address, setAddress, errors }) {
  return (
    <div className={half ? "col-span-1" : "col-span-2"}>
      <label className="block text-xs text-[#D4AF37] font-semibold uppercase tracking-widest mb-1.5">{label}</label>
      <input
        type={type}
        value={address[name]}
        onChange={(e) => setAddress((a) => ({ ...a, [name]: e.target.value }))}
        placeholder={placeholder}
        className={`w-full px-4 py-3 bg-[rgba(255,255,255,0.04)] border rounded-xl text-white placeholder:text-[#B8B8B8]/40 text-sm focus:outline-none transition-all ${
          errors[name]
            ? "border-red-500/60 focus:border-red-500"
            : "border-[rgba(212,175,55,0.12)] focus:border-[#D4AF37]/50 focus:ring-2 focus:ring-[rgba(212,175,55,0.08)]"
        }`}
      />
      {errors[name] && <p className="text-red-400 text-[10px] mt-1">{errors[name]}</p>}
    </div>
  );
}

function AddressStep({ address, setAddress, onNext }) {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!address.fullName.trim()) e.fullName = "Full name is required";
    if (!/^[6-9]\d{9}$/.test(address.phone.trim())) e.phone = "Enter a valid 10-digit Indian mobile number";
    if (!address.line1.trim()) e.line1 = "Address line 1 is required";
    if (!address.city.trim()) e.city = "City is required";
    if (!address.state) e.state = "State is required";
    if (!/^\d{6}$/.test(address.pincode.trim())) e.pincode = "Enter a valid 6-digit PIN code";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => validate() && onNext();

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
      className="space-y-5"
    >
      <h2 className="font-serif text-xl text-white">Shipping Address</h2>
      <div className="grid grid-cols-2 gap-4">
        <AddressField name="fullName" label="Full Name"    placeholder="Amaan Khan" address={address} setAddress={setAddress} errors={errors} />
        <AddressField name="phone"    label="Phone Number" placeholder="9876543210" type="tel" address={address} setAddress={setAddress} errors={errors} />
        <AddressField name="line1"    label="Address Line 1" placeholder="House / Flat / Building No." address={address} setAddress={setAddress} errors={errors} />
        <AddressField name="line2"    label="Address Line 2 (optional)" placeholder="Street, Area, Landmark" address={address} setAddress={setAddress} errors={errors} />
        <AddressField name="city"     label="City"    placeholder="Mumbai" half address={address} setAddress={setAddress} errors={errors} />
        <div className="col-span-1">
          <label className="block text-xs text-[#D4AF37] font-semibold uppercase tracking-widest mb-1.5">State</label>
          <select
            value={address.state}
            onChange={(e) => setAddress((a) => ({ ...a, state: e.target.value }))}
            className={`w-full px-4 py-3 bg-[rgba(255,255,255,0.04)] border rounded-xl text-white text-sm focus:outline-none transition-all appearance-none ${
              errors.state ? "border-red-500/60" : "border-[rgba(212,175,55,0.12)] focus:border-[#D4AF37]/50"
            }`}
          >
            <option value="" className="bg-[#171717]">Select state</option>
            {INDIAN_STATES.map((s) => <option key={s} value={s} className="bg-[#171717]">{s}</option>)}
          </select>
          {errors.state && <p className="text-red-400 text-[10px] mt-1">{errors.state}</p>}
        </div>
        <AddressField name="pincode" label="PIN Code" placeholder="400001" half address={address} setAddress={setAddress} errors={errors} />
      </div>
      <GoldButton className="w-full mt-4" onClick={handleNext} size="lg">
        Continue to Review <ChevronRight className="w-4 h-4" />
      </GoldButton>
    </motion.div>
  );
}

/* ── Review step ────────────────────────────────────────────────── */
function ReviewStep({ items, address, subtotal, shipping, couponDiscount, total, onBack, onNext, loading }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
      className="space-y-6"
    >
      <h2 className="font-serif text-xl text-white">Review Order</h2>

      {/* Items */}
      <div className="space-y-3">
        {items.map((item) => (
          <div key={`${item._id}-${item.volume}`} className="flex gap-3 p-3 rounded-xl bg-white/[0.03] border border-[rgba(212,175,55,0.08)]">
            <div className="relative w-14 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-[#1A1A1A]">
              {item.image ? (
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-2xl opacity-20">🌸</div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-[#D4AF37] font-semibold tracking-widest">{item.brand}</p>
              <p className="text-sm text-white font-medium line-clamp-1">{item.name}</p>
              {item.volume && <p className="text-[10px] text-[#B8B8B8]">{item.volume}</p>}
              <p className="text-sm text-white mt-1">
                ₹{item.price.toLocaleString("en-IN")} × {item.quantity}
              </p>
            </div>
            <p className="text-sm font-semibold text-white self-center">
              ₹{(item.price * item.quantity).toLocaleString("en-IN")}
            </p>
          </div>
        ))}
      </div>

      {/* Shipping address summary */}
      <div className="p-4 rounded-xl bg-white/[0.03] border border-[rgba(212,175,55,0.08)]">
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="w-4 h-4 text-[#D4AF37]" />
          <p className="text-xs font-semibold text-[#D4AF37] uppercase tracking-widest">Deliver to</p>
        </div>
        <p className="text-sm text-white font-medium">{address.fullName}</p>
        <p className="text-xs text-[#B8B8B8] mt-0.5">
          {address.line1}{address.line2 ? `, ${address.line2}` : ""}, {address.city}, {address.state} - {address.pincode}
        </p>
        <p className="text-xs text-[#B8B8B8]">{address.phone}</p>
      </div>

      {/* Price summary */}
      <div className="space-y-2 text-sm border-t border-[rgba(212,175,55,0.08)] pt-4">
        <div className="flex justify-between text-[#B8B8B8]">
          <span>Subtotal</span><span>₹{subtotal.toLocaleString("en-IN")}</span>
        </div>
        {couponDiscount > 0 && (
          <div className="flex justify-between text-green-400">
            <span>Coupon discount</span><span>-₹{couponDiscount.toLocaleString("en-IN")}</span>
          </div>
        )}
        <div className="flex justify-between text-[#B8B8B8]">
          <span>Shipping</span>
          <span className={shipping === 0 ? "text-green-400" : ""}>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
        </div>
        <div className="flex justify-between text-white font-semibold text-base border-t border-[rgba(212,175,55,0.1)] pt-2">
          <span>Total</span>
          <span className="text-gradient-gold text-lg">₹{total.toLocaleString("en-IN")}</span>
        </div>
      </div>

      <div className="flex gap-3">
        <GoldButton variant="outline" onClick={onBack} className="flex-1">← Back</GoldButton>
        <GoldButton onClick={onNext} className="flex-2 flex-1" disabled={loading}>
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              Processing…
            </span>
          ) : (
            <span className="flex items-center gap-2"><Lock className="w-4 h-4" /> Pay ₹{total.toLocaleString("en-IN")}</span>
          )}
        </GoldButton>
      </div>
    </motion.div>
  );
}

/* ── Success step ───────────────────────────────────────────────── */
function SuccessStep({ orderNumber }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-8 space-y-5"
    >
      <motion.div
        animate={{ scale: [0.5, 1.2, 1], opacity: [0, 1, 1] }}
        transition={{ duration: 0.6 }}
        className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 border-2 border-green-500/30"
      >
        <CheckCircle className="w-10 h-10 text-green-400" />
      </motion.div>
      <div>
        <h2 className="font-serif text-2xl text-white mb-2">Order Confirmed!</h2>
        <p className="text-[#B8B8B8] text-sm">Thank you for your purchase. Your order has been placed successfully.</p>
      </div>
      <div className="luxury-card p-4 inline-block">
        <p className="text-xs text-[#D4AF37] uppercase tracking-widest mb-1">Order Number</p>
        <p className="font-mono text-white font-semibold text-lg">{orderNumber}</p>
      </div>
      <p className="text-[#B8B8B8] text-xs">You will receive a confirmation email shortly.</p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
        <Link href="/account/orders"><GoldButton>Track Your Order</GoldButton></Link>
        <Link href="/shop"><GoldButton variant="outline">Continue Shopping</GoldButton></Link>
      </div>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════════
   MAIN CHECKOUT PAGE
   ════════════════════════════════════════════════════════════════ */
export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, couponDiscount, couponCode, clearCart, clearCoupon } = useCartStore();
  const { addToast } = useUIStore();

  const [step,        setStep]        = useState(1);
  const [address,     setAddress]     = useState(EMPTY_ADDR);
  const [giftWrap,    setGiftWrap]    = useState(false);
  const [giftMessage, setGiftMessage] = useState("");
  const [loading,     setLoading]     = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);

  const subtotal = getSubtotal();
  const shipping = subtotal - (couponDiscount ?? 0) >= 1999 ? 0 : 149;
  const discount = couponDiscount ?? 0;
  const total    = subtotal - discount + shipping;

  // Redirect if cart empty and not on success step
  useEffect(() => {
    if (items.length === 0 && step !== 3 && !orderNumber) {
      router.replace("/cart");
    }
  }, [items, step, orderNumber, router]);

  // Load Razorpay checkout.js script once
  useEffect(() => {
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.async = true;
    document.body.appendChild(s);
    return () => { document.body.removeChild(s); };
  }, []);

  const handlePayment = async () => {
    setLoading(true);
    try {
      // 1. Create order on server
      const checkoutRes = await fetch("/api/checkout", {
        method : "POST",
        headers: { "Content-Type": "application/json" },
        body   : JSON.stringify({
          items: items.map((i) => ({
            productId: i._id,
            name      : i.name,
            image     : i.image,
            price     : i.price,
            quantity  : i.quantity,
            volume    : i.volume,
          })),
          shippingAddress: address,
          couponCode,
          giftWrap,
          giftMessage,
        }),
      });

      const checkoutData = await checkoutRes.json();
      if (!checkoutRes.ok) throw new Error(checkoutData.error);

      // 2. If Razorpay not configured, show test success
      if (checkoutData.razorpayMissing) {
        setOrderNumber(checkoutData.orderNumber);
        clearCart();
        clearCoupon();
        setStep(3);
        setLoading(false);
        return;
      }

      // 3. Open Razorpay modal
      const options = {
        key         : checkoutData.key,
        amount      : checkoutData.amount * 100,
        currency    : "INR",
        name        : "LUXEURE",
        description : "Luxury Fragrances",
        image       : "/favicon.ico",
        order_id    : checkoutData.razorpayOrderId,
        prefill     : {
          ...checkoutData.prefill,
          // vpa field pre-fills UPI ID if available
          method: "upi",
        },
        config: {
          display: {
            blocks: {
              utib: { // UPI block shown first
                name: "Pay via UPI",
                instruments: [
                  { method: "upi" },
                ],
              },
              other: {
                name: "Other Payment Modes",
                instruments: [
                  { method: "card" },
                  { method: "netbanking" },
                  { method: "wallet" },
                ],
              },
            },
            sequence: ["block.utib", "block.other"],
            preferences: {
              show_default_blocks: false,
            },
          },
        },
        theme       : { color: "#D4AF37" },
        modal       : {
          ondismiss: () => {
            addToast({ type: "info", message: "Payment cancelled. Your order is saved." });
            setLoading(false);
          },
        },
        handler: async (response) => {
          // 4. Verify payment on server
          const verifyRes = await fetch("/api/payments/verify", {
            method : "POST",
            headers: { "Content-Type": "application/json" },
            body   : JSON.stringify({
              razorpay_order_id  : response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature : response.razorpay_signature,
              orderId            : checkoutData.orderId,
            }),
          });
          const verifyData = await verifyRes.json();

          if (!verifyRes.ok) {
            addToast({ type: "error", message: verifyData.error });
            setLoading(false);
            return;
          }

          // 5. Success
          setOrderNumber(verifyData.orderNumber);
          clearCart();
          clearCoupon();
          setStep(3);
          setLoading(false);
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response) => {
        addToast({ type: "error", message: `Payment failed: ${response.error.description}` });
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      addToast({ type: "error", message: err.message || "Checkout failed. Please try again." });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#A8891C] flex items-center justify-center">
              <span className="text-black text-xs font-bold">✦</span>
            </div>
            <span className="font-serif text-xl text-white tracking-[0.15em]">LUXEURE</span>
          </Link>
          <h1 className="font-serif text-3xl text-white">Secure Checkout</h1>
          <p className="text-[#B8B8B8] text-xs mt-1 flex items-center justify-center gap-1">
            <Lock className="w-3 h-3" /> 256-bit SSL encrypted
          </p>
        </div>

        {/* Step indicator */}
        {step < 3 && <StepIndicator current={step} />}

        {/* Step content */}
        <div className="luxury-card p-6 sm:p-8">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <AddressStep
                key="step1"
                address={address}
                setAddress={setAddress}
                onNext={() => setStep(2)}
              />
            )}
            {step === 2 && (
              <ReviewStep
                key="step2"
                items={items}
                address={address}
                subtotal={subtotal}
                shipping={shipping}
                couponDiscount={discount}
                total={total}
                onBack={() => setStep(1)}
                onNext={handlePayment}
                loading={loading}
              />
            )}
            {step === 3 && (
              <SuccessStep key="step3" orderNumber={orderNumber} />
            )}
          </AnimatePresence>
        </div>

        {/* Gift wrap option (step 1 and 2) */}
        {step < 3 && (
          <div className="mt-4 p-4 luxury-card flex items-start gap-3">
            <input
              id="giftWrap"
              type="checkbox"
              checked={giftWrap}
              onChange={(e) => setGiftWrap(e.target.checked)}
              className="mt-0.5 accent-[#D4AF37] w-4 h-4"
            />
            <div className="flex-1">
              <label htmlFor="giftWrap" className="text-sm text-white cursor-pointer">
                🎁 Add luxury gift wrapping <span className="text-[#D4AF37] font-semibold">FREE</span>
              </label>
              {giftWrap && (
                <textarea
                  value={giftMessage}
                  onChange={(e) => setGiftMessage(e.target.value)}
                  placeholder="Add a personal message (optional)…"
                  maxLength={200}
                  rows={2}
                  className="w-full mt-2 px-3 py-2 bg-[rgba(255,255,255,0.04)] border border-[rgba(212,175,55,0.12)] text-white text-xs rounded-xl focus:outline-none focus:border-[rgba(212,175,55,0.3)] resize-none placeholder:text-[#B8B8B8]/40"
                />
              )}
            </div>
          </div>
        )}

        {/* Trust badges */}
        {step < 3 && (
          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              { icon: ShieldCheck, text: "100% Authentic" },
              { icon: Truck,       text: "Express Delivery" },
              { icon: RotateCcw,   text: "30-Day Returns" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex flex-col items-center gap-1.5 p-3 rounded-xl glass border border-[rgba(212,175,55,0.08)] text-center">
                <Icon className="w-4 h-4 text-[#D4AF37]" />
                <p className="text-[10px] text-[#B8B8B8]">{text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
