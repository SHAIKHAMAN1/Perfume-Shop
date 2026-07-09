"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Store, Truck, CreditCard, Bell, Shield, Save,
  CheckCircle,
} from "lucide-react";
import GoldButton from "@/components/ui/GoldButton";

const TABS = [
  { key: "store",    label: "Store",    icon: Store },
  { key: "shipping", label: "Shipping", icon: Truck },
  { key: "payment",  label: "Payment",  icon: CreditCard },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "security", label: "Security", icon: Shield },
];

function Field({ label, value, onChange, type = "text", placeholder = "", helpText = "" }) {
  return (
    <div>
      <label className="block text-xs text-[#D4AF37] font-semibold uppercase tracking-widest mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-white/5 border border-[rgba(212,175,55,0.12)] rounded-xl text-white text-sm focus:outline-none focus:border-[rgba(212,175,55,0.4)] transition-all placeholder:text-[#B8B8B8]/40"
      />
      {helpText && <p className="text-[10px] text-[#B8B8B8]/60 mt-1">{helpText}</p>}
    </div>
  );
}

function Toggle({ label, checked, onChange, desc }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div>
        <p className="text-sm text-white font-medium">{label}</p>
        {desc && <p className="text-xs text-[#B8B8B8] mt-0.5">{desc}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${checked ? "bg-[#D4AF37]" : "bg-white/10"}`}
      >
        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${checked ? "left-5" : "left-0.5"}`} />
      </button>
    </div>
  );
}

