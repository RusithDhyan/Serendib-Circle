import { connectDB } from "@/lib/mongodb";
import Accommodation from "@/models/Accommodation";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import fs from "fs";

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

const ALLOWED_ORIGINS = ["https://serendibhotels.mw","https://www.serendibhotel.com", "http://localhost:3000"];

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

export async function GET(req, { params }) {
  const origin = req.headers.get("origin");

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
    console.error("Error fetching room:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
