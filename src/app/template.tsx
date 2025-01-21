"use client";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import React, { ReactNode } from "react";

export default function Template({ children }: { children: ReactNode }) {
  const path = usePathname();
  return (
    <motion.div
      key={path}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{
        duration: 0.3,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}
