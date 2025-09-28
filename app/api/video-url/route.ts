import { NextResponse } from "next/server";
import crypto from "crypto";

const BUNNY_SECRET = process.env.BUNNY_SECRET!;
const LIBRARY_ID = process.env.VIDEO_LIBRARY!;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const videoId = searchParams.get("videoId");

  if (!videoId) {
    return NextResponse.json({ error: "VideoId required" }, { status: 400 });
  }

  // وقت الانتهاء (5 دقائق من الآن)
  const expires = Math.floor(Date.now() / 1000) + 60 * 5;

  // توليد HMAC SHA256 token
  const tokenString = BUNNY_SECRET + videoId + expires;
  const token = crypto.createHash("sha256").update(tokenString).digest("hex");

  // رابط iframe النهائي
  const iframeUrl = `https://iframe.mediadelivery.net/embed/${LIBRARY_ID}/${videoId}?token=${token}&expires=${expires}`;

  return NextResponse.json({ url: iframeUrl });
}
