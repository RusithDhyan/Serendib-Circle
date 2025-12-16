import { connectDB } from "@/lib/mongodb";
import NewsLetter from "@/models/NewsLetter";
import { NextResponse } from "next/server";
import crypto from "crypto";

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

  try {
    const origin = req.headers.get("origin");
          const formData = await req.formData();
        
          // --- 1. Security fields ---
          const t = formData.get("t");
          const cs = formData.get("cs");
        
          if (!t || !cs) {
            let res = NextResponse.json(
              { success: false, error: "Missing security parameters" },
              { status: 400 }
            );
            return setCorsHeaders(res, origin);
          }
        
          // --- 2. Validate timestamp ---
          if (Math.abs(Date.now() - parseInt(t)) > EXPIRY_LIMIT) {
            let res = NextResponse.json(
              { success: false, error: "Expired request" },
              { status: 401 }
            );
            return setCorsHeaders(res, origin);
          }
        
          // --- 3. Validate checksum ---
          const serverChecksum = crypto
            .createHash("sha256")
            .update(t + process.env.API_KEY) // Private key (secure)
            .digest("hex");
        
          if (serverChecksum !== cs) {
            let res = NextResponse.json(
              { success: false, error: "Invalid checksum" },
              { status: 401 }
            );
            return setCorsHeaders(res, origin);
          }

    // ✅ Check origin first
    if (!ALLOWED_ORIGINS.includes(origin)) {
      return NextResponse.json(
        { success: false, error: "CORS error: Origin not allowed" },
        { status: 403 }
      );
    }

    await connectDB(); // connect DB before querying

    const email = formData.get("email");

    // Get client IP
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      "IP not found";

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    const existing = await NewsLetter.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "This email is already subscribed!" },
        { status: 400 }
      );
    }

    const newsletter = await NewsLetter.create({
      email,
      ip_address: ip,
      submitted_at: new Date(),
    });

    const response = NextResponse.json({ success: true, data: newsletter });

    // ✅ Add CORS headers
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");

    return response;
  } catch (error) {
    console.error("Newsletter POST error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
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
        
            // console.log("Backend API Key:", process.env.API_KEY);
        
          if (serverChecksum !== cs) {
            let res = NextResponse.json({ success: false, error: "Invalid checksum" }, { status: 401 });
            return setCorsHeaders(res, origin);
          }

    await connectDB();

    const newsLetter = await NewsLetter.find();
    let res = NextResponse.json({ success: true, data: newsLetter });
    return setCorsHeaders(res, origin);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
