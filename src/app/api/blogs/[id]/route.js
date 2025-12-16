// app/api/blogs/[id]/route.js
import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { writeFile, mkdir } from "fs/promises";
import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  const { id } = params;

  try {
    const formData = await request.formData();

    const fields = {
      title: formData.get("title"),
      description: formData.get("description"),
      main_title: formData.get("main_title"),
      main_description: formData.get("main_description"),
      body_title: formData.get("body_title"),
      body_description: formData.get("body_description"),
      bottom_title: formData.get("bottom_title"),
      bottom_description: formData.get("bottom_description"),
    };

    // ✅ Uploads directory (outside /public)
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
        fields[fieldName] = `https://serendib.serendibhotels.mw/api/uploads/${filename}`;
      }
    }

    await handleImage(formData.get("thumbnail"), "thumbnail");
    await handleImage(formData.get("bg_image"), "bg_image");
    await handleImage(formData.get("cover_image"), "cover_image");

    await connectDB();
    const updatedBlog = await Blog.findByIdAndUpdate(id, fields, { new: true }).lean();

    if (!updatedBlog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    const response = NextResponse.json({ success: true, data: updatedBlog });
    return response;
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json({ message: "Failed to update blog", error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, context) {
  const { id } = context.params;

  try {
    await connectDB();
    const deletedBlog = await Blog.findByIdAndDelete(id).lean();
    if (!deletedBlog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Blog deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to delete Blog", error }, { status: 500 });
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

export async function GET(req, context) {
  const origin = req.headers.get("origin");

  try {
    await connectDB();

    const { id } = await context.params;
    const blog = await Blog.findById(id);

    if (!blog) {
      return NextResponse.json({ success: false, error: "Blog not found" }, { status: 404 });
    }

    const response = NextResponse.json({ success: true, data: blog }, { status: 200 });

    if (ALLOWED_ORIGINS.includes(origin)) {
      response.headers.set("Access-Control-Allow-Origin", origin);
      response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
      response.headers.set("Access-Control-Allow-Headers", "Content-Type");
    }

    return response;
  } catch (error) {
    console.error("❌ GET /api/blogs/[id] error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}


