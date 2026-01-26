import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import OfferContent from "@/models/OfferContent";
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

export async function POST(req) {
  const formData = await req.formData();
  const offerId = formData.get("offerId");
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

  const title = formData.get("title");
  const subtitle = formData.get("subtitle");
  const description = formData.get("description");

  const bulletPointsRaw = formData.get("bulletPoints");
  const bulletPoints = bulletPointsRaw ? JSON.parse(bulletPointsRaw) : [];

  const price = formData.get("price");
  const validity = formData.get("validity");

  try {
    await connectDB();
    const newOffer = await OfferContent.create({
      offerId,
      title,
      subtitle,
      description,
      bulletPoints,
      price,
      validity,
    });

    const response = NextResponse.json({ success: true, data: newOffer });
    response.headers.set(
      "Access-Control-Allow-Origin",
      "http://localhost:3001"
    );
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    return response;
    
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
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
    const offerId = url.searchParams.get("offerId");

    if (!offerId) {
      return NextResponse.json(
        { success: false, error: "Missing offerId" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(offerId)) {
      return NextResponse.json(
        { success: false, error: "Invalid offerId" },
        { status: 400 }
      );
    }

    const query = { offerId: new mongoose.Types.ObjectId(offerId) };
    console.log("Query:", query);

    const offer = await OfferContent.find(query);

    const response = NextResponse.json({ success: true, data: offer });
    return setCorsHeaders(res, origin);

  } catch (error) {
    console.error("Error fetching offer content:", error);
    return NextResponse.json(
      { success: false, error: error.message},
      { status: 500 }
    );
  }
}
