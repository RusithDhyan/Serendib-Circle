import { NextResponse } from "next/server";
import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { generateLoyaltyNumber } from "@/lib/loyalty";

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    await connectDB();
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists with this email" },
        { status: 400 }
      );
    }

    // ✅ HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);
    const loyaltyNumber = generateLoyaltyNumber();

    const user = await User.create({
      name,
      email,
      password: hashedPassword, // ✅ store hashed
      loyaltyNumber: loyaltyNumber
    });

    return NextResponse.json(
      {
        message: "User created successfully",
        user: {
          id: user._id,
          loyaltyNumber: user.loyaltyNumber,
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
