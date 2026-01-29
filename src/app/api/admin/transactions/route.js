import { NextResponse } from 'next/server';
import { checkAdminAuth } from '@/lib/adminAuth';
import { connectDB } from '@/lib/mongodb';
import Transaction from '@/models/Transaction';
import User from '@/models/User';

export async function GET(req) {
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

    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .limit(limit);

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
