// fetch prompts fromm db using post model
import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "You are Unauthorized" }, { status: 401 });
  }
  const id = session.user.id;

  //fetch prompts from post 
    try {
        const topPrompts = await prisma.post.groupBy({
            by:['prompt'],
            _count:{
                prompt:true
            },
            where:{userId:id},
            orderBy:{
                _count:{
                    prompt:'desc'
                }
            },
            take:5
        })
        return NextResponse.json({ topPrompts: topPrompts.map(p=>({ prompt: p.prompt, count: p._count.prompt })) });
  } catch {
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}




