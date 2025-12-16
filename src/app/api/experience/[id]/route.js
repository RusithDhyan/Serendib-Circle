// app/api/users/[id]/route.js

import { connectDB } from "@/lib/mongodb";
import Experience from "@/models/Experience";
import { NextResponse } from "next/server";
import fs from "fs";
import { writeFile } from "fs/promises";
import path from "path";

export async function PUT(request, { params }) {
  const { id } = params;
  const formData = await request.formData();

  try {
    await connectDB();

    const updates = {
      type: formData.get("type"),
      title: formData.get("title"),
      description: formData.get("description"),
      main_title: formData.get("main_title"),
      main_description: formData.get("main_description"),
      body_title: formData.get("body_title"),
      body_description: formData.get("body_description"),
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
            updates[fieldName] = `https://serendib.serendibhotels.mw/api/uploads/${filename}`;
          }
        }

        await handleImage(formData.get("image"), "image");
        await handleImage(formData.get("bg_image"), "bg_image");
        await handleImage(formData.get("image_slider"), "image_slider");

    // if (image_slider && Array.isArray(image_slider)) {
    //   const imagePaths = await Promise.all(
    //     image_slider.map(async (file) => {
    //       if (file && typeof file === "object") {
    //         return await saveImage(file);
    //       }
    //     })
    //   );
    //   updates.image_slider = imagePaths.filter(Boolean);
    // }

    const bulletPointsRaw = formData.get("bulletPoints");
    if (bulletPointsRaw) {
      updates.bulletPoints = JSON.parse(bulletPointsRaw);
    }

    const updatedExperience = await Experience.findByIdAndUpdate(id, updates, {
      new: true,
    }).lean();

    if (!updatedExperience) {
      return NextResponse.json(
        { message: "Experience not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, experience: updatedExperience },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update Experience", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, context) {
  const { id } = context.params;
  try {
    await connectDB();
    const deletedExperience = await Experience.findByIdAndDelete(id).lean();
    if (!deletedExperience) {
      return NextResponse.json(
        { message: "Experience not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Experience deleted" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete Experience", error },
      { status: 500 }
    );
  }
}

const ALLOWED_ORIGINS = [
  "https://serendibhotels.mw",
    "https://www.serendibhotel.com",
  "http://localhost:3000",
];

export async function OPTIONS(req) {
  const origin = req.headers.get("origin");
  const response = new NextResponse(null, { status: 204 }); // No Content

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
    const experience = await Experience.findById(params.id);

    if (!experience) {
      return NextResponse.json(
        { success: false, error: "Experience not found" },
        { status: 404 }
      );
    }

    const response = NextResponse.json({ success: true, data: experience });

    if (ALLOWED_ORIGINS.includes(origin)) {
      response.headers.set("Access-Control-Allow-Origin", origin);
      response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
      response.headers.set("Access-Control-Allow-Headers", "Content-Type");
    }

    return response;
  } catch (error) {
    console.error("❌ GET /api/experience/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}

