import { connectDB } from "@/lib/mongodb";
import Accommodation from "@/models/Accommodation";
import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import mongoose from "mongoose";

/* =======================
   CONFIG
======================= */

const ALLOWED_ORIGINS = [
  "https://www.serendibhotels.mw",
  "https://serendibhotels.mw",
  "https://serendibhotel.com",
  "https://www.serendibhotel.com",
  "http://localhost:3000",
];

const EXPIRY_LIMIT = 5 * 60 * 1000; // 5 minutes

/* =======================
   CORS HELPER
======================= */

function setCorsHeaders(response, origin) {
  if (ALLOWED_ORIGINS.includes(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  }
  return response;
}

/* =======================
   OPTIONS (Preflight)
======================= */

export async function OPTIONS(req) {
  const origin = req.headers.get("origin");
  const res = new NextResponse(null, { status: 204 });
  return setCorsHeaders(res, origin);
}

/* =======================
   GET — Single Room
======================= */

export async function GET(req, { params }) {
  const {id} = await params;
  console.log("params", params);
  const origin = req.headers.get("origin");

  try {
    const t = req.nextUrl.searchParams.get("t");
    const cs = req.nextUrl.searchParams.get("cs");

    if (!t || !cs) {
      const res = NextResponse.json(
        { success: false, error: "Missing parameters" },
        { status: 400 }
      );
      return setCorsHeaders(res, origin);
    }

    if (Math.abs(Date.now() - Number(t)) > EXPIRY_LIMIT) {
      const res = NextResponse.json(
        { success: false, error: "Expired request" },
        { status: 401 }
      );
      return setCorsHeaders(res, origin);
    }

    const serverChecksum = crypto
      .createHash("sha256")
      .update(t + process.env.API_KEY)
      .digest("hex");

    if (serverChecksum !== cs) {
      const res = NextResponse.json(
        { success: false, error: "Invalid checksum" },
        { status: 401 }
      );
      return setCorsHeaders(res, origin);
    }

    await connectDB();
    console.log("params.id :", id);
    console.log("Invalid Object :", mongoose.Types.ObjectId.isValid(id));

    if (!id) {
    return NextResponse.json({ success: false, error: "Missing room ID" }, { status: 400 });
  }

    const room = await Accommodation.findById(id).lean();

    if (!room) {
      const res = NextResponse.json(
        { success: false, error: "Room not found" },
        { status: 404 }
      );
      return setCorsHeaders(res, origin);
    }

    const res = NextResponse.json({ success: true, data: room });
    return setCorsHeaders(res, origin);

  } catch (error) {
    console.error("GET Room Error:", error);
    const res = NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
    return setCorsHeaders(res, origin);
  }
}

/* =======================
   PUT — Update Room
======================= */

export async function PUT(req, { params }) {
  const origin = req.headers.get("origin");

  try {
    await connectDB();
    const formData = await req.formData();

    const updates = {
      room_type: formData.get("room_type"),
      price: formData.get("price"),
      size: formData.get("size"),
      description: formData.get("description"),
      spec_type: formData.getAll("spec_type"),
    };

    const uploadDir = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    async function saveImage(file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = `${Date.now()}-${file.name}`;
      const filePath = path.join(uploadDir, filename);
      await writeFile(filePath, buffer);
      return `https://serendib.serendibhotels.mw/api/uploads/${filename}`;
    }

    const mainImage = formData.get("image");
    if (mainImage?.size) {
      updates.image = await saveImage(mainImage);
    }

    const images = formData.getAll("images");
    if (images.length > 0) {
      const uploaded = [];
      for (const img of images) {
        if (img?.size) uploaded.push(await saveImage(img));
      }
      updates.images = uploaded;
    }

    const updated = await Accommodation.findByIdAndUpdate(
      params.id,
      updates,
      { new: true }
    ).lean();

    if (!updated) {
      const res = NextResponse.json(
        { success: false, error: "Accommodation not found" },
        { status: 404 }
      );
      return setCorsHeaders(res, origin);
    }

    const res = NextResponse.json({ success: true, data: updated });
    return setCorsHeaders(res, origin);

  } catch (error) {
    console.error("PUT Error:", error);
    const res = NextResponse.json(
      { success: false, error: "Failed to update accommodation" },
      { status: 500 }
    );
    return setCorsHeaders(res, origin);
  }
}

/* =======================
   DELETE — Remove Room
======================= */

export async function DELETE(req, { params }) {
  const origin = req.headers.get("origin");

  try {
    await connectDB();

    const deleted = await Accommodation.findByIdAndDelete(params.id).lean();

    if (!deleted) {
      const res = NextResponse.json(
        { success: false, error: "Accommodation not found" },
        { status: 404 }
      );
      return setCorsHeaders(res, origin);
    }

    const res = NextResponse.json({ success: true, message: "Deleted" });
    return setCorsHeaders(res, origin);

  } catch (error) {
    console.error("DELETE Error:", error);
    const res = NextResponse.json(
      { success: false, error: "Failed to delete accommodation" },
      { status: 500 }
    );
    return setCorsHeaders(res, origin);
  }
}
