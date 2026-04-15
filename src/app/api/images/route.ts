import { authOptions } from "@/utils/authOptions";
import { ImageModel, LEGACY_MODEL_ALIASES, SUPPORTED_IMAGE_MODELS } from "@/types/image";
import prisma from "@/utils/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 50;

const DEFAULT_MODEL: ImageModel = "flux";
const GEN_POLLINATIONS_PREFIX = "https://gen.pollinations.ai/image/";

function resolveModel(model: unknown): ImageModel {
  if (typeof model !== "string") return DEFAULT_MODEL;

  const normalizedModel = model.trim().toLowerCase();

  if (SUPPORTED_IMAGE_MODELS.includes(normalizedModel as ImageModel)) {
    return normalizedModel as ImageModel;
  }

  return LEGACY_MODEL_ALIASES[normalizedModel] ?? DEFAULT_MODEL;
}

function resolveDimension(value: unknown, fallback: number): number {
  const numericValue = typeof value === "number" ? value : Number(value);

  if (!Number.isFinite(numericValue)) {
    return fallback;
  }

  return Math.min(1536, Math.max(256, Math.round(numericValue)));
}

function toProxyImageUrl(imageUrl: string): string {
  if (!imageUrl.startsWith(GEN_POLLINATIONS_PREFIX)) {
    return imageUrl;
  }

  return `/api/images/proxy?url=${encodeURIComponent(imageUrl)}`;
}

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

  const requestBody = await request.json();
  const prompt = typeof requestBody.prompt === "string" ? requestBody.prompt.trim() : "";

  if (!prompt) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  const selectedModel = resolveModel(requestBody.model);
  const width = resolveDimension(requestBody.width, 1024);
  const height = resolveDimension(requestBody.height, 1024);

  try {
    function generateRandomNumber(): number {
      return Math.floor(Math.random() * 100000000) + 1;
    }

    const randomSeed = generateRandomNumber();
    const apiKey = process.env.POLLINATIONS_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    const pollinationsUrl = `https://gen.pollinations.ai/image/${encodeURIComponent(
      prompt
    )}?seed=${randomSeed}&width=${width}&height=${height}&nologo=true&model=${selectedModel}`;

    // Keep client-facing URL on this app domain while authenticating upstream requests.
    const proxyImageUrl = `/api/images/proxy?url=${encodeURIComponent(pollinationsUrl)}`;

    const response = await fetch(pollinationsUrl, {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      }
    });

    if (!response.ok) {
      let apiErrorMessage = "Image generation failed";

      try {
        const errorPayload = await response.json();
        apiErrorMessage =
          errorPayload?.error?.message ||
          errorPayload?.message ||
          apiErrorMessage;
      } catch {
        // Ignore JSON parsing errors and use fallback message.
      }

      if (response.status === 402) {
        apiErrorMessage = `${apiErrorMessage} (selected model may require paid balance)`;
      }

      if (response.status === 403) {
        apiErrorMessage = `${apiErrorMessage} (selected model may not be enabled for your API key)`;
      }

      return NextResponse.json({ error: apiErrorMessage }, { status: response.status });
    }

    // Deduct credits and create post in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the post
      const post = await tx.post.create({
        data: {
          prompt: prompt,
          url: proxyImageUrl,
          userId: session.user.id,
          seed: randomSeed,
          model: selectedModel,
        },
      });

      // Update user credits
      const updatedUser = await tx.user.update({
        where: { id: session.user.id },
        data: { credits: { decrement: 1 } },
      });

      return { post, updatedUser };
    });

    return NextResponse.json({ 
      url: proxyImageUrl,
      modelUsed: selectedModel,
      postId: result.post.id,
      credits: result.updatedUser.credits 
    });
  } catch (err) {
    console.error('Image generation failed:', err);
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

  const normalizedPosts = posts.map((post) => ({
    ...post,
    url: toProxyImageUrl(post.url),
  }));

  return NextResponse.json(normalizedPosts);
}
