import React from "react";
import { BiLoaderCircle } from "react-icons/bi";

export default function Loading() {
  return (
    <div className="w-full h-dvh flex justify-center items-center">
      <BiLoaderCircle className="animate-spin" />
    </div>
  );
}
