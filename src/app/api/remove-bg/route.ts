import { NextRequest, NextResponse } from "next/server";

const REMOVE_BG_URL = "https://api.remove.bg/v1.0/removebg";

// ❌ REMOVE EDGE
// export const runtime = "edge";

// ✅ Force Node.js runtime (important for file uploads)
export const runtime = "nodejs";

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

  const imageFile = body.get("image_file");
  const imageUrl = body.get("image_url");

  if (!imageFile && !imageUrl) {
    return NextResponse.json(
      { error: "Provide either image_file or image_url." },
      { status: 400 },
    );
  }

  // 🔥 IMPORTANT: rebuild FormData properly
  const upstream = new FormData();

  if (imageFile instanceof File) {
    upstream.append("image_file", imageFile, imageFile.name);
  } else if (typeof imageUrl === "string") {
    upstream.append("image_url", imageUrl);
  }

  upstream.append("size", (body.get("size") as string) ?? "auto");
  upstream.append("format", (body.get("format") as string) ?? "png");

  const optionals = ["bg_color", "type", "crop", "shadow_type"];

  for (const key of optionals) {
    const value = body.get(key);
    if (value) upstream.append(key, value as string);
  }

  let upstreamRes: Response;

  try {
    upstreamRes = await fetch(REMOVE_BG_URL, {
      method: "POST",
      headers: {
        "X-API-Key": apiKey,
      },
      body: upstream,
    });
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }

  if (!upstreamRes.ok) {
    if (upstreamRes.status === 429) {
      const retryAfter = upstreamRes.headers.get("Retry-After") ?? "10";
      return NextResponse.json(
        { error: "Rate limit exceeded." },
        {
          status: 429,
          headers: { "Retry-After": retryAfter },
        },
      );
    }

    let errorMessage = `Remove.bg error (${upstreamRes.status})`;

    try {
      const data = await upstreamRes.json();
      errorMessage = data?.errors?.[0]?.title ?? errorMessage;
    } catch {}

    return NextResponse.json(
      { error: errorMessage },
      { status: upstreamRes.status },
    );
  }

  // ✅ Proper binary passthrough
  const arrayBuffer = await upstreamRes.arrayBuffer();
  const contentType = upstreamRes.headers.get("Content-Type") ?? "image/png";

  return new NextResponse(arrayBuffer, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "X-Width": upstreamRes.headers.get("X-Width") ?? "",
      "X-Height": upstreamRes.headers.get("X-Height") ?? "",
      "X-Credits-Charged": upstreamRes.headers.get("X-Credits-Charged") ?? "",
      "X-Type": upstreamRes.headers.get("X-Type") ?? "",
      "Cache-Control": "no-store",
    },
  });
}
