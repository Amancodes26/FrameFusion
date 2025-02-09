"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import { BiLoaderCircle } from "react-icons/bi";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Image from "next/image";

export default function Header() {
  const [initialLoading, SetInitialLoading] = useState<boolean>(true);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status !== "loading") {
      SetInitialLoading(false);
    }
  }, [status, session]);
  return (
    <div className=" fixed top-0 w-full h-[60px] bg-black border-b border-white/60 p-3 flex justify-between items-center">
      <Link href="/" className="flex items-center gap-2">
        <Image 
          src="/images/logo1.png" // Changed from "/public/images/logo.png"
          alt="FrameFusion" 
          width={50} 
          height={50}
          className="rounded-lg"
        />
        <h2 className="font-bold text-xl">FrameFusion</h2>
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
      </div>
      {initialLoading && status == "loading" ? (
        <BiLoaderCircle className="animate-spin" />
      ) : !session ? (
        <div className="_menu">
          <Button onClick={() => signIn("google")}>Login</Button>
        </div>
      ) : (
        <div className="flex gap-3 justify-center items-center">
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
  );
}
