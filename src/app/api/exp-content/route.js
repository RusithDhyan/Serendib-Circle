import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import ExperienceContent from "@/models/ExperienceContent";
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
  const expId = formData.get("expId");
  const title = formData.get("title");
  const description = formData.get("description");

  const bulletPointsRaw = formData.get("bulletPoints");
  const bulletPoints = bulletPointsRaw ? JSON.parse(bulletPointsRaw) : [];


  try {
    await connectDB();
    const newExperience = await ExperienceContent.create({
      expId,
      title,
      description,
      bulletPoints,
    });

    const response = NextResponse.json({ success: true, data: newExperience });
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
    const expId = url.searchParams.get("expId");

    if (!expId) {
      return NextResponse.json(
        { success: false, error: "Missing expId" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(expId)) {
      return NextResponse.json(
        { success: false, error: "Invalid expId" },
        { status: 400 }
      );
    }

    const query = { expId: new mongoose.Types.ObjectId(expId) };
    console.log("Query:", query);

    const exp = await ExperienceContent.find(query);

    const response = NextResponse.json({ success: true, data: exp });
    return setCorsHeaders(response, origin);

  } catch (error) {
    console.error("Error fetching offer content:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
