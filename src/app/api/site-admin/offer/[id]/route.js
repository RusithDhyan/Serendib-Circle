import { connectDB } from "@/lib/mongodb";
import Offer from "@/models/Offer";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import fs from "fs";
import path from "path";
import { title } from "process";
import crypto from "crypto";

const EXPIRY_LIMIT = 3 * 60 * 1000; // 3 minutes

const ALLOWED_ORIGINS = [
  "https://serendibhotels.mw",
  "https://www.serendibhotel.com",
  "http://localhost:3000",
];

export async function OPTIONS(req) {
  const origin = req.headers.get("origin");
  const response = new NextResponse(null, { status: 204 });

  if (ALLOWED_ORIGINS.includes(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");
    response.headers.set("Access-Control-Max-Age", "86400");
  }

  return response;
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
      hotelId: formData.get("hotelId"),
      offer_type: formData.get("offer_type"),
      title: formData.get("title"),
      description: formData.get("description"),
      main_description: formData.get("main_description"),
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
    await handleImage(formData.get("bg_image"), "bg_image");
    await handleImage(formData.get("cover_image"), "cover_image");

    // Handle bullet points
    const bulletPointsRaw = formData.get("bulletPoints");
    if (bulletPointsRaw) {
      updates.bulletPoints = JSON.parse(bulletPointsRaw); // expect JSON string
    }

    const updatedOffer = await Offer.findByIdAndUpdate(id, updates, {
      new: true,
    }).lean();

    if (!updatedOffer) {
      return NextResponse.json({ message: "Offer not found" }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, offer: updatedOffer },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT Offer Error:", error);
    return NextResponse.json(
      { message: "Failed to update Offer", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, context) {
  const { id } = await context.params;
  try {
    await connectDB();
    const deletedOffer = await Offer.findByIdAndDelete(id).lean();
    if (!deletedOffer) {
      return NextResponse.json({ message: "Offer not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Offer deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete Offer", error: error.message },
      { status: 500 }
    );
  }
}


export async function GET(req, { params }) {
  const origin = req.headers.get("origin");

  try {
    await connectDB();

    const offer = await Offer.findById(params.id).lean();

    if (!offer) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 });
    }

    const response = NextResponse.json({ offer });

    if (ALLOWED_ORIGINS.includes(origin)) {
      response.headers.set("Access-Control-Allow-Origin", origin);
      response.headers.set(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS"
      );
      response.headers.set("Access-Control-Allow-Headers", "Content-Type");
    }

    return response;
  } catch (error) {
    console.error("Error fetching offer:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
