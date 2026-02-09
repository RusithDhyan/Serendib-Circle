import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { getToken } from "next-auth/jwt";
import User from "@/models/User";

export async function POST(req) {
  try {
    await connectDB();

    // ✅ get token (includes provider)
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token || !token.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    console.log(token.id);

    const { currentPassword, newPassword } = await req.json();

   let user;

// For credentials users, token.id is Mongo ObjectId
if (/^[0-9a-fA-F]{24}$/.test(token.id)) {
  user = await User.findById(token.id);
} else {
  // For Google users, fallback to email
  user = await User.findOne({ email: token.email });
}

if (!user) {
  return NextResponse.json({ message: "User not found" }, { status: 404 });
}


    // 🔹 Skip current password for Google users
    if (token.provider !== "google") {
      if (!currentPassword) {
        return NextResponse.json(
          { message: "Current password is required" },
          { status: 400 }
        );
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return NextResponse.json(
          { message: "Current password is incorrect" },
          { status: 400 }
        );
      }
    }

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    user.password = await bcrypt.hash(newPassword, 10);
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
