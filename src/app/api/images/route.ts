import { authOptions } from "@/utils/authOptions";
import prisma from "@/utils/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 40;
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const { prompt } = await request.json();

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });
  if(!user){
    return  NextResponse.json({error:"NO USER FOUND"}, {status:401})
  }

  function generateRandomNumber(): number {
    return Math.floor(Math.random() * 100000000) + 1;
  }
  const randomSeed = generateRandomNumber();
  const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
    prompt
  )}?seed=${randomSeed}&width=512&height=512&noLogo=True`;

  await fetch(imageUrl);

  await prisma.post.create({
    data:{
      prompt:prompt,
      url:imageUrl,
      userId:session.user.id,
      seed:randomSeed,
    }
  })
  return NextResponse.json({ url: imageUrl });
}
