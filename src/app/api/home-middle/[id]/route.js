import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import HomeMiddle from "@/models/HomeMiddle";
import fs from "fs";

export async function PUT(request, { params }) {
  const { id } = params;
  const formData = await request.formData();

  try {
    await connectDB();
    const updates = {
      map_title: formData.get("map_title"),
      map_description: formData.get("map_description"),
      blog_title: formData.get("blog_title"),
      blog_description: formData.get("blog_description"),
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
    
        await handleImage(formData.get("blog_image"), "blog_image");
    const updatedHomeMiddleContent = await HomeMiddle.findByIdAndUpdate(id, updates, {
      new: true,
    }).lean();

    if (!updatedHomeMiddleContent) {
      return NextResponse.json({ message: "HomeMiddleContent not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, homeContent: updatedHomeMiddleContent }, { status: 200 });
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
    const deletedHomeMiddleContent = await HomeMiddle.findByIdAndDelete(id).lean();
    if (!deletedHomeMiddleContent) {
      return NextResponse.json({ message: "HomeMiddleContent not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "HomeMiddleContent deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to delete HomeMiddleContent", error }, { status: 500 });
  }
}