"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { ImageCarousel } from "@/components/home/ImageCarousel";
import { SplashCursor } from "@/components/ui/splash-cursor";

export default function Home() {
  return (
    <div className="w-full overflow-x-hidden">
      <SplashCursor />
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-pink-500/5 to-orange-500/5" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(217,70,219,0.15),rgba(255,255,255,0))]" />
        <div className="relative max-w-2xl mx-auto text-center space-y-8 px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight"
          >
            Transform Ideas into{" "}
            <span className="bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent relative group cursor-default">
              Art
              <span className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-orange-500/20 blur-xl group-hover:opacity-100 opacity-0 transition-opacity duration-500" />
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl text-muted-foreground"
          >
            Create stunning visuals with AI-powered technology
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex justify-center"
          >
            <Link href="/create">
              <Button size="lg" className="rounded-full px-8 py-6 text-lg group">
                <Sparkles className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                Start Creating
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Image Showcase Section */}
      <section id="showcase" className="py-20 scroll-mt-32 overflow-hidden"> {/* Added overflow-hidden */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 overflow-hidden"> {/* Added overflow-hidden */}
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">
            Created with FrameFusion
          </h2>
          <ImageCarousel />
        </motion.div>
      </section>

      {/* Floating Navigation */}
      <FloatingNav />
    </div>
  );
}
