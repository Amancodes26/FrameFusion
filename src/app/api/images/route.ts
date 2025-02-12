import { authOptions } from "@/utils/authOptions";
import prisma from "@/utils/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 50;
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "You are Unauthorized" },
      { status: 401 },
    );
  }

  // Check if user has enough credits
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (user.credits <= 0) {
    return NextResponse.json(
      { error: "Insufficient credits. Please upgrade your plan." },
      { status: 403 }
    );
  }

  const { prompt } = await request.json();

  try {
    // Generate image...
    function generateRandomNumber(): number {
      return Math.floor(Math.random() * 100000000) + 1;
    }
    const randomSeed = generateRandomNumber();
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
      prompt,
    )}?seed=${randomSeed}&width=512&height=512&noLogo=True`;

    await fetch(imageUrl);

    // Deduct credits and create post in a transaction
    const updatedUser = await prisma.$transaction(async (tx) => {
      // Create the post
      await tx.post.create({
        data: {
          prompt: prompt,
          url: imageUrl,
          userId: session.user.id,
          seed: randomSeed,
        },
      });

      // Update user credits
      return await tx.user.update({
        where: { id: session.user.id },
        data: { credits: { decrement: 1 } },
      });
    });

    return NextResponse.json({ 
      url: imageUrl,
      credits: updatedUser.credits 
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "You are Unauthorized" },
      { status: 401 },
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "No user found" }, { status: 401 });
  }

  const posts = await prisma.post.findMany({
    where: {
      userId: user.id,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(posts);
}
