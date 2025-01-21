"use client"
import React from "react";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <div className="text-center p-8 rounded-lg">
        <h1 className="text-6xl font-bold text-white mb-4">Coming Soon</h1>
        <p className="text-xl text-gray-400 mb-8">Our pricing plans are being crafted with care</p>
        <div className="flex items-center justify-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce delay-100"></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce delay-200"></div>
        </div>
      </div>
    </div>
  );
}
