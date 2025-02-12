"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Star, Menu, X } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "./button";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import Image from "next/image";
import { BiLoaderCircle } from "react-icons/bi";

const navItems = [
  {
    name: "Create",
    link: "/create",
  },
  {
    name: "Pricing",
    link: "/pricing",
  },
  {
    name: "Demo",
    link: "#showcase",
  },
];

export function FloatingNav() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToShowcase = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.currentTarget.getAttribute('href') === '#showcase') {
      e.preventDefault();
      document.querySelector('#showcase')?.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 inset-x-0 h-16 border-b border-white/[0.1] bg-black/50 backdrop-blur-xl z-[100]"
    >
      <div className="max-w-7xl mx-auto h-full px-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 z-50">
          <Image 
            src="/images/logo1.png" 
            alt="FrameFusion" 
            width={40} 
            height={40}
            className="rounded-lg"
          />
          <span className="font-bold text-xl bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">
            FrameFusion
          </span>
        </Link>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden z-50"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-6">
          {navItems.map((item) => (
            <Link key={item.name} href={item.link} onClick={scrollToShowcase}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-2 hover:text-pink-500 transition-colors"
              >
                {item.name}
              </motion.div>
            </Link>
          ))}
          
          <Link 
            href="https://github.com/Amancodes26/framefusion"
            target="_blank"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-3 py-2 text-yellow-400 hover:text-yellow-300"
            >
              <Star className="w-4 h-4" />
              Star
            </motion.div>
          </Link>

          {/* Desktop Auth Section */}
          <div className="flex items-center gap-4 pl-4 border-l border-white/[0.1]">
            {status === "loading" ? (
              <BiLoaderCircle className="animate-spin" />
            ) : !session ? (
              <Button 
                onClick={() => signIn("google")}
                className="bg-gradient-to-r from-pink-600 to-orange-500 hover:opacity-90"
              >
                Login
              </Button>
            ) : (
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => signOut()}
                  className="border-pink-500/20 hover:border-pink-500/40"
                >
                  Logout
                </Button>
                <Link href="/profile">
                  <Avatar className="border-2 border-pink-500/20 hover:border-pink-500/40 transition-colors">
                    <AvatarImage src={session.user?.image || ""} />
                    <AvatarFallback>
                      {session.user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed inset-0 top-16 bg-background/95 backdrop-blur-sm lg:hidden z-40"
            >
              <div className="flex flex-col items-center gap-6 p-8">
                {navItems.map((item) => (
                  <Link 
                    key={item.name} 
                    href={item.link} 
                    onClick={(e) => {
                      scrollToShowcase(e);
                      setIsMenuOpen(false);
                    }}
                  >
                    <motion.div
                      whileTap={{ scale: 0.95 }}
                      className="text-lg font-medium hover:text-pink-500 transition-colors"
                    >
                      {item.name}
                    </motion.div>
                  </Link>
                ))}
                
                <Link 
                  href="https://github.com/Amancodes26/framefusion"
                  target="_blank"
                  className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Star className="w-5 h-5" />
                  Star on GitHub
                </Link>

                {/* Mobile Auth Section */}
                <div className="flex flex-col items-center gap-4 pt-4 border-t border-white/[0.1] w-full">
                  {status === "loading" ? (
                    <BiLoaderCircle className="animate-spin" />
                  ) : !session ? (
                    <Button 
                      onClick={() => {
                        signIn("google");
                        setIsMenuOpen(false);
                      }}
                      className="w-full bg-gradient-to-r from-pink-600 to-orange-500 hover:opacity-90"
                    >
                      Login
                    </Button>
                  ) : (
                    <div className="flex flex-col items-center gap-4 w-full">
                      <Link 
                        href="/profile" 
                        className="flex items-center gap-3"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Avatar className="border-2 border-pink-500/20">
                          <AvatarImage src={session.user?.image || ""} />
                          <AvatarFallback>
                            {session.user?.name?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{session.user?.name}</span>
                      </Link>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          signOut();
                          setIsMenuOpen(false);
                        }}
                        className="w-full border-pink-500/20 hover:border-pink-500/40"
                      >
                        Logout
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
