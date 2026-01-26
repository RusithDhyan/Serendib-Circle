import { connectDB } from "@/lib/mongodb";
import { sendEmail } from "@/lib/offerInquiry";
import OfferInquiry from "@/models/OfferInquiry";
import { NextResponse } from "next/server";
import crypto from "crypto";

const RECAPTCHA_SECRET_KEY = "6LfhKG4rAAAAACR9zJQe49CBsfObE_Uu4qFrDHkz";

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
    await connectDB();

    const offer_inquiry = await OfferInquiry.find();
    const response = NextResponse.json({ success: true, data: offer_inquiry });
    return setCorsHeaders(response, origin);

  } catch (error) {
    const response = NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
    return response;

  }
}

export async function POST(req) {
const formData = await req.formData();
  const origin = req.headers.get("origin");
      
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
          try {
    const recaptchaToken = formData.get("g-recaptcha-response");
    // Verify reCAPTCHA
    const verifyRes = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
      }
    );
    const verifyData = await verifyRes.json();

    if (!verifyData.success) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: "Failed reCAPTCHA verification",
        }),
        { status: 400, headers }
      );
    }

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      req.ip ||
      "IP not found";

    const name = formData.get("name");
    const email = formData.get("email");
    const offer_title = formData.get("offer_title");
    const phone = formData.get("phone");
    const inquiry_type = formData.get("inquiry_type");
    const message = formData.get("message");

    await connectDB();
    const existingInquiry = await OfferInquiry.findOne({
      email,
        message
        });
    
        if (existingInquiry) {
          return new NextResponse(
            JSON.stringify({
              success: false,
              error: "You have already submitted this inquiry.",
            }),
            { status: 400, headers }
          );
        }
    const submittedAt = new Date();

    const newOfferInquiry = await OfferInquiry.create({
      name,
      email,
      offer_title,
      phone,
      inquiry_type,
      message,
      ip_address: ip,
      submitted_at: submittedAt,
    });

    await sendEmail({
      name,
      email,
      offer_title,
      phone,
      inquiry_type,
      message,
      ip,
      submitted_at: submittedAt,
    });

    const response = NextResponse.json({
      success: true,
      data: newOfferInquiry,
    });

    if (ALLOWED_ORIGINS.includes(origin)) {
      response.headers.set("Access-Control-Allow-Origin", origin);
      response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    }

    return response;
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
