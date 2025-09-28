import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const BUNNY_SECRET = process.env.BUNNY_API_KEY!;
const LIBRARY_ID = process.env.VIDEO_LIBRARY!;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const videoId = searchParams.get("videoId");

  if (!videoId) {
    return NextResponse.json({ error: "VideoId required" }, { status: 400 });
  }

  // توليد توكن صالح لمدة 5 دقائق
  const token = jwt.sign(
    {
      videoId,
      exp: Math.floor(Date.now() / 1000) + 60 * 5,
    },
    BUNNY_SECRET,
    { algorithm: "HS256" }
  );

  const iframeUrl = `https://iframe.mediadelivery.net/play/${LIBRARY_ID}/${videoId}?token=${token}`;

  return NextResponse.json({ url: iframeUrl });
}
