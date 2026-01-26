// app/api/users/[id]/route.js

import { connectDB } from "@/lib/mongodb";
import Hotel from "@/models/Hotel";
import { writeFile } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
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

export async function PUT(request, context) {
  const { id } = await context.params;
  
   const t = request.nextUrl.searchParams.get("t");
    const cs = request.nextUrl.searchParams.get("cs");
  
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

  const formData = await request.formData();



  try {
    await connectDB();

    const updates = {
      hotel_name: formData.get("hotel_name"),
      title: formData.get("title"),
      location: formData.get("location"),
      description: formData.get("description"),
    };

    const uploadDir = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // ✅ Helper to handle image uploads
    async function handleImage(imageFile, fieldName) {
      if (imageFile && typeof imageFile === "object" && imageFile.size > 0) {
        const buffer = Buffer.from(await imageFile.arrayBuffer());
        const filename = `${Date.now()}-${imageFile.name}`;
        const filePath = path.join(uploadDir, filename);
        await writeFile(filePath, buffer);

        // ✅ Use API route for serving
        updates[
          fieldName
        ] = `https://serendib.serendibhotels.mw/api/uploads/${filename}`;
      }
    }

    await handleImage(formData.get("thumbnail"), "thumbnail");
    await handleImage(formData.get("image"), "image");
    await handleImage(formData.get("cover_image"), "cover_image");

    const updatedHotel = await Hotel.findByIdAndUpdate(id, updates, {
      new: true,
    }).lean();

    if (!updatedHotel) {
      return NextResponse.json({ message: "Hotel not found" }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, hotel: updatedHotel },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update hotel", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, context) {

  const session = await getServerSession(authOptions);

  const { id } = await context.params;
  try {
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!session?.user?.permissions?.canDeleteHotel) {
      return NextResponse.json(
        {
          success: false,
          error: "You do not have permission to delete hotels",
        },
        { status: 403 }
      );
    }
    await connectDB();
    const deletedHotel = await Hotel.findByIdAndDelete(id).lean();
    if (!deletedHotel) {
      return NextResponse.json({ message: "Hotel not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Hotel deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete Hotel", error },
      { status: 500 }
    );
  }
}

export async function GET(req, context) {
  const origin = req.headers.get("origin");

  // --- 1. Read query parameters ---
  const t = req.nextUrl.searchParams.get("t");
  const cs = req.nextUrl.searchParams.get("cs");

  console.log("FE Hotel Inner CS :", cs);

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

  console.log("Backend API Key:", process.env.API_KEY);
  console.log("BE Hotel Inner CS :", serverChecksum);

  if (serverChecksum !== cs) {
    let res = NextResponse.json(
      { success: false, error: "Invalid checksum" },
      { status: 401 }
    );
    return setCorsHeaders(res, origin);
  }
  try {
    await connectDB();

    const { params } = context;
    const { id } = await params;

    const hotel = await Hotel.findById(id).lean();

    if (!hotel) {
      return NextResponse.json(
        { success: false, error: "Hotel not found" },
        { status: 404 }
      );
    }

    const response = NextResponse.json({ success: true, data: hotel });
    return setCorsHeaders(response, origin);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
