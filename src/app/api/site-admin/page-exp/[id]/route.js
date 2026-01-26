// app/api/users/[id]/route.js
import { connectDB } from "@/lib/mongodb";
import PageExp from "@/models/PageExp";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import fs from "fs";

export async function PUT(request, context) {
  const { id } = await context.params;

  const formData = await request.formData();

  try {
    await connectDB();

    const updates = {
      description_right: formData.get("description_right"),
      description_left: formData.get("description_left"),
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
        updates[
          fieldName
        ] = `https://serendib.serendibhotels.mw/api/uploads/${filename}`;
      }
    }

    await handleImage(formData.get("image_right"), "image_right");
    await handleImage(formData.get("image_left"), "image_left");

    const updatedPageExp = await PageExp.findByIdAndUpdate(id, updates, {
      new: true,
    }).lean();
    if (!updatedPageExp) {
      return NextResponse.json(
        { message: "PageExp not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(updatedPageExp, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update user", error },
      { status: 500 }
    );
  }
}

export async function DELETE(request, context) {
  const { id } = await context.params;
  try {
    await connectDB();
    const deletedPageExp = await PageExp.findByIdAndDelete(id).lean();
    if (!deletedPageExp) {
      return NextResponse.json(
        { message: "PageExp not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ message: "PageExp deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete PageExp", error },
      { status: 500 }
    );
  }
}

export async function GET(req, { params }) {
  try {
    await connectDB();
    const exp = await PageExp.findById(params.id).lean();

    if (!exp) {
      return NextResponse.json({ error: "exp not found" }, { status: 404 });
    }

    const response = NextResponse.json({ exp });
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
