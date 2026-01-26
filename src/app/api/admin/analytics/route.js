import { NextResponse } from 'next/server';
import { checkAdminAuth } from '@/lib/adminAuth';
import User from '@/models/User';
import Transaction from '@/models/Transaction';
import Redemption from '@/models/Redemption';
import { connectDB } from '@/lib/mongodb';

export async function GET(req) {
  try {
    const authCheck = await checkAdminAuth();
    if (authCheck.error) {
      return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
    }

    await connectDB();

    // Get user statistics
    const totalUsers = await User.countDocuments();
    const usersByTier = await User.aggregate([
      { $group: { _id: '$tier', count: { $sum: 1 } } }
    ]);

    // Get transaction statistics
    const totalTransactions = await Transaction.countDocuments();
    const transactionsByType = await Transaction.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 }, totalAmount: { $sum: '$amount' } } }
    ]);

    // Get points statistics
    const pointsStats = await User.aggregate([
      {
        $group: {
          _id: null,
          totalPointsIssued: { $sum: '$points' },
          totalSpending: { $sum: '$totalSpend' },
          avgPointsPerUser: { $avg: '$points' }
        }
      }
    ]);

    // Get redemption statistics
    const totalRedemptions = await Redemption.countDocuments();
    const redemptionsByType = await Redemption.aggregate([
      { 
        $group: { 
          _id: '$type', 
          count: { $sum: 1 },
          totalPoints: { $sum: '$pointsCost' },
          totalValue: { $sum: '$dollarValue' }
        } 
      }
    ]);

    // Recent activity
    const recentTransactions = await Transaction.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('userId', 'name email');

    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('-password');

    return NextResponse.json({
      users: {
        total: totalUsers,
        byTier: usersByTier,
        recent: recentUsers
      },
      transactions: {
        total: totalTransactions,
        byType: transactionsByType,
        recent: recentTransactions
      },
      points: pointsStats[0] || {
        totalPointsIssued: 0,
        totalSpending: 0,
        avgPointsPerUser: 0
      },
      redemptions: {
        total: totalRedemptions,
        byType: redemptionsByType
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
