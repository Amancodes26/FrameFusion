"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="w-full min-h-dvh flex flex-col justify-center items-center bg-gradient-to-b from-background to-background/50">
      <div className="max-w-2xl mx-auto text-center space-y-8 px-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight bg-gradient-to-b from-white to-white/75 bg-clip-text text-transparent"
        >
          FusionFrame
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg sm:text-xl text-muted-foreground max-w-prose mx-auto"
        >
          Generate High-Quality images with AI-powered technology
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex justify-center"
        >
          <Link href="/create" className="inline-block">
            <Button className="px-8 py-6 text-lg font-medium rounded-full hover:scale-105 transition-transform">
              Get Started
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
