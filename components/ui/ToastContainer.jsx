"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";
import useUIStore from "@/store/useUIStore";

const icons = {
  success : <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />,
  error   : <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />,
  info    : <Info className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />,
  warning : <AlertCircle className="w-4 h-4 text-orange-400 flex-shrink-0" />,
};

function Toast({ toast }) {
  const removeToast = useUIStore((s) => s.removeToast);

  useEffect(() => {
    const t = setTimeout(() => removeToast(toast.id), toast.duration ?? 3000);
    return () => clearTimeout(t);
  }, [toast.id, toast.duration, removeToast]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0,  scale: 1 }}
      exit  ={{ opacity: 0, y: -8,  scale: 0.95 }}
      transition={{ type: "spring", damping: 24, stiffness: 300 }}
      className="flex items-start gap-3 px-4 py-3 glass-dark rounded-xl border border-[rgba(212,175,55,0.12)] shadow-2xl max-w-sm w-full"
    >
      {icons[toast.type] ?? icons.info}
      <p className="text-sm text-white flex-1 leading-snug">{toast.message}</p>
      <button
        onClick={() => removeToast(toast.id)}
        className="text-[#B8B8B8] hover:text-white transition-colors mt-0.5"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
}

export default function ToastContainer() {
  const toasts = useUIStore((s) => s.toasts);

  return (
    <div className="fixed bottom-6 right-4 sm:right-6 z-[100] flex flex-col gap-2 items-end">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
    </div>
  );
}
