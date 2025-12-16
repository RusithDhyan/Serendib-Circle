import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import fs from "fs";
import HomeExp from "@/models/HomeExp";

export async function PUT(request, { params }) {
  const { id } = params;
  const formData = await request.formData();

  try {
    await connectDB();

    const updates = {
      type: formData.get("type"),
      title: formData.get("title"),
      description: formData.get("description"),
      card_title: formData.get("card_title"),
      card_description: formData.get("card_description")
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
            updates[fieldName] = `https://serendib.serendibhotels.mw/api/uploads/${filename}`;
          }
        }
    
        await handleImage(formData.get("card_image"), "card_image");

    const updatedHomeExp = await HomeExp.findByIdAndUpdate(id, updates, {
      new: true,
    }).lean();

    if (!updatedHomeExp) {
      return NextResponse.json({ message: "HomeExp not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, homeExp: updatedHomeExp }, { status: 200 });
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
    const deletedHomeContent = await HomeExp.findByIdAndDelete(id).lean();
    if (!deletedHomeContent) {
      return NextResponse.json({ message: "HomeContent not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "HomeContent deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to delete HomeContent", error }, { status: 500 });
  }
}