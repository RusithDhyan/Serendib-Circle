import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import Admin from "@/models/Admin";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: "All fields required" }, { status: 400 });
    }

    await connectDB();

    const admin = await Admin.findOne({ email }).select("+password"); // include password if it's hidden in schema
    if (!admin) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const passwordMatch = await bcrypt.compare(password, admin.password);
    if (!passwordMatch) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const token = jwt.sign(
      { id: admin._id, role_level: admin.role_level },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const { password: _, ...adminData } = admin._doc;

    return NextResponse.json({
      success: true,
      admin: adminData, // includes role_level now
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}
