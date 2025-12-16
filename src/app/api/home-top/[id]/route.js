import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import HomeTop from "@/models/HomeTop";
import fs from "fs";

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
   
           await handleImage(formData.get("main_image"), "main_image");

           const images = formData.getAll("content_images"); // getAll returns an array of files
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
           
                 updates.content_images = uploadedImages; // store array of URLs
               }

    const updatedHomeContent = await HomeTop.findByIdAndUpdate(id, updates, {
      new: true,
    }).lean();

    if (!updatedHomeContent) {
      return NextResponse.json({ message: "HomeContent not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, homeContent: updatedHomeContent }, { status: 200 });
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
    const deletedHomeContent = await HomeTop.findByIdAndDelete(id).lean();
    if (!deletedHomeContent) {
      return NextResponse.json({ message: "HomeContent not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "HomeContent deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to delete HomeContent", error }, { status: 500 });
  }
}