import { NextRequest, NextResponse } from "next/server";

const POLLINATIONS_IMAGE_PREFIX = "https://gen.pollinations.ai/image/";

export async function GET(request: NextRequest) {
  const apiKey = process.env.POLLINATIONS_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  }

  const upstreamUrl = request.nextUrl.searchParams.get("url");

  if (!upstreamUrl || !upstreamUrl.startsWith(POLLINATIONS_IMAGE_PREFIX)) {
    return NextResponse.json({ error: "Invalid image URL" }, { status: 400 });
  }

  try {
    const response = await fetch(upstreamUrl, {
      cache: "force-cache",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch image" },
        { status: response.status }
      );
    }

    const imageBuffer = await response.arrayBuffer();

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": response.headers.get("content-type") || "image/jpeg",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (error) {
    console.error("Image proxy error:", error);
    return NextResponse.json({ error: "Image proxy failed" }, { status: 500 });
  }
}
