// app/api/submit/route.js
import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";
import mongoose from "mongoose";
import BlogContent from "@/models/BlogContent";
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

  const blogId = formData.get("blogId");
  const title = formData.get("title");
  const description = formData.get("description");
  const image = formData.get("image");
  const bullet_title = formData.get("bullet_title");
  const bulletPointsRaw = formData.get("bulletPoints");
  const bulletPoints = bulletPointsRaw ? JSON.parse(bulletPointsRaw) : [];

  const saveImage = async (file) => {
    if (!file || typeof file !== "object") return "";
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${Date.now()}-${file.name}`;
    const filepath = path.join(process.cwd(), "api/uploads", filename);
    await writeFile(filepath, buffer);
    return `https://serendib.serendibhotels.mw/api/uploads/${filename}`;
  };

  const imageUrl = await saveImage(image);
  try {
    await connectDB();
    const newBlog = await BlogContent.create({
      blogId,
      title,
      description,
      bullet_title,
      bulletPoints,
      image: imageUrl,
    });
    const response = NextResponse.json({ success: true, data: newBlog });
    console.log("bullet response", response);

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

  if (serverChecksum !== cs) {
    let res = NextResponse.json(
      { success: false, error: "Invalid checksum" },
      { status: 401 }
    );
    return setCorsHeaders(res, origin);
  }

  // --- 4. DB Query ---
  try {
    await connectDB();

    const url = new URL(req.url);
    const blogId = url.searchParams.get("blogId");

    // ❗ Strong validation for blogId
    if (!blogId || !mongoose.isValidObjectId(blogId)) {
      let res = NextResponse.json(
        { success: false, error: "Invalid or missing blogId" },
        { status: 400 }
      );
      return setCorsHeaders(res, origin);
    }

    const query = { blogId: new mongoose.Types.ObjectId(blogId) };
    console.log("Query:", query);

    const blog = await BlogContent.find(query);

    let response = NextResponse.json({ success: true, data: blog });
    return setCorsHeaders(response, origin);
  } catch (error) {
    console.error("Error fetching blog:", error);
    let res = NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
    return setCorsHeaders(res, origin);
  }
}
