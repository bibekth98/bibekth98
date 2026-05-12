"use client";

import { motion } from "framer-motion";
import type { PropsWithChildren } from "react";

export function Reveal({ children }: PropsWithChildren) {
  return (
    <motion.div
      initial={false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
