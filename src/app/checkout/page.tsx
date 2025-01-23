"use client"
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from "lucide-react";

export default function Page() {
  const searchParams = useSearchParams();
  const amount = searchParams.get('amount');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading state
    setTimeout(() => setIsLoading(false), 1500);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-gray-800/50 p-8 rounded-2xl backdrop-blur-sm border border-gray-700">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-2">
            {isLoading ? "Processing" : "Payment Processing"}
          </h2>
          <p className="text-gray-400">
            {isLoading 
              ? "Please wait while we prepare your payment..."
              : "Your payment is being processed securely"}
          </p>
        </div>

        <div className="flex flex-col items-center justify-center space-y-6">
          {isLoading ? (
            <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
          ) : (
            <div className="space-y-4 w-full">
              <div className="flex justify-between items-center p-4 bg-gray-700/50 rounded-lg">
                <span className="text-gray-300">Amount</span>
                <span className="text-white font-bold">₹{amount || '0'}</span>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" />
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce delay-150" />
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce delay-300" />
                </div>
                <p className="text-sm text-center text-gray-400">
                  Please do not close this window
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="text-center space-y-2">
          <p className="text-sm text-gray-400">
            Secured by FrameFusion Payment System
          </p>
          <div className="flex justify-center gap-2">
            <div className="h-1 w-1 bg-green-500 rounded-full animate-ping" />
            <p className="text-xs text-green-500">Connection secure</p>
          </div>
        </div>
      </div>
    </div>
  );
}
