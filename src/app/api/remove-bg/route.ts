import { NextRequest, NextResponse } from "next/server";

const REMOVE_BG_URL = "https://api.remove.bg/v1.0/removebg";

export const runtime = "edge"; // fastest cold starts on Vercel

export async function POST(req: NextRequest) {
  const apiKey = process.env.REMOVE_BG_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Server misconfiguration: REMOVE_BG_API_KEY not set." },
      { status: 500 },
    );
  }

  let body: FormData;
  try {
    body = await req.formData();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body — expected multipart/form-data." },
      { status: 400 },
    );
  }

  // Build upstream FormData
  const upstream = new FormData();

  const imageFile = body.get("image_file");
  const imageUrl = body.get("image_url");

  if (!imageFile && !imageUrl) {
    return NextResponse.json(
      { error: "Provide either image_file or image_url." },
      { status: 400 },
    );
  }

  if (imageFile && imageFile instanceof Blob) {
    upstream.append("image_file", imageFile);
  } else if (typeof imageUrl === "string") {
    upstream.append("image_url", imageUrl);
  }

  upstream.append("size", (body.get("size") as string) ?? "auto");
  upstream.append("format", (body.get("format") as string) ?? "png");

  // Optional passthrough params
  const optionals = ["bg_color", "type", "crop", "shadow_type"];
  optionals.forEach((key) => {
    const v = body.get(key);
    if (v !== null) upstream.append(key, v as string);
  });

  // Forward to remove.bg — keep API key server-side only
  let upstreamRes: Response;
  try {
    upstreamRes = await fetch(REMOVE_BG_URL, {
      method: "POST",
      headers: { "X-API-Key": apiKey },
      body: upstream,
    });
  } catch {
    return NextResponse.json(
      { error: "Could not reach remove.bg. Check your connection." },
      { status: 502 },
    );
  }

  // Error responses from remove.bg
  if (!upstreamRes.ok) {
    // Pass through rate-limit headers
    if (upstreamRes.status === 429) {
      const retryAfter = upstreamRes.headers.get("Retry-After") ?? "10";
      return NextResponse.json(
        { error: "Rate limit exceeded. Please wait before retrying." },
        {
          status: 429,
          headers: { "Retry-After": retryAfter },
        },
      );
    }

    let errorMessage = `Remove.bg error (HTTP ${upstreamRes.status})`;
    try {
      const data = (await upstreamRes.json()) as {
        errors?: Array<{ title?: string }>;
      };
      errorMessage = data.errors?.[0]?.title ?? errorMessage;
    } catch {
      // ignore parse error
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: upstreamRes.status },
    );
  }

  // Stream the image back
  const imageBuffer = await upstreamRes.arrayBuffer();

  return new NextResponse(imageBuffer, {
    status: 200,
    headers: {
      "Content-Type": upstreamRes.headers.get("Content-Type") ?? "image/png",
      "X-Width": upstreamRes.headers.get("X-Width") ?? "",
      "X-Height": upstreamRes.headers.get("X-Height") ?? "",
      "X-Credits-Charged": upstreamRes.headers.get("X-Credits-Charged") ?? "",
      "X-Type": upstreamRes.headers.get("X-Type") ?? "",
      "Cache-Control": "no-store",
    },
  });
}
