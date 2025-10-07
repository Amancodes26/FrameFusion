import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/prisma";

// GET: Retrieve shared post by shareId
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shareId: string }> }
) {
  try {
    const { shareId } = await params;

    const post = await prisma.post.findUnique({
      where: {
        shareId: shareId,
        isPublic: true,
      },
      include: {
        User: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json(
        { error: "Post not found or not public" },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching shared post:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}