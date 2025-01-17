"use client";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import React, { ReactNode } from "react";

export default function Template({ children }: { children: ReactNode }) {
  const path = usePathname();
  return (
    <motion.div
      key={path}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.35 }}
    >
      {children}
    </motion.div>
  );
}
