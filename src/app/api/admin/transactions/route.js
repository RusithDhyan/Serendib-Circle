import { NextResponse } from 'next/server';
import { checkAdminAuth } from '@/lib/adminAuth';
import { connectDB } from '@/lib/mongodb';
import Transaction from '@/models/Transaction';
import User from '@/models/User';
import crypto from 'crypto';

const ALLOWED_ORIGINS = [
  "https://serendibhotels.mw",
  "https://serendibhotel.com",
  "https://www.serendibhotels.mw",
  "https://www.serendibhotel.com",
  "http://localhost:3000",
];

const EXPIRY_LIMIT = 5 * 60 * 1000; // 5 minutes

function setCorsHeaders(response, origin) {
  if (ALLOWED_ORIGINS.includes(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  }
  return response;
}

export async function OPTIONS(req) {
  const origin = req.headers.get("origin");
  let res = new NextResponse(null, { status: 204 });
  return setCorsHeaders(res, origin);
}

export async function GET(req) {

    const t = req.nextUrl.searchParams.get("t");
    const cs = req.nextUrl.searchParams.get("cs");
    
    if (!t || !cs) {
      let res = NextResponse.json(
        { success: false, error: "Missing parameters" },
        { status: 400 }
      );
      return setCorsHeaders(res, origin);
    }
  
    // --- 2. Validate timestamp ---
    if (Math.abs(Date.now() - parseInt(t)) > EXPIRY_LIMIT) {
      let res = NextResponse.json(
        { success: false, error: "Expired request" },
        { status: 401 }
      );
      return setCorsHeaders(res, origin);
    }
  
    const serverChecksum = crypto
      .createHash("sha256")
      .update(t + process.env.API_KEY)
      .digest("hex");
  
  
    if (serverChecksum !== cs) {
      let res = NextResponse.json(
        { success: false, error: "Invalid checksum" },
        { status: 401 }
      );
      return setCorsHeaders(res, origin);
    }
  try {
    const authCheck = await checkAdminAuth();
    if (authCheck.error) {
      return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit')) || 100;

    await connectDB();

    let query = {};
    if (userId) query.userId = userId;
    if (type) query.type = type;

    // const transactions = await Transaction.find(query)
    //   .sort({ createdAt: -1 })
    //   .limit(limit);

    const transactions = await Transaction.aggregate([
      { $match: query },

      // Convert userId to ObjectId safely
      {
        $addFields: {
          userObjectId: {
            $cond: [
              { $regexMatch: { input: "$userId", regex: /^[0-9a-fA-F]{24}$/ } },
              { $toObjectId: "$userId" },
              null,
            ],
          },
        },
      },

      // Lookup the user
      {
        $lookup: {
          from: "users",
          localField: "userObjectId",
          foreignField: "_id",
          as: "user",
        },
      },

      // Unwind user array
      {
        $unwind: { path: "$user", preserveNullAndEmptyArrays: true },
      },

      // Add loyaltyNumber only if user.role === "guest"
      {
        $addFields: {
          loyaltyNumber: {
            $cond: [
              { $eq: ["$user.role", "guest"] },
              "$user.loyaltyNumber",
              null,
            ],
          },
        },
      },

      // Remove extra fields
      { $project: { user: 0, userObjectId: 0 } },

      { $sort: { createdAt: -1 } },
      { $limit: limit },
    ]);

    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const authCheck = await checkAdminAuth();
    if (authCheck.error) {
      return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
    }

    const body = await req.json();
    const { userId, type, amount, description } = body;

    if (!userId || !type || !amount) {
      return NextResponse.json(
        { error: 'userId, type, and amount are required' },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let points = 0;

    if (type === 'earn' || type === 'stay' || type === 'dining' || type === 'experience') {
      points = user.addSpend(amount);
      
      if (type === 'stay') {
        user.totalStays += 1;
        user.updateTier();
      }
      
      await user.save();
    }

    const transaction = await Transaction.create({
      userId: user._id,
      type,
      amount,
      points,
      description: description || `Admin added ${type} transaction`,
    });

    return NextResponse.json({ 
      transaction, 
      user: {
        points: user.points,
        tier: user.tier,
        totalSpend: user.totalSpend,
        totalStays: user.totalStays
      }
    });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
