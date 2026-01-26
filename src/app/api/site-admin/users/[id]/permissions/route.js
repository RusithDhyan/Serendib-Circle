import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function PUT(req, context) {

  try {
    await connectDB();

    const {id} = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid user ID" },
        { status: 400 }
      );
    }
    const { permissions } = await req.json();

    const updatedUser = await User.findByIdAndUpdate(
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

    return NextResponse.json({ success: true, data: updatedUser },{status: 200});
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Failed to update permissions"},
      { status: 500 }
    );
  }
}
