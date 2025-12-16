import { connectDB } from "@/lib/mongodb";
import MetaData from "@/models/MetaData";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  const { id } = params;
  const formData = await request.formData();

  try {
    await connectDB();

    const updates = {
      meta_title: formData.get("meta_title"),
      meta_description: formData.get("meta_description"),
    };  

    const updatedMeta = await MetaData.findByIdAndUpdate(id, updates, { new: true }).lean();

    if (!updatedMeta) {
      return NextResponse.json({ message: "Meta not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, meta: updatedMeta }, { status: 200 });
  } catch (error) {
    console.error("PUT Meta Error:", error);
    return NextResponse.json(
      { message: "Failed to update Meta", error: error.message },
      { status: 500 }
    );
  }
}
export async function DELETE(request,context) {

  try {
    await connectDB();
      const { id } = await context.params;

    const deletedMeta = await MetaData.findByIdAndDelete(id);
    if (!deletedMeta) {
      return NextResponse.json({ message: "Meta not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Meta deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete Meta", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req, { params }) {
  try {
    await connectDB();
    const meta = await MetaData.findById(params.id).lean();

    if (!meta) {
      return NextResponse.json({ error: "meta not found" }, { status: 404 });
    }

    return NextResponse.json({meta});
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}