import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import prisma from "@/utils/prisma";
import { nanoid } from "nanoid";

// POST: Create or update share link for a post
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { postId } = await request.json();

    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    // Check if post belongs to the current user
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
        userId: session.user.id,
      },
    });

    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    // Generate shareId if it doesn't exist
    const shareId = post.shareId || nanoid(12);

    // Update post to make it public and add shareId
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        shareId: shareId,
        isPublic: true,
        sharedAt: new Date(),
      },
    });

    const shareUrl = `${process.env.NEXTAUTH_URL || "https://framefusionai.vercel.app"}/share/${shareId}`;

    return NextResponse.json({
      shareId,
      shareUrl,
      isPublic: updatedPost.isPublic,
    });
  } catch (error) {
    console.error("Error creating share link:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE: Remove share link (make post private)
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { postId } = await request.json();

    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    // Check if post belongs to the current user
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
        userId: session.user.id,
      },
    });

    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    // Make post private
    await prisma.post.update({
      where: { id: postId },
      data: {
        isPublic: false,
        sharedAt: null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing share link:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}