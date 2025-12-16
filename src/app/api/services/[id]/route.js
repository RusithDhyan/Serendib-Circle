import { connectDB } from "@/lib/mongodb";
import Service from "@/models/Service";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  const { id } = params; // no await here

  try {
    await connectDB();
    const formData = await request.formData();

    const updates = {
      service_type: formData.getAll("service_type"),
    };

    const updatedService = await Service.findByIdAndUpdate(id, updates, {
      new: true,
    }).lean();

    if (!updatedService) {
      return NextResponse.json(
        { message: "Service not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedService, { status: 200 });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { message: "Failed to update service", error },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const { id } = params;

  try {
    await connectDB();
    const deletedService = await Service.findByIdAndDelete(id).lean();
    if (!deletedService) {
      return NextResponse.json(
        { message: "Service not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ message: "Service deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete Service", error },
      { status: 500 }
    );
  }
}

export async function GET(req, { params }) {
  try {
    await connectDB();
    const room = await Service.findById(params.id).lean();

    if (!room) {
      return NextResponse.json({ error: "room not found" }, { status: 404 });
    }

    const response = NextResponse.json({ room });
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
