import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import ExperienceContent from "@/models/ExperienceContent";
import crypto from "crypto";

const EXPIRY_LIMIT = 3 * 60 * 1000; // 3 minutes

export async function PUT(request, context) {
  const { id } = await context.params;
  
  const t = request.nextUrl.searchParams.get("t");
    const cs = request.nextUrl.searchParams.get("cs");
  
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

  const formData = await request.formData();

  try {
    await connectDB();
    const fields = {
      title: formData.get("title"),
      description: formData.get("description"),

    };

    const bulletPointsRaw = formData.get("bulletPoints");
    if (bulletPointsRaw) {
      fields.bulletPoints = JSON.parse(bulletPointsRaw);
    }
    const updatedExp = await ExperienceContent.findByIdAndUpdate(id, fields, {
      new: true,
    }).lean();

    if (!updatedExp) {
      return NextResponse.json({ message: "Exp not found" }, { status: 404 });
    }

    return NextResponse.json(updatedExp);
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json(
      { message: "Failed to update Offer", error },
      { status: 500 }
    );
  }
}

export async function DELETE(request, context) {
  const { id } = await context.params;

  try {
    await connectDB();
    const deletedExp = await ExperienceContent.findByIdAndDelete(id).lean();
    if (!deletedExp) {
      return NextResponse.json({ message: "Exp not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Exp deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete Exp", error },
      { status: 500 }
    );
  }
}

export async function GET(req, { params }) {
  try {
    await connectDB();
    const exp = await ExperienceContent.findById(params.id);
    if (!exp) {
      return NextResponse.json({ error: "exp not found" }, { status: 404 });
    }
    const response = NextResponse.json({ exp });
    response.headers.set(
      "Access-Control-Allow-Origin",
      "http://localhost:3001"
    );
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    return response;
    
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
