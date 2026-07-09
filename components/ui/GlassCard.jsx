"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Glassmorphism card wrapper.
 * @param {{ children: React.ReactNode, className?: string, hover?: boolean, gold?: boolean, animate?: boolean }} props
 */
export default function GlassCard({
  children,
  className,
  hover  = true,
  gold   = false,
  animate = true,
  delay  = 0,
  ...props
}) {
  const Wrapper = animate ? motion.div : "div";

  const animateProps = animate
    ? {
        initial   : { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport  : { once: true, margin: "-50px" },
        transition: { duration: 0.5, delay },
        ...(hover ? { whileHover: { y: -4, transition: { duration: 0.2 } } } : {}),
      }
    : {};

  return (
    <Wrapper
      {...animateProps}
      className={cn(
        "rounded-2xl transition-all duration-300",
        gold ? "glass-gold" : "glass",
        hover && "hover:border-[rgba(212,175,55,0.25)] hover:shadow-[0_8px_32px_rgba(212,175,55,0.08)]",
        className
      )}
      {...props}
    >
      {children}
    </Wrapper>
  );
}
