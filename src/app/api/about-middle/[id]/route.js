import { connectDB } from "@/lib/mongodb";
import { writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import AboutMiddle from "@/models/AboutMiddle";
import fs from "fs";

export async function PUT(request, { params }) {
  const { id } = params;
  try {
    const formData = await request.formData();
    const fields = {
      card_title: formData.get("card_title"),
      card_description: formData.get("card_description"),
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
   
       await handleImage(formData.get("card_image"), "card_image");

    await connectDB();
    const updatedAboutContent = await AboutMiddle.findByIdAndUpdate(id, fields, { new: true }).lean();

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
    const deletedAboutContent = await AboutMiddle.findByIdAndDelete(id).lean();
    if (!deletedAboutContent) {
      return NextResponse.json({ message: "Content not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Content deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to delete Content", error }, { status: 500 });
  }
}


