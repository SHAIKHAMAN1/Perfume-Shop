"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

const variants = {
  hidden : { opacity: 0, y: 12 },
  enter  : { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  exit   : { opacity: 0, y: -8, transition: { duration: 0.2, ease: "easeIn" } },
};

/**
 * Wraps page content with a Framer Motion fade-slide transition.
 * Place this inside each page component or in the (store)/layout.
 */
export default function PageTransition({ children }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        variants={variants}
        initial="hidden"
        animate="enter"
        exit="exit"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
