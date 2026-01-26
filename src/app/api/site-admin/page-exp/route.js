
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Offer from "@/models/Offer";
import mongoose from "mongoose";
import path from "path";
import { writeFile } from "fs/promises";
import PageExp from "@/models/PageExp";
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

    const url = new URL(req.url);
    const hotelId = url.searchParams.get("hotelId");

    // ✅ Validate hotelId
    if (!hotelId || !mongoose.Types.ObjectId.isValid(hotelId)) {
      return NextResponse.json(
        { success: false, error: "Invalid or missing hotelId" },
        { status: 400 }
      );
    }

    const query = { hotelId: new mongoose.Types.ObjectId(hotelId) };
    const exp = await PageExp.find(query).lean();

    const response = NextResponse.json({ success: true, data: exp });
    return setCorsHeaders(response, origin);
   
  } catch (error) {
    console.error("Error fetching page experience:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  const formData = await req.formData();
  const origin = req.headers.get("origin");
      
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

  const hotelId = formData.get("hotelId");
  const image_right = formData.get("image_right");
  const description_right = formData.get("description_right");
  const image_left = formData.get("image_left");
  const description_left = formData.get("description_left");

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
    
      const imageRightUrl = await saveImage(image_right);
      const imageLeftUrl = await saveImage(image_left);

    const exp = await PageExp.create({
      hotelId,
      image_right:imageRightUrl,
      description_right,
      image_left:imageLeftUrl,
      description_left,
    
    });

    const response = NextResponse.json({ success: true, data: exp });
    response.headers.set(
      "Access-Control-Allow-Origin",
      "http://localhost:3001"
    );
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    return response;

  } catch (error) {
    console.error("POST Offer Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}