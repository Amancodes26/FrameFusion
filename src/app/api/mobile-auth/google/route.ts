import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import jwt from "jsonwebtoken";

// 1️⃣ Verify Google token directly with Google servers
async function verifyGoogleToken(idToken: string) {
  const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
  const data = await response.json();

  if (!data || data.error) {
    throw new Error("Invalid Google ID token");
  }

  if (data.aud !== process.env.GOOGLE_CLIENT_ID) {
    throw new Error("Invalid client ID");
  }

  return data;
}

export async function POST(req: Request) {
  try {
    const { idToken } = await req.json();

    // 2️⃣ Verify the Google ID token
    const googleUser = await verifyGoogleToken(idToken);

    // 3️⃣ Find or create user in Prisma
    let user = await prisma.user.findUnique({
      where: { email: googleUser.email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: googleUser.email,
          name: googleUser.name,
          image: googleUser.picture,
        },
      });
    }

    // 4️⃣ Generate a signed JWT (for mobile session)
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    // 5️⃣ Return response
    return NextResponse.json({
      success: true,
      token,
      user,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error("❌ Mobile Auth Error:", errorMessage);
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 400 }
    );
  }
}
