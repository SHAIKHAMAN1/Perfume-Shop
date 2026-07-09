"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowLeft, Package, Truck, CheckCircle, XCircle,
  MapPin, CreditCard, Clock, AlertCircle,
} from "lucide-react";
import GoldButton from "@/components/ui/GoldButton";
import { ProductDetailSkeleton } from "@/components/ui/LoadingSkeleton";
import useUIStore from "@/store/useUIStore";

const STATUS_STEPS = ["pending", "confirmed", "packed", "dispatched", "out_for_delivery", "shipped", "delivered"];

const STATUS_MAP = {
  pending         : { label: "Pending",          color: "text-yellow-400", icon: Clock },
  confirmed       : { label: "Confirmed",         color: "text-blue-400",   icon: CheckCircle },
  packed          : { label: "Packed",            color: "text-purple-400", icon: Package },
  dispatched      : { label: "Dispatched",        color: "text-orange-400", icon: Truck },
  out_for_delivery: { label: "Out for Delivery",  color: "text-cyan-400",   icon: Truck },
  shipped         : { label: "Shipped",           color: "text-orange-400", icon: Truck },
  delivered       : { label: "Delivered",         color: "text-green-400",  icon: CheckCircle },
  cancelled       : { label: "Cancelled",         color: "text-red-400",    icon: XCircle },
  returned        : { label: "Returned",          color: "text-red-400",    icon: XCircle },
  refunded        : { label: "Refunded",          color: "text-gray-400",   icon: CheckCircle },
};

