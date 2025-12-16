import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import {connectDB} from "@/lib/mongodb";
import Admin from "@/models/Admin";
import { getCurrentUser } from "@/utils/auth";

export async function POST(req) {
    
  try {
    await connectDB();
    const currentUser = await getCurrentUser(req);
    const { currentPassword, newPassword } = await req.json();

    const userId = currentUser._id;

    // 🔹 Find the user in DB
    const user = await Admin.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    // 🔹 Check if current password is correct
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Current password is incorrect" },
        { status: 400 }
      );
    }

    // 🔹 Hash new password and save
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordExpire = new Date();

    await user.save();

    return NextResponse.json(
      { message: "Password updated successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
