import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import path from "path";
import { writeFile } from "fs/promises";
import Experience from "@/models/Experience";
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

  // --- 3. Validate checksum ---
  const serverChecksum = crypto
    .createHash("sha256")
    .update(t + process.env.API_KEY)
    .digest("hex");

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

    const { searchParams } = new URL(req.url);
    const exp_type = searchParams.get("exp_type");

    let experiences;
    if (exp_type) {
      experiences = await Experience.find({ type: exp_type });
    } else {
      experiences = await Experience.find();
    }

    const res = NextResponse.json({ success: true, data: experiences });
    return setCorsHeaders(res, origin);
  } catch (error) {
    let res = NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
    return setCorsHeaders(res, origin);
  }
}

export async function POST(req) {
  const origin = req.headers.get("origin");

  const t = req.nextUrl.searchParams.get("t");
  const cs = req.nextUrl.searchParams.get("cs");

  const formData = await req.formData();

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

  const type = formData.get("type");
  const title = formData.get("title");
  const description = formData.get("description");
  const main_title = formData.get("main_title");
  const main_description = formData.get("main_description");
  const body_title = formData.get("body_title");
  const body_description = formData.get("body_description");
  const image = formData.get("image");
  const bg_image = formData.get("bg_image");
  const image_slider = formData.getAll("image_slider");
  const bulletPointsRaw = formData.get("bulletPoints");
  const bulletPoints = bulletPointsRaw ? JSON.parse(bulletPointsRaw) : [];

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

    const imageUrl = await saveImage(image);
    const bgImageUrl = await saveImage(bg_image);
    const imageSliderUrls = [];
    for (const file of image_slider) {
      const url = await saveImage(file);
      if (url) imageSliderUrls.push(url);
    }

    const experiences = await Experience.create({
      type,
      title,
      description,
      main_title,
      main_description,
      body_title,
      body_description,
      image: imageUrl,
      bg_image: bgImageUrl,
      image_slider: imageSliderUrls,
      bulletPoints,
    });

    const response = NextResponse.json({ success: true, data: experiences });
    response.headers.set(
      "Access-Control-Allow-Origin",
      "http://localhost:3001"
    );
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    return response;
  } catch (error) {
    console.error("POST Exp Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
