"use client";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";

export default function Header() {
  return (
    <div className=" fixed top-0 w-full h-[60px] bg-black border-b border-white/60 p-3 flex justify-between items-center">
      <Link href="/">
        <h2 className="font-bold text-xl">FrameFusion</h2>
      </Link>
      <div className="_menu">
        <Button>Login</Button>
      </div>
    </div>
  );
}
