"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Gold CTA button with shimmer hover, ripple effect, and multiple variants.
 *
 * @param {{ variant?: "gold"|"outline"|"ghost", size?: "sm"|"md"|"lg", children: React.ReactNode, className?: string } & React.ButtonHTMLAttributes} props
 */
export default function GoldButton({
  children,
  variant   = "gold",
  size      = "md",
  className,
  disabled,
  ...props
}) {
  const sizes = {
    sm: "px-5 py-2    text-xs tracking-widest",
    md: "px-7 py-3    text-sm tracking-widest",
    lg: "px-10 py-4   text-base tracking-widest",
  };

  const variants = {
    gold: `
      bg-gradient-to-r from-[#D4AF37] via-[#F0D060] to-[#A8891C]
      bg-[length:200%_100%] bg-left
      text-black font-semibold
      hover:bg-right
      shadow-[0_4px_20px_rgba(212,175,55,0.3)]
      hover:shadow-[0_6px_28px_rgba(212,175,55,0.45)]
    `,
    outline: `
      bg-transparent
      border border-[#D4AF37]/60 hover:border-[#D4AF37]
      text-[#D4AF37] font-medium
      hover:bg-[rgba(212,175,55,0.06)]
    `,
    ghost: `
      bg-transparent text-[#D4AF37] font-medium
      hover:text-white
    `,
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap  ={{ scale: disabled ? 1 : 0.97 }}
      disabled={disabled}
      className={cn(
        "relative inline-flex items-center justify-center gap-2",
        "rounded-full font-medium uppercase transition-all duration-300",
        "outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]/50",
        "overflow-hidden cursor-pointer",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        sizes[size],
        variants[variant],
        className
      )}
      {...props}
    >
      {/* Shimmer overlay */}
      {variant === "gold" && !disabled && (
        <span
          aria-hidden
          className="absolute inset-0 -skew-x-12 translate-x-[-200%] hover:translate-x-[200%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
        />
      )}
      {children}
    </motion.button>
  );
}
