import { connectDB } from "@/lib/mongodb";
import { writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import BlogContent from "@/models/BlogContent";
import fs from "fs";

export async function PUT(request, context) {
  const { id } = await context.params;
  try {
    const formData = await request.formData();
    const fields = {
      title: formData.get("title"),
      description: formData.get("description"),
      bullet_title: formData.get("bullet_title"),
     
    };
     const bulletPointsRaw = formData.get("bulletPoints");
    if (bulletPointsRaw) {
      fields.bulletPoints = JSON.parse(bulletPointsRaw);
    }

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
    
        await handleImage(formData.get("image"), "image");

    await connectDB();
    const updatedBlog = await BlogContent.findByIdAndUpdate(id, fields, { new: true }).lean();

    if (!updatedBlog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(updatedBlog);
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json({ message: "Failed to update blog", error }, { status: 500 });
  }
}
export async function DELETE(request, {params}) {
  const { id } = await params;

  try {
    await connectDB();
    const deletedBlog = await BlogContent.findByIdAndDelete(id).lean();
    if (!deletedBlog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Blog deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to delete Blog", error }, { status: 500 });
  }
}

export async function GET(req, context) {
  try {
    await connectDB();
    const { id } = await context.params; 
    const blog = await BlogContent.findById(id);

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    const response = NextResponse.json({ blog }, { status: 200 });
    response.headers.set(
      "Access-Control-Allow-Origin",
      "http://localhost:3000"
    );
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    return response;
  } catch (error) {
    console.error("❌ GET /api/blog-content/[id] error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

