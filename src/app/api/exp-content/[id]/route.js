import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import ExperienceContent from "@/models/ExperienceContent";

export async function PUT(request, { params }) {
  const { id } = params;
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

export async function DELETE(request, { params }) {
  const { id } = params;

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
