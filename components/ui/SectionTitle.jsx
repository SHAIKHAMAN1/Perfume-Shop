"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Luxury section title with optional gold underline and subtitle.
 */
export default function SectionTitle({
  title,
  subtitle,
  center   = true,
  gold     = false,
  className,
}) {
  return (
    <motion.div
      initial   ={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport  ={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6 }}
      className={cn("mb-10 lg:mb-14", center && "text-center", className)}
    >
      {subtitle && (
        <p className="text-xs font-semibold tracking-[0.3em] text-[#D4AF37] uppercase mb-3">
          {subtitle}
        </p>
      )}
      <h2
        className={cn(
          "font-serif text-3xl sm:text-4xl lg:text-5xl font-light leading-tight",
          gold ? "text-gradient-gold" : "text-white"
        )}
      >
        {title}
      </h2>
      {/* Gold decorative underline */}
      <motion.div
        initial   ={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport  ={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        className={cn(
          "mt-4 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent",
          center ? "mx-auto w-24" : "w-24"
        )}
      />
    </motion.div>
  );
}
