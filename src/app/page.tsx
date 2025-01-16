"use client";
import { motion } from "framer-motion";
import Link  from "next/link";
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="w-full h-dvh flex justify-center items-center bg-background">
      <div className="flex flex-col items-center text-center">
        <motion.h1
          initial={{
            opacity: 0,
            scale: 0.95,
            filter: "blur(10px)",
          }}
          animate={{
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
          }}
          transition={{
            duration: 0.35,
            delay: 0,
          }}
          className="text-4xl sm:text-6xl font-bold mb-4"
        >
          FusionFrame
        </motion.h1>
        <motion.p 
          initial={{
            opacity: 0,
            scale: 0.95,
            filter: "blur(10px)",
          }}
          animate={{
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
          }}
          transition={{ duration: 0.35, delay: 0.35 }}
          className="text-white/60 text-lg mb-6"
        >
          Generate High-Quality Images
        </motion.p>
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.95,
            filter: "blur(10px)",
          }} 
          animate={{
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
          }}
          transition={{ duration: 0.35, delay: 0.7 }}
        >
          <Link href="/">
            <Button className="font-bold px-8 py-6 text-lg">Coming Soon</Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
