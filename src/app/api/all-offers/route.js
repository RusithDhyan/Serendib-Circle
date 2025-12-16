import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Hotel from "@/models/Hotel";
import PageOffer from "@/models/Offer";
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
  const url = new URL(req.url);
  const hotelId = url.searchParams.get("hotelId");

  if (!hotelId) {
    return NextResponse.json(
      { success: false, error: "Missing hotelId" },
      { status: 400 }
    );
  }

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

    // Fetch both hotel name and offer in one go
    const hotel = await Hotel.findById(hotelId).lean();
    const offer = await PageOffer.findOne({ hotelId }).lean();

    if (!hotel || !offer) {
      return NextResponse.json(
        { success: false, error: "Hotel or Offer not found" },
        { status: 404 }
      );
    }

    const response = NextResponse.json({
      success: true,
      data: {
        hotelName: hotel.hotel_name,
        Id: offer._id,
        offerType: offer.offer_type,
      },
    });
    return setCorsHeaders(response, origin);

  } catch (error) {
    console.error("Offer fetch error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
