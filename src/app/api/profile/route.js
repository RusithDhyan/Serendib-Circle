import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import Admin from "@/models/Admin";
import { writeFile } from "fs/promises";
import path from "path";

export async function GET(req) {
  try {
    await connectDB();

    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 });
    }

    const admin = await Admin.findById(decoded.id).select("-password");
    if (!admin) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, admin });
  } catch (error) {
    return NextResponse.json({ message: "Server error", error }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await connectDB();

    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 });
    }

    const formData = await req.formData();
    const email = formData.get("email");
    const fullname = formData.get("fullname");
    const phone = formData.get("phone");
    const image = formData.get("image");

    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    admin.email = email;
    admin.fullname = fullname;
    admin.phone = phone;

    if (image && typeof image === "object") {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
        const filename = `${Date.now()}-${image.name}`;
        const filepath = path.join(process.cwd(), "uploads", filename);

      await writeFile(filepath, buffer);

      admin.profileImage = `https://serendib.serendibhotels.mw/api/uploads/${filename}`;

      // If you want to save the path to DB: admin.profileImage = "/all-images/profile/profile.jpeg";
    }

    await admin.save();
    const updatedAdmin = await Admin.findById(admin._id).select("-password");

    return NextResponse.json({ success: true, admin: updatedAdmin });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ message: "Server error", error }, { status: 500 });
  }
}
