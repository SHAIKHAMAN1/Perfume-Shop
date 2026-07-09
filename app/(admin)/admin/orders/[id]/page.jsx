"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, CreditCard, Package, Truck, Save } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import useUIStore from "@/store/useUIStore";
import GoldButton from "@/components/ui/GoldButton";

const ALL_STATUSES = ["pending","confirmed","packed","dispatched","out_for_delivery","shipped","delivered","cancelled","returned","refunded"];
const STATUS_LABELS = {
  pending         : "Pending",
  confirmed       : "Confirmed",
  packed          : "Packed",
  dispatched      : "Dispatched",
  out_for_delivery: "Out for Delivery",
  shipped         : "Shipped",
  delivered       : "Delivered",
  cancelled       : "Cancelled",
  returned        : "Returned",
  refunded        : "Refunded",
};
const STATUS_COLORS = {
  pending         :"text-yellow-400",
  confirmed       :"text-blue-400",
  packed          :"text-purple-400",
  dispatched      :"text-orange-400",
  out_for_delivery:"text-cyan-400",
  shipped         :"text-orange-400",
  delivered       :"text-green-400",
  cancelled       :"text-red-400",
  returned        :"text-red-400",
  refunded        :"text-gray-400",
};

export default function AdminOrderDetailPage() {
  const { id }    = useParams();
  const router    = useRouter();
  const addToast  = useUIStore((s) => s.addToast);

  const [order,    setOrder]    = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [newStatus, setNewStatus] = useState("");
  const [tracking,  setTracking]  = useState({ number: "", url: "" });
  const [note,      setNote]      = useState("");
  const [saving,    setSaving]    = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/admin/orders/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.order) {
          setOrder(d.order);
          setNewStatus(d.order.status);
          setTracking({ number: d.order.trackingNumber ?? "", url: d.order.trackingUrl ?? "" });
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleUpdate = async () => {
    setSaving(true);
    try {
      const res  = await fetch(`/api/admin/orders/${id}`, {
        method : "PATCH",
        headers: { "Content-Type": "application/json" },
        body   : JSON.stringify({ status: newStatus, trackingNumber: tracking.number, trackingUrl: tracking.url, note }),
      });
      const data = await res.json();
      if (res.ok) {
        addToast({ type: "success", message: "Order updated successfully." });
        setOrder(data.order);
        setNote("");
      } else {
        addToast({ type: "error", message: data.error });
      }
    } catch { addToast({ type: "error", message: "Failed to update order." }); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="skeleton h-96 rounded-2xl" />;
  if (!order) return <div className="text-center py-20 text-[#B8B8B8]">Order not found.</div>;

  return (
    <div className="max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="text-[#B8B8B8] hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="font-mono text-xl text-white">{order.orderNumber}</h1>
          <p className="text-sm text-[#B8B8B8]">
            Placed {new Date(order.createdAt).toLocaleString("en-IN")} · Customer: {order.user?.name ?? "—"}
          </p>
        </div>
        <span className={`text-sm font-medium ${STATUS_COLORS[order.status]}`}>{STATUS_LABELS[order.status] ?? order.status}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left: items + address */}
        <div className="lg:col-span-2 space-y-5">
          {/* Items */}
          <div className="luxury-card p-5">
            <h2 className="font-medium text-white text-sm mb-4 flex items-center gap-2"><Package className="w-4 h-4 text-[#D4AF37]" /> Items</h2>
            <div className="space-y-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex gap-3">
                  <div className="relative w-12 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-[#1A1A1A]">
                    {item.image ? <Image src={item.image} alt={item.name} fill className="object-cover" />
                      : <div className="absolute inset-0 flex items-center justify-center text-xl opacity-20">🌸</div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium line-clamp-1">{item.name}</p>
                    {item.volume && <p className="text-xs text-[#B8B8B8]">{item.volume}</p>}
                    <p className="text-xs text-[#B8B8B8]">Qty: {item.quantity} · ₹{item.price.toLocaleString("en-IN")} each</p>
                  </div>
                  <p className="text-sm font-semibold text-white self-center">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping address */}
          <div className="luxury-card p-5">
            <h2 className="font-medium text-white text-sm mb-3 flex items-center gap-2"><MapPin className="w-4 h-4 text-[#D4AF37]" /> Shipping Address</h2>
            <p className="text-sm text-white font-medium">{order.shippingAddress.fullName}</p>
            <p className="text-xs text-[#B8B8B8] mt-1 leading-relaxed">
              {order.shippingAddress.line1}{order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ""}<br />
              {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}<br />
              📞 {order.shippingAddress.phone}
            </p>
          </div>

          {/* Timeline */}
          {order.timeline?.length > 0 && (
            <div className="luxury-card p-5">
              <h2 className="font-medium text-white text-sm mb-4">Timeline</h2>
              <div className="space-y-3">
                {[...order.timeline].reverse().map((ev, i) => (
                  <div key={i} className="flex gap-3 text-xs">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-1.5 flex-shrink-0" />
                    <div>
                      <p className="text-white font-medium capitalize">{ev.status}</p>
                      {ev.message && <p className="text-[#B8B8B8]">{ev.message}</p>}
                      <p className="text-[#B8B8B8]/50">{new Date(ev.timestamp).toLocaleString("en-IN")}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: actions + summary */}
        <div className="space-y-5">
          {/* Update order */}
          <div className="luxury-card p-5 space-y-4">
            <h2 className="font-medium text-white text-sm">Update Order</h2>
            <div>
              <label className="block text-xs text-[#D4AF37] font-semibold uppercase tracking-widest mb-1.5">Status</label>
              <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-3 py-2.5 bg-[rgba(255,255,255,0.04)] border border-[rgba(212,175,55,0.12)] text-white text-sm rounded-xl focus:outline-none appearance-none">
                {ALL_STATUSES.map((s) => <option key={s} value={s} className="bg-[#171717]">{STATUS_LABELS[s] ?? s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-[#D4AF37] font-semibold uppercase tracking-widest mb-1.5">Tracking Number</label>
              <input value={tracking.number} onChange={(e) => setTracking((t) => ({ ...t, number: e.target.value }))}
                placeholder="AWB / Tracking ID"
                className="w-full px-3 py-2.5 bg-[rgba(255,255,255,0.04)] border border-[rgba(212,175,55,0.12)] text-white text-sm rounded-xl focus:outline-none focus:border-[rgba(212,175,55,0.3)] placeholder:text-[#B8B8B8]/40"
              />
            </div>
            <div>
              <label className="block text-xs text-[#D4AF37] font-semibold uppercase tracking-widest mb-1.5">Tracking URL</label>
              <input value={tracking.url} onChange={(e) => setTracking((t) => ({ ...t, url: e.target.value }))}
                placeholder="https://shiprocket.co/…"
                className="w-full px-3 py-2.5 bg-[rgba(255,255,255,0.04)] border border-[rgba(212,175,55,0.12)] text-white text-sm rounded-xl focus:outline-none focus:border-[rgba(212,175,55,0.3)] placeholder:text-[#B8B8B8]/40"
              />
            </div>
            <div>
              <label className="block text-xs text-[#D4AF37] font-semibold uppercase tracking-widest mb-1.5">Note (optional)</label>
              <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2}
                placeholder="Internal note for the timeline…"
                className="w-full px-3 py-2.5 bg-[rgba(255,255,255,0.04)] border border-[rgba(212,175,55,0.12)] text-white text-sm rounded-xl focus:outline-none focus:border-[rgba(212,175,55,0.3)] placeholder:text-[#B8B8B8]/40 resize-none"
              />
            </div>
            <GoldButton className="w-full" onClick={handleUpdate} disabled={saving}>
              <Save className="w-4 h-4" /> {saving ? "Saving…" : "Save Changes"}
            </GoldButton>
          </div>

          {/* Payment summary */}
          <div className="luxury-card p-5">
            <h2 className="font-medium text-white text-sm mb-4 flex items-center gap-2"><CreditCard className="w-4 h-4 text-[#D4AF37]" /> Payment</h2>
            <div className="space-y-2 text-xs">
              {[
                ["Subtotal", `₹${order.subtotal.toLocaleString("en-IN")}`],
                ...(order.couponDiscount > 0 ? [["Coupon Discount", `-₹${order.couponDiscount.toLocaleString("en-IN")}`]] : []),
                ["Shipping", order.shippingCharge === 0 ? "FREE" : `₹${order.shippingCharge}`],
                ["Total", `₹${order.total.toLocaleString("en-IN")}`],
              ].map(([l, v]) => (
                <div key={l} className="flex justify-between text-[#B8B8B8]">
                  <span>{l}</span>
                  <span className={l === "Total" ? "text-white font-semibold text-sm" : ""}>{v}</span>
                </div>
              ))}
              <div className="flex justify-between text-[#B8B8B8] pt-2 border-t border-[rgba(212,175,55,0.08)]">
                <span>Payment Method</span><span className="capitalize">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#B8B8B8]">Payment Status</span>
                <span className={order.paymentStatus === "paid" ? "text-green-400" : "text-yellow-400"}>{order.paymentStatus}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
