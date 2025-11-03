import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import jwt from "jsonwebtoken";

// 1️⃣ Verify Google access token with Google servers
async function verifyGoogleAccessToken(accessToken: string) {
  try {
    const response = await fetch(
      `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${accessToken}`
    );
    const data = await response.json();

    if (!data || data.error) {
      throw new Error(data.error_description || "Invalid Google access token");
    }

    // Verify audience matches one of your client IDs
    const validClientIds = [
      process.env.GOOGLE_CLIENT_ID, // Web client ID
      process.env.ANDROID_CLIENT_ID, // Android client ID
    ].filter(Boolean);

    if (!validClientIds.includes(data.aud)) {
      throw new Error("Invalid client ID - token not issued for this application");
    }

    return data;
  } catch (error) {
    console.error("Token verification error:", error);
    throw error;
  }
}

// 2️⃣ Get user info from Google
async function getGoogleUserInfo(accessToken: string) {
  const response = await fetch(
    `https://www.googleapis.com/oauth2/v3/userinfo`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  
  if (!response.ok) {
    throw new Error("Failed to fetch user info from Google");
  }
  
  return await response.json();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { accessToken, userInfo } = body;

    if (!accessToken) {
      return NextResponse.json(
        { success: false, message: "Access token is required" },
        { status: 400 }
      );
    }

    // 3️⃣ Verify the Google access token
    const tokenInfo = await verifyGoogleAccessToken(accessToken);
    console.log("✅ Token verified for:", tokenInfo.email);

    // 4️⃣ Get user info (use provided userInfo or fetch fresh)
    const googleUser = userInfo || await getGoogleUserInfo(accessToken);

    // 5️⃣ Find or create user in Prisma
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
      console.log("✅ Created new user:", user.email);
    } else {
      console.log("✅ Found existing user:", user.email);
    }

    // 6️⃣ Generate a signed JWT (for mobile session)
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || "fallback-secret-change-in-production",
      { expiresIn: "7d" } // 7 days for mobile apps
    );

    // 7️⃣ Return response
    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.image,
      },
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
