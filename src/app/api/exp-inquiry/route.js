import { sendExperienceInquiry } from "@/lib/expInquiry";
import { connectDB } from "@/lib/mongodb";
import ExperienceInquiry from "@/models/ExperienceInquiry";
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


export async function POST(req) {
  const origin = req.headers.get("origin");

  const formData = await req.formData();

    const t = formData.get("t");
    const cs = formData.get("cs");

    if (!t || !cs) {
      let res = NextResponse.json(
        { success: false, error: "Missing security parameters" },
        { status: 400 }
      );
      return setCorsHeaders(res, origin);
    }

    if (Math.abs(Date.now() - parseInt(t)) > EXPIRY_LIMIT) {
      let res = NextResponse.json(
        { success: false, error: "Expired request" },
        { status: 401 }
      );
      return setCorsHeaders(res, origin);
    }

    const serverChecksum = crypto
      .createHash("sha256")
      .update(t + process.env.API_KEY)
      .digest("hex");

    if (serverChecksum !== cs) {
      let res = NextResponse.json(
        { success: false, error: "Invalid checksum" },
        { status: 401 }
      );
      return setCorsHeaders(res, origin);
    }

  try {

    // --- reCAPTCHA ---
    const recaptchaToken = formData.get("g-recaptcha-response");
    if (!recaptchaToken) {
      let res = NextResponse.json(
        { success: false, error: "Missing reCAPTCHA token" },
        { status: 400 }
      );
      return setCorsHeaders(res, origin);
    }

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
      let res = NextResponse.json(
        { success: false, error: "Failed reCAPTCHA verification" },
        { status: 400 }
      );
      return setCorsHeaders(res, origin);
    }

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      "IP not found";

    const expId = formData.get("selectedExpId");
    const name = formData.get("name");
    const email = formData.get("email");
    const phone = formData.get("phone");
    const exp_type = formData.get("exp_type");
    const title = formData.get("title");
    const message = formData.get("message");

    await connectDB();

    const existingInquiry = await ExperienceInquiry.findOne({ expId, message });
    
    if (existingInquiry) {
      let res = NextResponse.json(
        { success: false, error: "You have already submitted this inquiry." },
        { status: 400 }
      );
      return setCorsHeaders(res, origin);
    }

    const newInquiry = await ExperienceInquiry.create({
      expId,
      name,
      email,
      phone,
      exp_type,
      title,
      message,
      ip_address: ip,
      submitted_at: new Date(),
    });

    await sendExperienceInquiry({
      name,
      email,
      phone,
      exp_type,
      title,
      message,
      ip_address: ip,
      submitted_at: new Date(),
    });

    let res = NextResponse.json({ success: true, data: newInquiry }, { status: 200 });
    return setCorsHeaders(res, origin);
  } catch (error) {
    let res = NextResponse.json({ success: false, error: error.message }, { status: 500 });
    return setCorsHeaders(res, origin);
  }
}


// ✅ GET handler
export async function GET(req) {
  const origin = req.headers.get("origin");

  // --- 1. Read query parameters ---
  const t = req.nextUrl.searchParams.get("t");
  const cs = req.nextUrl.searchParams.get("cs");

  if (!t || !cs) {
    let res = NextResponse.json(
      { success: false, error: "Missing parameters" },
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
    .update(t + process.env.API_KEY)
    .digest("hex");

  // console.log("Backend API Key:", process.env.API_KEY);

  if (serverChecksum !== cs) {
    let res = NextResponse.json(
      { success: false, error: "Invalid checksum" },
      { status: 401 }
    );
    return setCorsHeaders(res, origin);
  }
  try {
    await connectDB();
    const experience = await ExperienceInquiry.find();

    const response = new NextResponse(
      JSON.stringify({ success: true, data: experience })
    );

    return setCorsHeaders(response, origin);
  } catch (error) {
    const response = NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
    return response;
  }
}
