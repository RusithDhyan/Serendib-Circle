import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import fs from "fs";
import HomeBottom from "@/models/HomeBottom";

export async function PUT(request, { params }) {
  const { id } = params;
  const formData = await request.formData();

  try {
    await connectDB();
    const updates = {
      title: formData.get("title"),
      description: formData.get("description"),
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
    
        await handleImage(formData.get("bg_image"), "bg_image");

    const updatedHomeBottomContent = await HomeBottom.findByIdAndUpdate(id, updates, {
      new: true,
    }).lean();

    if (!updatedHomeBottomContent) {
      return NextResponse.json({ message: "HomeBottomContent not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, homeContent: updatedHomeBottomContent }, { status: 200 });
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
    const deletedHomeBottomContent = await HomeBottom.findByIdAndDelete(id).lean();
    if (!deletedHomeBottomContent) {
      return NextResponse.json({ message: "HomeBottomContent not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "HomeBottomContent deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to delete HomeBottomContent", error }, { status: 500 });
  }
}