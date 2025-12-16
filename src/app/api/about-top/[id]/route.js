import { connectDB } from "@/lib/mongodb";
import { writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import AboutTop from "@/models/AboutTop";
import fs from "fs";

export async function PUT(request, { params }) {
  const { id } = params;
  try {
    const formData = await request.formData();

    const fields = {
      title: formData.get("title"),
      description: formData.get("description"),
      body_title: formData.get("body_title"),
      body_description: formData.get("body_description"),
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
            fields[fieldName] = `https://serendib.serendibhotels.mw/api/uploads/${filename}`;
          }
        }
    
        await handleImage(formData.get("content_image"), "content_image");
        await handleImage(formData.get("bg_image"), "bg_image");

    await connectDB();
    const updatedAboutContent = await AboutTop.findByIdAndUpdate(id, fields, { new: true }).lean();

    if (!updatedAboutContent) {
      return NextResponse.json({ message: "Content not found" }, { status: 404 });
    }

    return NextResponse.json(updatedAboutContent);
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json({ message: "Failed to update content", error }, { status: 500 });
  }
}

export async function DELETE(request, context) {
  const { id } = context.params;

  try {
    await connectDB();
    const deletedAboutContent = await AboutTop.findByIdAndDelete(id).lean();
    if (!deletedAboutContent) {
      return NextResponse.json({ message: "Content not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Content deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to delete Content", error }, { status: 500 });
  }
}