export default function AdminSettingsPage() {
  const [tab, setTab]     = useState("store");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  // Store settings
  const [storeName, setStoreName]         = useState("LUXEURE");
  const [storeEmail, setStoreEmail]       = useState("support@luxeure.in");
  const [storePhone, setStorePhone]       = useState("+91 98765 43210");
  const [storeCurrency, setStoreCurrency] = useState("INR");
  const [storeTagline, setStoreTagline]   = useState("Luxury Fragrances, Delivered.");

  // Shipping settings
  const [freeShipThreshold, setFreeShipThreshold] = useState("1999");
  const [shippingCharge, setShippingCharge]         = useState("149");
  const [codEnabled, setCodEnabled]                 = useState(false);
  const [codLimit, setCodLimit]                     = useState("5000");
  const [expressEnabled, setExpressEnabled]         = useState(true);

  // Payment settings
  const [razorpayEnabled, setRazorpayEnabled] = useState(true);
  const [upiEnabled, setUpiEnabled]           = useState(true);
  const [testMode, setTestMode]               = useState(true);

  // Notification settings
  const [orderNotif, setOrderNotif]   = useState(true);
  const [stockNotif, setStockNotif]   = useState(true);
  const [reviewNotif, setReviewNotif] = useState(true);
  const [lowStockThreshold, setLowStockThreshold] = useState("10");

  // Security
  const [twoFAEnabled, setTwoFAEnabled]   = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState("24");
  const [ipWhitelist, setIpWhitelist]     = useState("");

  useEffect(() => {
    // Load settings from API
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((d) => {
        if (d.storeName)           setStoreName(d.storeName);
        if (d.storeEmail)          setStoreEmail(d.storeEmail);
        if (d.storePhone)          setStorePhone(d.storePhone);
        if (d.freeShipThreshold)   setFreeShipThreshold(String(d.freeShipThreshold));
        if (d.shippingCharge)      setShippingCharge(String(d.shippingCharge));
        if (d.codEnabled != null)  setCodEnabled(d.codEnabled);
        if (d.upiEnabled != null)  setUpiEnabled(d.upiEnabled);
        if (d.orderNotif != null)  setOrderNotif(d.orderNotif);
        if (d.stockNotif != null)  setStockNotif(d.stockNotif);
        if (d.reviewNotif != null) setReviewNotif(d.reviewNotif);
        if (d.lowStockThreshold)   setLowStockThreshold(String(d.lowStockThreshold));
      })
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      storeName, storeEmail, storePhone, storeCurrency, storeTagline,
      freeShipThreshold: Number(freeShipThreshold),
      shippingCharge: Number(shippingCharge),
      codEnabled, codLimit: Number(codLimit), expressEnabled,
      razorpayEnabled, upiEnabled, testMode,
      orderNotif, stockNotif, reviewNotif, lowStockThreshold: Number(lowStockThreshold),
      twoFAEnabled, sessionTimeout: Number(sessionTimeout), ipWhitelist,
    };
    try {
      await fetch("/api/admin/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    } catch { /* ignore */ }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl text-white">Settings</h1>
          <p className="text-xs text-[#B8B8B8] mt-0.5">Configure your store preferences</p>
        </div>
        <GoldButton onClick={handleSave} disabled={saving}>
          {saved ? (
            <span className="flex items-center gap-2 text-green-400"><CheckCircle className="w-4 h-4" /> Saved!</span>
          ) : (
            <span className="flex items-center gap-2"><Save className="w-4 h-4" />{saving ? "Saving…" : "Save Changes"}</span>
          )}
        </GoldButton>
      </div>

      <div className="flex gap-6">
        {/* Tab bar */}
        <div className="w-48 flex-shrink-0 space-y-1">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setTab(key)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-colors text-left ${tab === key ? "bg-[rgba(212,175,55,0.12)] text-[#D4AF37]" : "text-[#B8B8B8] hover:text-white hover:bg-white/5"}`}>
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <motion.div key={tab} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
          className="flex-1 p-6 rounded-2xl border border-[rgba(212,175,55,0.1)] bg-white/[0.02] space-y-5">
          {tab === "store" && (
            <>
              <h2 className="font-serif text-lg text-white mb-4">Store Information</h2>
              <Field label="Store Name" value={storeName} onChange={setStoreName} placeholder="LUXEURE" />
              <Field label="Store Tagline" value={storeTagline} onChange={setStoreTagline} placeholder="Luxury Fragrances, Delivered." />
              <div className="grid grid-cols-2 gap-4">
                <Field label="Support Email" value={storeEmail} onChange={setStoreEmail} type="email" placeholder="support@luxeure.in" />
                <Field label="Support Phone" value={storePhone} onChange={setStorePhone} placeholder="+91 98765 43210" />
              </div>
              <Field label="Currency" value={storeCurrency} onChange={setStoreCurrency} placeholder="INR" helpText="Currency code used across the store" />
            </>
          )}

          {tab === "shipping" && (
            <>
              <h2 className="font-serif text-lg text-white mb-4">Shipping Configuration</h2>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Free Shipping Threshold (₹)" value={freeShipThreshold} onChange={setFreeShipThreshold} type="number"
                  helpText="Orders above this get free shipping" />
                <Field label="Standard Shipping Charge (₹)" value={shippingCharge} onChange={setShippingCharge} type="number" />
              </div>
              <div className="border-t border-[rgba(212,175,55,0.08)] pt-4 space-y-1">
                <Toggle label="Cash on Delivery (COD)" checked={codEnabled} onChange={setCodEnabled}
                  desc="Enable COD payment option at checkout" />
                {codEnabled && <Field label="COD Maximum Order Limit (₹)" value={codLimit} onChange={setCodLimit} type="number" />}
                <Toggle label="Express Delivery" checked={expressEnabled} onChange={setExpressEnabled}
                  desc="Show express delivery option at checkout" />
              </div>
            </>
          )}

          {tab === "payment" && (
            <>
              <h2 className="font-serif text-lg text-white mb-4">Payment Settings</h2>
              <div className="space-y-1 border border-[rgba(212,175,55,0.08)] rounded-xl p-4">
                <Toggle label="Razorpay Payments" checked={razorpayEnabled} onChange={setRazorpayEnabled}
                  desc="Accept card, netbanking, wallets, UPI via Razorpay" />
                <Toggle label="UPI Payments" checked={upiEnabled} onChange={setUpiEnabled}
                  desc="Show UPI as preferred payment option (PhonePe, GPay, Paytm)" />
                <Toggle label="Test Mode" checked={testMode} onChange={setTestMode}
                  desc="Use Razorpay test keys — disable in production" />
              </div>
              <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                <p className="text-xs text-amber-400">
                  ⚠️ Razorpay API keys are configured in your <code className="font-mono">.env.local</code> file.
                  Go to the Razorpay dashboard to manage your keys and webhooks.
                </p>
              </div>
            </>
          )}

          {tab === "notifications" && (
            <>
              <h2 className="font-serif text-lg text-white mb-4">Notification Preferences</h2>
              <div className="space-y-1 border border-[rgba(212,175,55,0.08)] rounded-xl p-4">
                <Toggle label="New Order Notifications" checked={orderNotif} onChange={setOrderNotif}
                  desc="Get notified when a new order is placed" />
                <Toggle label="Low Stock Alerts" checked={stockNotif} onChange={setStockNotif}
                  desc="Alert when product stock falls below threshold" />
                <Toggle label="New Review Notifications" checked={reviewNotif} onChange={setReviewNotif}
                  desc="Get notified of new product reviews awaiting moderation" />
              </div>
              {stockNotif && (
                <Field label="Low Stock Threshold" value={lowStockThreshold} onChange={setLowStockThreshold} type="number"
                  helpText="Send alert when stock falls at or below this number" />
              )}
            </>
          )}

          {tab === "security" && (
            <>
              <h2 className="font-serif text-lg text-white mb-4">Security Settings</h2>
              <div className="space-y-1 border border-[rgba(212,175,55,0.08)] rounded-xl p-4">
                <Toggle label="Two-Factor Authentication (2FA)" checked={twoFAEnabled} onChange={setTwoFAEnabled}
                  desc="Require 2FA for all admin accounts" />
              </div>
              <Field label="Session Timeout (hours)" value={sessionTimeout} onChange={setSessionTimeout} type="number"
                helpText="Admin sessions expire after this many hours" />
              <Field label="IP Whitelist" value={ipWhitelist} onChange={setIpWhitelist}
                placeholder="192.168.1.1, 10.0.0.0/24"
                helpText="Comma-separated IPs allowed to access admin panel (leave empty to allow all)" />
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