function ProgressTracker({ status }) {
  const isCancelled = status === "cancelled" || status === "returned" || status === "refunded";
  const currentIdx  = STATUS_STEPS.indexOf(status);

  if (isCancelled) {
    return (
      <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
        <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
        <p className="text-sm text-red-400 font-medium">Order {status}</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex items-center justify-between">
        {STATUS_STEPS.map((s, i) => {
          const done   = i <= currentIdx;
          const active = i === currentIdx;
          const StatusIcon = STATUS_MAP[s]?.icon ?? CheckCircle;
          return (
            <div key={s} className="flex flex-col items-center gap-1.5 flex-1">
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center z-10 relative transition-all duration-500 ${
                done
                  ? "border-[#D4AF37] bg-[#D4AF37]"
                  : "border-[rgba(212,175,55,0.2)] bg-transparent"
              }`}>
                <StatusIcon className={`w-3.5 h-3.5 ${done ? "text-black" : "text-[#B8B8B8]/40"}`} />
              </div>
              <span className={`text-[9px] text-center ${active ? "text-[#D4AF37] font-semibold" : done ? "text-[#D4AF37]/60" : "text-[#B8B8B8]/40"}`}>
                {STATUS_MAP[s]?.label ?? s}
              </span>
            </div>
          );
        })}
      </div>
      {/* Connector line */}
      <div className="absolute top-4 left-4 right-4 h-0.5 bg-[rgba(212,175,55,0.1)] -z-0">
        <motion.div
          className="h-full bg-[#D4AF37]"
          initial={{ width: "0%" }}
          animate={{ width: `${Math.max(0, (currentIdx / (STATUS_STEPS.length - 1)) * 100)}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

export default function OrderDetailPage() {
  const { id }    = useParams();
  const router    = useRouter();
  const addToast  = useUIStore((s) => s.addToast);
  const [order,   setOrder]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/orders/${id}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (data.order) setOrder(data.order);
        else addToast({ type: "error", message: "Order not found." });
      })
      .catch(() => addToast({ type: "error", message: "Failed to load order." }))
      .finally(() => setLoading(false));
  }, [id]);

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    setCancelling(true);
    try {
      const res  = await fetch(`/api/orders/${id}`, {
        method : "PATCH",
        headers: { "Content-Type": "application/json" },
        body   : JSON.stringify({ action: "cancel" }),
      });
      const data = await res.json();
      if (res.ok) {
        addToast({ type: "success", message: "Order cancelled successfully." });
        setOrder((o) => ({ ...o, status: "cancelled" }));
      } else {
        addToast({ type: "error", message: data.error });
      }
    } catch {
      addToast({ type: "error", message: "Failed to cancel order." });
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return <div className="max-w-3xl mx-auto px-4 py-10"><ProductDetailSkeleton /></div>;
  }
  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h2 className="font-serif text-xl text-white mb-3">Order not found</h2>
        <Link href="/account/orders"><GoldButton variant="outline">Back to Orders</GoldButton></Link>
      </div>
    );
  }

  const canCancel = ["pending", "confirmed"].includes(order.status);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => router.back()} className="text-[#B8B8B8] hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <p className="text-[10px] tracking-[0.4em] text-[#D4AF37] uppercase font-semibold">Order Detail</p>
          <h1 className="font-mono text-xl text-white">{order.orderNumber}</h1>
        </div>
        {canCancel && (
          <GoldButton
            variant="outline"
            size="sm"
            onClick={handleCancel}
            disabled={cancelling}
            className="border-red-500/40 text-red-400 hover:bg-red-500/5"
          >
            {cancelling ? "Cancelling…" : "Cancel Order"}
          </GoldButton>
        )}
      </div>

      <div className="space-y-5">
        {/* Progress tracker */}
        <div className="luxury-card p-5 sm:p-6">
          <h2 className="font-semibold text-white mb-5 text-sm">Order Status</h2>
          <ProgressTracker status={order.status} />
          {order.trackingNumber && (
            <div className="mt-4 p-3 bg-[rgba(212,175,55,0.06)] border border-[rgba(212,175,55,0.15)] rounded-xl">
              <p className="text-xs text-[#D4AF37] font-semibold mb-0.5">Tracking Number</p>
              <p className="font-mono text-white text-sm">{order.trackingNumber}</p>
              {order.trackingUrl && (
                <a href={order.trackingUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-[#D4AF37] underline mt-1 block">
                  Track on courier site →
                </a>
              )}
            </div>
          )}
        </div>

        {/* Items */}
        <div className="luxury-card p-5 sm:p-6">
          <h2 className="font-semibold text-white mb-4 text-sm">Items Ordered</h2>
          <div className="space-y-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex gap-3">
                <div className="relative w-14 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-[#1A1A1A]">
                  {item.image ? (
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-2xl opacity-20">🌸</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium line-clamp-2">{item.name}</p>
                  {item.volume && <p className="text-xs text-[#B8B8B8]">{item.volume}</p>}
                  <p className="text-xs text-[#B8B8B8]">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-semibold text-white self-center">
                  ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Price breakdown */}
        <div className="luxury-card p-5 sm:p-6">
          <h2 className="font-semibold text-white mb-4 text-sm flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-[#D4AF37]" /> Payment Summary
          </h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-[#B8B8B8]">
              <span>Subtotal</span><span>₹{order.subtotal.toLocaleString("en-IN")}</span>
            </div>
            {order.couponDiscount > 0 && (
              <div className="flex justify-between text-green-400">
                <span>Coupon ({order.couponCode})</span>
                <span>-₹{order.couponDiscount.toLocaleString("en-IN")}</span>
              </div>
            )}
            <div className="flex justify-between text-[#B8B8B8]">
              <span>Shipping</span>
              <span className={order.shippingCharge === 0 ? "text-green-400" : ""}>
                {order.shippingCharge === 0 ? "FREE" : `₹${order.shippingCharge}`}
              </span>
            </div>
            <div className="flex justify-between text-white font-semibold text-base border-t border-[rgba(212,175,55,0.1)] pt-2">
              <span>Total Paid</span>
              <span className="text-gradient-gold">₹{order.total.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-[#B8B8B8] text-xs pt-1">
              <span>Payment Method</span>
              <span className="capitalize">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[#B8B8B8]">Payment Status</span>
              <span className={order.paymentStatus === "paid" ? "text-green-400" : "text-yellow-400"}>
                {order.paymentStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Shipping address */}
        <div className="luxury-card p-5 sm:p-6">
          <h2 className="font-semibold text-white mb-3 text-sm flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#D4AF37]" /> Shipping Address
          </h2>
          <p className="text-sm text-white font-medium">{order.shippingAddress.fullName}</p>
          <p className="text-xs text-[#B8B8B8] mt-0.5 leading-relaxed">
            {order.shippingAddress.line1}
            {order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ""}<br />
            {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}<br />
            📞 {order.shippingAddress.phone}
          </p>
        </div>

        {/* Timeline */}
        {order.timeline?.length > 0 && (
          <div className="luxury-card p-5 sm:p-6">
            <h2 className="font-semibold text-white mb-4 text-sm">Order Timeline</h2>
            <div className="space-y-3">
              {[...order.timeline].reverse().map((event, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-[#D4AF37] flex-shrink-0 mt-1.5" />
                    {i < order.timeline.length - 1 && <div className="w-px flex-1 bg-[rgba(212,175,55,0.15)] min-h-4" />}
                  </div>
                  <div className="pb-3">
                    <p className="text-sm text-white font-medium">{STATUS_MAP[event.status]?.label ?? event.status}</p>
                    {event.message && <p className="text-xs text-[#B8B8B8]">{event.message}</p>}
                    <p className="text-[10px] text-[#B8B8B8]/50 mt-0.5">
                      {new Date(event.timestamp).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
