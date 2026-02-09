import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Redemption from "@/models/Redemption";
import Transaction from "@/models/Transaction";

function generateVoucherCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "SC-";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const now = new Date();

    // 🔥 AUTO EXPIRE LOGIC
    await Redemption.updateMany(
      {
        status: "active",
        expiresAt: { $lt: now },
      },
      {
        $set: { status: "expired" },
      }
    );
    // { userId: user._id }
    const redemptions = await Redemption.find().sort({ createdAt: -1 });

    return NextResponse.json(redemptions);
  } catch (error) {
    console.error("Error fetching redemptions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { type, pointsCost } = body;

    await connectDB();
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user has enough points
    if (user.points < pointsCost) {
      return NextResponse.json(
        { error: "Insufficient points" },
        { status: 400 }
      );
    }

    // Calculate dollar value (100 points = $1 USD)
    const dollarValue = pointsCost / 100;

    // Deduct points
    user.points -= pointsCost;
    await user.save();

    // Create redemption voucher
    const voucherCode = generateVoucherCode();
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 6); // 6 months validity

    const redemption = await Redemption.create({
      userId: user._id,
      type,
      pointsCost,
      dollarValue,
      voucherCode,
      expiresAt,
    });

    // Create transaction record
    await Transaction.create({
      userId: user._id,
      type: "redeem",
      amount: dollarValue,
      points: -pointsCost,
      description: `Redeemed ${type} voucher`,
    });

    return NextResponse.json({ redemption, user });
  } catch (error) {
    console.error("Error creating redemption:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
