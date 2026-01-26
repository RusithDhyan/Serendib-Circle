import { NextResponse } from 'next/server';
import User from '@/models/User';
import Transaction from '@/models/Transaction';
import Redemption from '@/models/Redemption';
import { connectDB } from '@/lib/mongodb';
import { checkAdminAuth } from '@/lib/adminAuth';

export async function GET(req, { params }) {
  try {
    const {id} = await params;

    const authCheck = await checkAdminAuth();
    if (authCheck.error) {
      return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
    }

    await connectDB();
    
    const user = await User.findById(id).select('-password');
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get user's transactions
    const transactions = await Transaction.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    // Get user's redemptions
    const redemptions = await Redemption.find({ userId: user._id })
      .sort({ createdAt: -1 });

    return NextResponse.json({
      user,
      transactions,
      redemptions
    });
  } catch (error) {
    console.error('Error fetching user details:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const authCheck = await checkAdminAuth();
    if (authCheck.error) {
      return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
    }

    const body = await req.json();
    const { role, points, tier } = body;

    await connectDB();
    
    const updateData = {};
    if (role) updateData.role = role;
    if (points !== undefined) updateData.points = points;
    if (tier) updateData.tier = tier;

    const user = await User.findByIdAndUpdate(
      params.id,
      { $set: updateData },
      { new: true }
    ).select('-password');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
