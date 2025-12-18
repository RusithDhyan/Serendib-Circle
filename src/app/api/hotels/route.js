import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";
import path from "path";
import { writeFile } from "fs/promises";
import Hotel from "@/models/Hotel";
import { getCurrentUser } from "@/utils/auth";
import crypto from "crypto";

const ALLOWED_ORIGINS = [
  "https://serendibhotels.mw",
  "https://serendibhotel.com",
  "https://www.serendibhotels.mw",
  "https://www.serendibhotel.com",
  "http://localhost:3000",
];

const EXPIRY_LIMIT = 5 * 60 * 1000; // 5 minutes

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
  const origin = req.headers.get("origin");

  // --- 1. Read query parameters ---
  const t = req.nextUrl.searchParams.get("t");
  const cs = req.nextUrl.searchParams.get("cs");

  // console.log("recieved timestamp",t);
  // console.log("received checksum",cs);


  if (!t || !cs) {
    let res = NextResponse.json(
      { success: false, error: "Missing parameters" },
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

  const serverChecksum = crypto
    .createHash("sha256")
    .update(t + process.env.API_KEY)
    .digest("hex");
      
    // console.log("generated cs",serverChecksum);

  // console.log("Backend API Key:", process.env.API_KEY);

  if (serverChecksum !== cs) {
    let res = NextResponse.json(
      { success: false, error: "Invalid checksum" },
      { status: 401 }
    );
    return setCorsHeaders(res, origin);
  }

  try {
    await connectDB();

    const url = new URL(req.url);
    const hotelId = url.searchParams.get("hotelId");

    const query = hotelId
      ? { hotelId: new mongoose.Types.ObjectId(hotelId) }
      : {};

    const hotels = await Hotel.find(query);
    const response = NextResponse.json({ success: true, data: hotels });
    return setCorsHeaders(response, origin);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
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
      { success: false, error: "Missing security parameters" },
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

  const hotel_name = formData.get("hotel_name");
  const title = formData.get("title");
  const location = formData.get("location");
  const description = formData.get("description");
  const thumbnail = formData.get("thumbnail");
  const image = formData.get("image");
  const cover_image = formData.get("cover_image");

  try {
    await connectDB();

    const saveImage = async (file) => {
      if (!file || typeof file !== "object") return "";
      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = `${Date.now()}-${file.name}`;
      const filepath = path.join(process.cwd(), "uploads", filename);
      await writeFile(filepath, buffer);
      return `https://serendib.serendibhotels.mw/api/uploads/${filename}`;
    };

    const thumbUrl = await saveImage(thumbnail);
    const bgImageUrl = await saveImage(image);
    const coverImageUrl = await saveImage(cover_image);

    const currentUser = await getCurrentUser(req);

    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!currentUser.permissions?.canDeleteHotel) {
      return NextResponse.json(
        { success: false, error: "You do not have permission to add hotels" },
        { status: 403 }
      );
    }

    const hotel = await Hotel.create({
      hotel_name,
      title,
      location,
      description,
      thumbnail: thumbUrl,
      image: bgImageUrl,
      cover_image: coverImageUrl,
    });

    const response = NextResponse.json({ success: true, data: hotel });
    response.headers.set(
      "Access-Control-Allow-Origin",
      "http://localhost:3001"
    );
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    return response;
  } catch (error) {
    console.error("POST Offer Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
