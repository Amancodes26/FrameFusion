import { Metadata } from "next";
import { notFound } from "next/navigation";
import prisma from "@/utils/prisma";
import SharedImageClient from "./client";

interface Props {
  params: Promise<{ shareId: string }>;
}

const GEN_POLLINATIONS_PREFIX = "https://gen.pollinations.ai/image/";

function toProxyImageUrl(imageUrl: string): string {
  if (!imageUrl.startsWith(GEN_POLLINATIONS_PREFIX)) {
    return imageUrl;
  }

  return `/api/images/proxy?url=${encodeURIComponent(imageUrl)}`;
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

    if (!post) {
      return null;
    }

    return {
      ...post,
      url: toProxyImageUrl(post.url),
    };
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
  const baseUrl = process.env.NEXTAUTH_URL || "https://framefusionai.vercel.app";
  const imageUrl = post.url.startsWith("http") ? post.url : `${baseUrl}${post.url}`;
  const shareUrl = `${baseUrl}/share/${shareId}`;

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