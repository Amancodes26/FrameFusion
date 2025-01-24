"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState, useRef } from "react";
import { Loader2 } from "lucide-react";
import Script from "next/script";

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayError {
  error: {
    description: string;
    // Add other error properties if needed
  };
}

interface RazorpayOptions {
  key: string | undefined;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string | undefined;
  handler: (response: RazorpayResponse) => Promise<void>;
  theme: {
    color: string;
  };
}

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const amount = searchParams.get("amount");
  const [isLoading, setIsLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const idRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!amount) {
      router.replace("/");
      return;
    }
    createOrderId();
    // Simulate initial loading state
    setTimeout(() => setIsLoading(false), 1500);
  }, [amount, router]);

  const createOrderId = async () => {
    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: parseFloat(amount!) * 100 }),
      });

      if (!response.ok) throw new Error("Failed to create order");
      const data = await response.json();
      idRef.current = data.orderId;
    } catch (error) {
      console.error("Order creation failed:", error);
    }
  };

  const processPayment = async () => {
    setPaymentLoading(true);
    try {
      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: parseFloat(amount!) * 100,
        currency: "INR",
        name: "FrameFusion",
        description: "Payment for FrameFusion subscription",
        order_id: idRef.current,
        handler: async (response: RazorpayResponse) => {
          const data = {
            orderCreationId: idRef.current,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
          };

          const result = await fetch("/api/verify", {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" },
          });
          const res = await result.json();
          if (res.isOk) {
            alert("Payment successful!");
            router.push("/"); // or wherever you want to redirect
          } else {
            alert(res.message);
          }
        },
        theme: { color: "#3399cc" },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.on("payment.failed", function (response: RazorpayError) {
        alert(response.error.description);
      });
      paymentObject.open();
    } catch (error) {
      console.error("Payment failed:", error);
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
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
              <span className="text-white font-bold">₹{amount || "0"}</span>
            </div>

            <button
              onClick={processPayment}
              disabled={paymentLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {paymentLoading ? (
                <Loader2 className="h-5 w-5 animate-spin mx-auto" />
              ) : (
                "Proceed to Payment"
              )}
            </button>

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
  );
}

export default function Page() {
  return (
    <>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <Suspense
          fallback={
            <div className="flex items-center justify-center">
              <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
            </div>
          }
        >
          <CheckoutContent />
        </Suspense>
      </div>
    </>
  );
}
