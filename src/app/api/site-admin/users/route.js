import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import User from "@/models/User";


const ROLE_LEVEL = {
  owner: 5,
  admin: 4,
  manager: 3,
  supervisor: 2,
  moderator: 1,
  user: 0,
};


const ALLOWED_ORIGINS = [
  "https://www.serendibhotels.mw",
  "https://serendibhotels.mw",
  "https://serendibhotel.com",
  "https://www.serendibhotel.com",
  "http://localhost:3000",
];

const EXPIRY_LIMIT = 3 * 60 * 1000; // 3 minutes

function setCorsHeaders(response, origin) {
  if (ALLOWED_ORIGINS.includes(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  }
  return response;
}

export async function OPTIONS(req) {
  const origin = req.headers.get("origin");
  let res = new NextResponse(null, { status: 204 });
  return setCorsHeaders(res, origin);
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  const formData = await req.formData();
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");
  const newRole = formData.get("role");
  const phone = formData.get("phone");
  
  try {
    if (!name || !email || !password) {
      return NextResponse.json({ message: "All fields required" }, { status: 400 });
    }
    await connectDB();
    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json({ message: "Email already registered" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    if (!session)
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );

      console.log("current user",session.user.name);
      
    if (ROLE_LEVEL[session.user.role] <= ROLE_LEVEL[newRole]) {
      return NextResponse.json(
        {
          success: false,
          error: "You cannot create a user with equal or higher role.",
        },
        { status: 403 }
      );
    }

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: newRole,
      phone,
      addedBy: session.user.id
    });    
     const { password: _, ...newSiteUser } = newUser._doc;

    const response = NextResponse.json({
      success: true,
      data: newSiteUser,
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
  
    // --- 1. Read query parameters ---
    const t = req.nextUrl.searchParams.get("t");
    const cs = req.nextUrl.searchParams.get("cs");
  
    if (!t || !cs) {
      let res = NextResponse.json({ success: false, error: "Missing parameters" }, { status: 400 });
      return setCorsHeaders(res, origin);
    }
  
    // --- 2. Validate timestamp ---
    if (Math.abs(Date.now() - parseInt(t)) > EXPIRY_LIMIT) {
      let res = NextResponse.json({ success: false, error: "Expired request" }, { status: 401 });
      return setCorsHeaders(res, origin);
    }
  
    // --- 3. Validate checksum ---
    const serverChecksum = crypto
      .createHash("sha256")
      .update(t + process.env.API_KEY)
      .digest("hex");
    
    if (serverChecksum !== cs) {
      let res = NextResponse.json({ success: false, error: "Invalid checksum" }, { status: 401 });
      return setCorsHeaders(res, origin);
    }

  try {
    await connectDB();
    const users = await User.find().sort({ createdAt: -1 });
    const response = NextResponse.json({ success: true, data: users });
    return setCorsHeaders(response, origin);
  } catch (error) {
    let res = NextResponse.json({ success: false, error: error.message }, { status: 500 });
    return setCorsHeaders(res, origin);
  }
}
