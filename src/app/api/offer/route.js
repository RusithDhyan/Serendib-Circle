import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Offer from "@/models/Offer";
import mongoose from "mongoose";
import path from "path";
import { writeFile } from "fs/promises";
import crypto from "crypto";

const ALLOWED_ORIGINS = [
  "https://www.serendibhotels.mw",
  "https://serendibhotels.mw",
  "https://serendibhotel.com",
  "https://www.serendibhotel.com",
  "http://localhost:3000",
];

const EXPIRY_LIMIT = 3 * 60 * 1000; // 3 minutes

function setCorsHeaders(response, origin) {
  if (ALLOWED_ORIGINS.includes(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  }
  return response;
}

export async function OPTIONS(req) {
  const origin = req.headers.get("origin");
  let res = new NextResponse(null, { status: 204 });
  return setCorsHeaders(res, origin);
}

export async function GET(req) {
  const url = new URL(req.url);
  const hotelId = url.searchParams.get("hotelId");

  const origin = req.headers.get("origin");
    
      // --- 1. Read query parameters ---
      const t = req.nextUrl.searchParams.get("t");
      const cs = req.nextUrl.searchParams.get("cs");
    
      if (!t || !cs) {
        let res = NextResponse.json({ success: false, error: "Missing parameters" }, { status: 400 });
        return setCorsHeaders(res, origin);
      }
    
      // --- 2. Validate timestamp ---
      if (Math.abs(Date.now() - parseInt(t)) > EXPIRY_LIMIT) {
        let res = NextResponse.json({ success: false, error: "Expired request" }, { status: 401 });
        return setCorsHeaders(res, origin);
      }
    
      // --- 3. Validate checksum ---
      const serverChecksum = crypto
        .createHash("sha256")
        .update(t + process.env.API_KEY)
        .digest("hex");
    
        // console.log("Backend API Key:", process.env.API_KEY);
    
      if (serverChecksum !== cs) {
        let res = NextResponse.json({ success: false, error: "Invalid checksum" }, { status: 401 });
        return setCorsHeaders(res, origin);
      }

  try {
    await connectDB();

    const query = hotelId
      ? { hotelId: new mongoose.Types.ObjectId(hotelId) }
      : {};

    const offers = await Offer.find(query);
    const response = NextResponse.json({ success: true, data: offers });
    return setCorsHeaders(response, origin);
  } catch (error) {
    let res = NextResponse.json({ success: false, error: error.message }, { status: 500 });
        return setCorsHeaders(res, origin);
  }
}

export async function POST(req) {

   const origin = req.headers.get("origin");
      const formData = await req.formData();
    
      // --- 1. Security fields ---
      const t = formData.get("t");
      const cs = formData.get("cs");
    
      if (!t || !cs) {
        let res = NextResponse.json(
          { success: false, error: "Missing security parameters"},
          { status: 400 }
        );
        return setCorsHeaders(res, origin);
      }
    
      // --- 2. Validate timestamp ---
      if (Math.abs(Date.now() - parseInt(t)) > EXPIRY_LIMIT) {
        let res = NextResponse.json(
          { success: false, error: "Expired request" },
          { status: 401 }
        );
        return setCorsHeaders(res, origin);
      }
    
      // --- 3. Validate checksum ---
      const serverChecksum = crypto
        .createHash("sha256")
        .update(t + process.env.API_KEY) // Private key (secure)
        .digest("hex");
    
      if (serverChecksum !== cs) {
        let res = NextResponse.json(
          { success: false, error: "Invalid checksum" },
          { status: 401 }
        );
        return setCorsHeaders(res, origin);
      }
  try {
    const hotelId = formData.get("hotelId");
    const offer_type = formData.get("offer_type");
    const title = formData.get("title");
    const main_description = formData.get("main_description");
    const description = formData.get("description");
    const image = formData.get("image");
    const bg_image = formData.get("bg_image");
    const cover_image = formData.get("cover_image");
    const bulletPointsRaw = formData.get("bulletPoints");
    const bulletPoints = bulletPointsRaw ? JSON.parse(bulletPointsRaw) : [];

    await connectDB();

    const saveFile = async (file) => {
        if (!file || typeof file !== "object") return "";
        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = `${Date.now()}-${file.name}`;
        const filepath = path.join(process.cwd(), "uploads", filename);
        await writeFile(filepath, buffer);
        return `https://serendib.serendibhotels.mw/api/uploads/${filename}`;
      };

    const imageUrl = await saveFile(image);
    const bgImageUrl = await saveFile(bg_image);
    const coverImageUrl = await saveFile(cover_image);

    const offer = await Offer.create({
      hotelId,
      offer_type,
      title,
      main_description,
      description,
      image: imageUrl,
      bg_image: bgImageUrl,
      cover_image: coverImageUrl,
      bulletPoints,
    });

    return NextResponse.json({ success: true, data: offer });
  } catch (error) {
    console.error("POST Offer Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
