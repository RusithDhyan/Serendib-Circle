import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import AboutBottom from "@/models/AboutBottom";

export async function PUT(request, { params }) {
  const { id } = params;
  try {
    const formData = await request.formData();
    const fields = {
      title: formData.get("title"),
      description: formData.get("description"),
    };

    await connectDB();
    const updatedAboutContent = await AboutBottom.findByIdAndUpdate(id, fields, { new: true }).lean();

    if (!updatedAboutContent) {
      return NextResponse.json({ message: "Content not found" }, { status: 404 });
    }

    return NextResponse.json(updatedAboutContent);
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json({ message: "Failed to update content", error }, { status: 500 });
  }
}

export async function DELETE(request, context) {
  const { id } = context.params;

  try {
    await connectDB();
    const deletedAboutContent = await AboutBottom.findByIdAndDelete(id).lean();
    if (!deletedAboutContent) {
      return NextResponse.json({ message: "Content not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Content deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to delete Content", error }, { status: 500 });
  }
}


