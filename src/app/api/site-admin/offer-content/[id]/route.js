import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import OfferContent from "@/models/OfferContent";

export async function PUT(request, { params }) {
  const { id } = params;
  const formData = await request.formData();

  try {
    await connectDB();

    const fields = {
      title: formData.get("title"),
      subtitle: formData.get("subtitle"),
      description: formData.get("description"),

      price: formData.get("price"),
      validity: formData.get("validity"),
    };

    const bulletPointsRaw = formData.get("bulletPoints");
    if (bulletPointsRaw) {
      fields.bulletPoints = JSON.parse(bulletPointsRaw);
    }

    const updatedOffer = await OfferContent.findByIdAndUpdate(id, fields, {
      new: true,
    }).lean();

    if (!updatedOffer) {
      return NextResponse.json({ message: "Offer not found" }, { status: 404 });
    }

    return NextResponse.json(updatedOffer);
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
    const deletedOffer = await OfferContent.findByIdAndDelete(id).lean();
    if (!deletedOffer) {
      return NextResponse.json({ message: "Offer not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Offer deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete Offer", error },
      { status: 500 }
    );
  }
}

export async function GET(req, { params }) {
  try {
    await connectDB();
    const offer = await OfferContent.findById(params.id);
    if (!offer) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 });
    }
    const response = NextResponse.json({ offer });
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
