import { Metadata } from "next";
import { notFound } from "next/navigation";
import prisma from "@/utils/prisma";
import SharedImageClient from "./client";

interface Props {
  params: Promise<{ shareId: string }>;
}

async function getSharedPost(shareId: string) {
  try {
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

    return post;
  } catch (error) {
    console.error("Error fetching shared post:", error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { shareId } = await params;
  const post = await getSharedPost(shareId);

  if (!post) {
    return {
      title: "Image Not Found - FrameFusion",
      description: "This shared image could not be found or is no longer available.",
    };
  }

  const title = `AI Art: ${post.prompt.substring(0, 60)}${post.prompt.length > 60 ? '...' : ''} - FrameFusion`;
  const description = `Check out this amazing AI-generated image created by ${post.User.name} using FrameFusion: "${post.prompt}"`;
  const imageUrl = post.url;
  const shareUrl = `${process.env.NEXTAUTH_URL || "https://framefusionai.vercel.app"}/share/${shareId}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1024,
          height: 1024,
          alt: post.prompt,
        },
      ],
      url: shareUrl,
      siteName: "FrameFusion",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
      creator: "@framefusion_ai",
      site: "@framefusion_ai",
    },
    other: {
      "og:image:width": "1024",
      "og:image:height": "1024",
      "twitter:image:alt": post.prompt,
    },
  };
}

export default async function SharedImagePage({ params }: Props) {
  const { shareId } = await params;
  const post = await getSharedPost(shareId);

  if (!post) {
    notFound();
  }

  return <SharedImageClient post={post} />;
}