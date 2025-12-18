import { connectDB } from "@/lib/mongodb";
import Accommodation from "@/models/Accommodation";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import fs from "fs";
import crypto from "crypto";

const ALLOWED_ORIGINS = [
  "https://www.serendibhotels.mw",
  "https://serendibhotels.mw",
  "https://serendibhotel.com",
  "https://www.serendibhotel.com",
  "http://localhost:3000",
];

const EXPIRY_LIMIT = 5 * 60 * 1000; // 3 minutes

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

export async function PUT(request, { params }) {
  const { id } = params;
  const formData = await request.formData();

  try {
    await connectDB();

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

    await handleImage(formData.get("image"), "image");

    const acc_images = formData.getAll("images"); // getAll returns an array of files
        if (acc_images.length > 0) {
          const uploadedImages = [];
    
          for (const imageFile of acc_images) {
            if (imageFile && typeof imageFile === "object" && imageFile.size > 0) {
              const buffer = Buffer.from(await imageFile.arrayBuffer());
              const filename = `${Date.now()}-${imageFile.name}`;
              const filePath = path.join(uploadDir, filename);
              await writeFile(filePath, buffer);
    
              uploadedImages.push(`https://serendib.serendibhotels.mw/api/uploads/${filename}`);
            }
          }
    
          updates.images = uploadedImages; // store array of URLs
        }

    const updatedAccommodation = await Accommodation.findByIdAndUpdate(
      id,
      updates,
      {
        new: true,
      }
    ).lean();

    if (!updatedAccommodation) {
      return NextResponse.json(
        { message: "Accommodation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, accommodation: updatedAccommodation },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update accommodation", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const { id } = params;

  try {
    await connectDB();
    const deletedAccommodation = await Accommodation.findByIdAndDelete(
      id
    ).lean();
    if (!deletedAccommodation) {
      return NextResponse.json(
        { message: "Accommodation not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Accommodation deleted" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete Accommodation", error },
      { status: 500 }
    );
  }
}

export async function GET(req, { params }) {
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
    const room = await Accommodation.findById(params.id).lean();

    if (!room) {
      return NextResponse.json(
        { success: false, error: "Room not found" },
        { status: 404 }
      );
    }

    const response = NextResponse.json({ success: true, data: room });
    return setCorsHeaders(response, origin);

  } catch (error) {
    console.error("Error fetching room:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
