"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import { BiLoaderCircle } from "react-icons/bi";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Image from "next/image";
import { Star } from "lucide-react";
import CreditDisplay from './CreditDisplay';

export default function Header() {
  const [initialLoading, SetInitialLoading] = useState<boolean>(true);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status !== "loading") {
      SetInitialLoading(false);
    }
  }, [status, session]);
  return (
    <div className="fixed top-0 w-full h-[70px] bg-background/60 backdrop-blur-xl border-b border-white/10 p-3 flex justify-between items-center z-50">
      <Link href="/" className="flex items-center gap-2">
        <Image 
          src="/images/logo1.png" 
          alt="FrameFusion" 
          width={50} 
          height={50}
          className="rounded-lg"
        />
        <h2 className="font-bold text-xl"></h2>
      </Link>
      <div className="flex justify-center items-center gap-8">
        <Link href={"/"}>
          <h2 className="font-bold"> Home </h2>
        </Link>
        <Link href="/pricing">
          <h2 className="font-bold  ">Pricing</h2>
        </Link>
        <Link href="/about">
          <h2 className="font-bold  ">About</h2>
        </Link>
        <Link 
          href="https://github.com/Amancodes26/framefusion"
          target="_blank"
          className="relative group"
        >
          <div className="absolute -inset-2 bg-gradient-to-r from-pink-600 to-orange-500 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
          <div className="relative flex items-center gap-2 px-4 py-2 bg-black border border-red-500-500 rounded-lg leading-none">
            <Star className="w-4 h-4 text-yellow-400 animate-pulse" />
            <span className="text-gray-200 group-hover:text-white transition duration-200">
              Star on GitHub
            </span>
          </div>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        {session && <CreditDisplay />}
        {initialLoading && status == "loading" ? (
          <BiLoaderCircle className="animate-spin" />
        ) : !session ? (
          <div className="_menu">
            <Button onClick={() => signIn("google")}>Login</Button>
          </div>
        ) : (
          <div className="flex gap-4 justify-center items-center">
            <Button onClick={() => signOut()}>Logout</Button>
            <Link href={"/profile"}>
              <Avatar>
                <AvatarImage src={session.user?.image || ""} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
