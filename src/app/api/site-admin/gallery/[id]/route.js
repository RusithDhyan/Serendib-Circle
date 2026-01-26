import { connectDB } from "@/lib/mongodb";
import Gallery from "@/models/Gallery";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import fs from "fs";

export async function PUT(request, { params }) {
  const { id } = params;
  const formData = await request.formData();

  try {
    await connectDB();
    const updates = {};

  const uploadDir = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Handle multiple images
    const images = formData.getAll("image_slider"); // getAll returns an array of files
    if (images.length > 0) {
      const uploadedImages = [];

      for (const imageFile of images) {
        if (imageFile && typeof imageFile === "object" && imageFile.size > 0) {
          const buffer = Buffer.from(await imageFile.arrayBuffer());
          const filename = `${Date.now()}-${imageFile.name}`;
          const filePath = path.join(uploadDir, filename);
          await writeFile(filePath, buffer);

          uploadedImages.push(`https://serendib.serendibhotels.mw/api/uploads/${filename}`);
        }
      }

      updates.image_slider = uploadedImages; // store array of URLs
    }
   
    const updatedGallery = await Gallery.findByIdAndUpdate(id, updates, {
      new: true,
    }).lean();

    if (!updatedGallery) {
      return NextResponse.json(
        { message: "Gallery not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, galleries: updatedGallery },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update Gallery", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const { id } = params;

  try {
    await connectDB();
    const deletedGallery = await Gallery.findByIdAndDelete(id).lean();
    if (!deletedGallery) {
      return NextResponse.json(
        { message: "Gallery not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ message: "Gallery deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete Gallery", error },
      { status: 500 }
    );
  }
}

export async function GET(req, { params }) {
  try {
    await connectDB();
    const gallery = await Gallery.findById(params.id);

    if (!gallery) {
      return NextResponse.json({ error: "gallery not found" }, { status: 404 });
    }

    const response = NextResponse.json({ gallery });
    response.headers.set(
      "Access-Control-Allow-Origin",
      "http://localhost:3001"
    );
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
