import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import mongoose from "mongoose";

const ROLE_LEVEL = {
  owner: 5,
  admin: 4,
  manager: 3,
  supervisor: 2,
  moderator: 1,
  guest: 0,
};

export async function PUT(request, { params }) {
  const  id  = params;
  const formData = await request.formData();

  try {
    await connectDB();
    const updates = {
      fullname: formData.get("fullname"),
      email: formData.get("email"),
      role: formData.get("role"),
      phone: formData.get("phone"),
    };

    const updatedHotel = await Hotel.findByIdAndUpdate(id, updates, {
      new: true,
    }).lean();

    if (!updatedHotel) {
      return NextResponse.json({ message: "Hotel not found" }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, hotel: updatedHotel },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update hotel", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  const { id } = params;

  try {
        const session = await getServerSession(authOptions);
    

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Only allow users with canManageUsers permission
    if (!session.permissions?.canDeleteUsers) {
      return NextResponse.json(
        { success: false, error: "You do not have permission to delete users" },
        { status: 403 }
      );
    }

    await connectDB();
    const userToDelete = await User.findById(id);
    if (!userToDelete) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Prevent deleting users with equal or higher role
    if (ROLE_LEVEL[userToDelete.role] >= ROLE_LEVEL[session.user.role]) {
      return NextResponse.json(
        { success: false, error: "Cannot delete user with equal or higher role" },
        { status: 403 }
      );
    }

    await User.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete user", error: error.message },
      { status: 500 }
    );
  }
}


export async function GET(req, { params }) {
  try {
    await connectDB();

    const  {id}  = await params; // ✅ Correct way to get `id`

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid user ID" },
        { status: 400 }
      );
    }

    const user = await User.findById(id).populate("addedBy", "name email role").lean();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
