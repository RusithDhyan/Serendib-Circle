import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";
import MetaData from "@/models/MetaData";

export async function GET(req) {
  const url = new URL(req.url);
  const hotelId = url.searchParams.get("hotelId");

  try {
    await connectDB();

    const query = hotelId
      ? { hotelId: new mongoose.Types.ObjectId(hotelId) }
      : {};

    const meta = await MetaData.find(query);
    return NextResponse.json({ success: true, data: meta });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    const hotelId = formData.get("hotelId");
    const meta_title = formData.get("meta_title");
    const meta_description = formData.get("meta_description");

    await connectDB();

    const meta = await MetaData.create({
      hotelId,
      meta_title,
      meta_description,
    });

    return NextResponse.json({ success: true, data: meta });
  } catch (error) {
    console.error("POST Offer Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}