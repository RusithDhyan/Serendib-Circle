// /api/current-user.js
import { getCurrentUser } from "@/utils/auth";
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
    
        // console.log("Backend API Key:", process.env.API_KEY);
    
      if (serverChecksum !== cs) {
        let res = NextResponse.json({ success: false, error: "Invalid checksum" }, { status: 401 });
        return setCorsHeaders(res, origin);
      }
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    return NextResponse.json({ success: true, data: user });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
