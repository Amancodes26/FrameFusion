import Razorpay from "razorpay";
import { NextResponse } from "next/server";
import { console } from "inspector";
const razorpay = new Razorpay({
    key_id:process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
    key_secret:process.env.RAZORPAY_KEY_SECRET!,
});

export async function  POST(req:Request) {
    try {
        const{amount ,currency} = await req.json();

        const options={
            amount:amount,
            currency:currency||"INR",
            receipt:`receipt_${Date.now()}`,
        };
        const order = await razorpay.orders.create(options);
        return NextResponse.json(order);
    } catch (error) {
        console.error(error);
        return NextResponse.json({error:"Error creating Razorpay order"},{status:500});
    }
}