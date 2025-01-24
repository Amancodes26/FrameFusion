import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(request: NextRequest) {
  const { amount } = await request.json();

  const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  const payment_capture = 1;
  const currency = "INR";

  const options = {
    amount: amount,
    currency,
    payment_capture,
  };

  try {
    const response = await razorpay.orders.create(options);
    return NextResponse.json({
      orderId: response.id,
      currency: response.currency,
      amount: response.amount,
    });
  } catch (err: unknown) {
    console.error("Order creation failed:", err);
    return NextResponse.json(
      { message: "Error creating order" }, 
      { status: 500 }
    );
  }
}