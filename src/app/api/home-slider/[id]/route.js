import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import fs from "fs";
import HomeSlider from "@/models/HomeSlider";

export async function PUT(request, { params }) {
  const { id } = params;
  const formData = await request.formData();

  try {
    await connectDB();

    const updates = {
      title: formData.get("title")
    };

    const uploadDir = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Handle multiple images
    const images = formData.getAll("home_slider_image"); // getAll returns an array of files
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

      updates.home_slider_image = uploadedImages; // store array of URLs
    }

    const updatedHomeSlider = await HomeSlider.findByIdAndUpdate(id, updates, {
      new: true,
    }).lean();

    if (!updatedHomeSlider) {
      return NextResponse.json({ message: "HomeSlider not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, slider: updatedHomeSlider }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update HomeSlider", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const { id } = params;

  try {
    await connectDB();
    const deletedAccommodation = await HomeSlider.findByIdAndDelete(id).lean();
    if (!deletedAccommodation) {
      return NextResponse.json({ message: "Accommodation not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Accommodation deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to delete Accommodation", error }, { status: 500 });
  }
}


export async function GET(req, { params }) {
  try {
    await connectDB();
    const room = await Accommodation.findById(params.id).lean();

    if (!room) {
      return NextResponse.json({ error: "room not found" }, { status: 404 });
    }
    
    const response = NextResponse.json({room});
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