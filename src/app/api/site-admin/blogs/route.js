// app/api/submit/route.js
import { connectDB } from "@/lib/mongodb";
import path from "path";
import { writeFile } from "fs/promises";
import Blog from "@/models/Blog";
import { NextResponse } from "next/server";
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
      return setCorsHeaders(res, origin)
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
  const description = formData.get("description");
  const main_title = formData.get("main_title");
  const main_description = formData.get("main_description");
  const body_title = formData.get("body_title");
  const body_description = formData.get("body_description");
  const bottom_title = formData.get("bottom_title");
  const bottom_description = formData.get("bottom_description");
  const thumbnail = formData.get("thumbnail");
  const bg_image = formData.get("bg_image");
  const cover_image = formData.get("cover_image");
  

  // Helper function to save image
  const saveImage = async (file) => {
    if (!file || typeof file !== "object") return "";
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${Date.now()}-${file.name}`;
    const filepath = path.join(process.cwd(), "uploads", filename);
    await writeFile(filepath, buffer);
    return `https://serendib.serendibhotels.mw/api/uploads/${filename}`;
  };

  const imageUrl = await saveImage(thumbnail);
  const bgImageUrl = await saveImage(bg_image);
  const coverImageUrl = await saveImage(cover_image);

  try {
    await connectDB();
    const newBlog = await Blog.create({
      title,
      description,
      main_title,
      main_description,
      body_title,
      body_description,
      bottom_title,
      bottom_description,
      thumbnail: imageUrl,
      bg_image: bgImageUrl,
      cover_image: coverImageUrl
    });

    const response = NextResponse.json({ success: true, data: newBlog });
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

// GET handler (for actual data)
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
    const blog = await Blog.find({});
    let response = NextResponse.json({ success: true, data: blog });
    return setCorsHeaders(response, origin);
  } catch (error) {
    let res = NextResponse.json({ success: false, error: error.message }, { status: 500 });
    return setCorsHeaders(res, origin);
  }
}

