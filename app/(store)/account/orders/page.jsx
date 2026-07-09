"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Package, Clock, CheckCircle, Truck, XCircle,
  ChevronRight, ArrowLeft,
} from "lucide-react";
import Image from "next/image";
import GoldButton from "@/components/ui/GoldButton";
import { OrderCardSkeleton } from "@/components/ui/LoadingSkeleton";

const STATUS_MAP = {
  pending         : { label: "Pending",         color: "text-yellow-400", bg: "bg-yellow-500/10", icon: Clock },
  confirmed       : { label: "Confirmed",        color: "text-blue-400",   bg: "bg-blue-500/10",   icon: CheckCircle },
  packed          : { label: "Packed",           color: "text-purple-400", bg: "bg-purple-500/10", icon: Package },
  dispatched      : { label: "Dispatched",       color: "text-orange-400", bg: "bg-orange-500/10", icon: Truck },
  out_for_delivery: { label: "Out for Delivery", color: "text-cyan-400",   bg: "bg-cyan-500/10",   icon: Truck },
  shipped         : { label: "Shipped",          color: "text-orange-400", bg: "bg-orange-500/10", icon: Truck },
  delivered       : { label: "Delivered",        color: "text-green-400",  bg: "bg-green-500/10",  icon: CheckCircle },
  cancelled       : { label: "Cancelled",        color: "text-red-400",    bg: "bg-red-500/10",    icon: XCircle },
  returned        : { label: "Returned",         color: "text-red-400",    bg: "bg-red-500/10",    icon: XCircle },
  refunded        : { label: "Refunded",         color: "text-gray-400",   bg: "bg-gray-500/10",   icon: CheckCircle },
};

function OrderCard({ order }) {
  const status = STATUS_MAP[order.status] ?? STATUS_MAP.pending;
  const StatusIcon = status.icon;

  return (
    <Link href={`/account/orders/${order._id}`}>
      <motion.div
        whileHover={{ y: -2 }}
        className="luxury-card p-4 sm:p-5 cursor-pointer group"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <p className="text-[10px] text-[#B8B8B8] mb-0.5">Order Number</p>
            <p className="font-mono text-white font-medium text-sm">{order.orderNumber}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${status.bg} ${status.color}`}>
              <StatusIcon className="w-3 h-3" />
              {status.label}
            </span>
            <ChevronRight className="w-4 h-4 text-[#B8B8B8] group-hover:text-[#D4AF37] transition-colors" />
          </div>
        </div>

        {/* Item thumbnails */}
        <div className="flex items-center gap-2 mb-3">
          {order.items.slice(0, 4).map((item, i) => (
            <div key={i} className="relative w-10 h-12 rounded-lg overflow-hidden bg-[#1A1A1A] flex-shrink-0">
              {item.image ? (
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-lg opacity-20">🌸</div>
              )}
            </div>
          ))}
          {order.items.length > 4 && (
            <div className="w-10 h-12 rounded-lg bg-[#1A1A1A] flex items-center justify-center text-xs text-[#B8B8B8]">
              +{order.items.length - 4}
            </div>
          )}
          <div className="ml-2">
            <p className="text-xs text-[#B8B8B8]">{order.items.length} item{order.items.length > 1 ? "s" : ""}</p>
            <p className="text-sm font-semibold text-white">₹{order.total.toLocaleString("en-IN")}</p>
          </div>
        </div>

        <p className="text-[10px] text-[#B8B8B8]/60">
          Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
        </p>
      </motion.div>
    </Link>
  );
}

export default function OrdersPage() {
  const [orders,     setOrders]     = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    fetch("/api/orders", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        setOrders(data.orders ?? []);
        setPagination(data.pagination);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/account" className="text-[#B8B8B8] hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <p className="text-[10px] tracking-[0.4em] text-[#D4AF37] uppercase font-semibold">My Account</p>
          <h1 className="font-serif text-2xl sm:text-3xl text-white">Order History</h1>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <OrderCardSkeleton key={i} />
        ))}
      </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="font-serif text-xl text-white mb-2">No orders yet</h2>
          <p className="text-[#B8B8B8] text-sm mb-6">Your orders will appear here after you make a purchase.</p>
          <Link href="/shop"><GoldButton>Start Shopping</GoldButton></Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, i) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <OrderCard order={order} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
