import { connectDB } from "@/lib/mongodb";
import Admin from "@/models/Admin";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getCurrentUser } from "@/utils/auth";

const ROLE_LEVEL = {
  owner: 5,
  admin: 4,
  manager: 3,
  supervisor: 2,
  moderator: 1,
  user: 0,
};

export async function POST(req) {
  const currentUser = await getCurrentUser(req);
  const formData = await req.formData();
  const fullname = formData.get("fullname");
  const email = formData.get("email");
  const password = formData.get("password");
  const newRole = formData.get("role");
  const phone = formData.get("phone");
  
  try {
    if (!fullname || !email || !password) {
      return NextResponse.json({ message: "All fields required" }, { status: 400 });
    }
    await connectDB();
    const existing = await Admin.findOne({ email });
    if (existing) {
      return NextResponse.json({ message: "Email already registered" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    if (!currentUser)
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );

      console.log("current user",currentUser.fullname);
      
    if (ROLE_LEVEL[currentUser.role] <= ROLE_LEVEL[newRole]) {
      return NextResponse.json(
        {
          success: false,
          error: "You cannot create a user with equal or higher role.",
        },
        { status: 403 }
      );
    }
    const newUser = await Admin.create({
      fullname,
      email,
      password: hashedPassword,
      role: newRole,
      phone,
      addedBy: currentUser._id
    });
     const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    
     const { password: _, ...newSiteUser } = newUser._doc;

    const response = NextResponse.json({
      success: true,
      data: newSiteUser,
      token,
    });
    response.headers.set(
      "Access-Control-Allow-Origin",
      "http://localhost:3001"
    );
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ✅ Actual GET handler
export async function GET(req) {
  const origin = req.headers.get("origin");

  try {
    await connectDB();
    const users = await Admin.find();
    const response = NextResponse.json({ success: true, data: users });
    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
