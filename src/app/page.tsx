"use client";
import { motion } from "framer-motion";
import Link  from "next/link";
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="w-full h-dvh flex justify-center items-center">
      <div className="">
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
          className="text-4xl sm:text-6xl font-bold "
        >
          FusionFrame
        </motion.h1>
        <motion.p 
        initial={{
          opacity:0,
          scale:0.95,
          filter:"blur(10px)",
        }}
        animate={{
          opacity:1,
          scale:1,
          filter:"blur(0px)",

        }}
        transition={{ duration:0.35,delay:0.35 }}
        className="items-center text-white/60">Generate High-Quality images
        </motion.p>
        <motion.div initial={{
          opacity: 0,
          scale: 0.95,
          filter: "blur(10px)",
        }} 
        animate={{
          opacity: 1,
            scale: 1,
            filter: "blur(0px)",
        }}
        transition={{duration: 0.35, delay: 0.7}}
        >
          <Link href="/create" >
          <Button className=" items-center mt-3 font-bold p-5" >Comming Soon</Button>

          </Link>
        </motion.div>
      </div>
    </div>
  );
}
