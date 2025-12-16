import { connectDB } from "@/lib/mongodb";
import Admin from "@/models/Admin";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  const { id } = params;

  try {
    await connectDB();
    const { permissions } = await req.json();

    const updatedUser = await Admin.findByIdAndUpdate(
      id,
      { permissions },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedUser });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Failed to update permissions" },
      { status: 500 }
    );
  }
}
