import { NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/adminAuth";
import User from "@/models/User";
import Transaction from "@/models/Transaction";
import Redemption from "@/models/Redemption";
import { connectDB } from "@/lib/mongodb";

export async function GET(req) {
  try {
    const authCheck = await checkAdminAuth();
    if (authCheck.error) {
      return NextResponse.json(
        { error: authCheck.error },
        { status: authCheck.status }
      );
    }

    await connectDB();

    // Get user statistics
    const totalUsers = await User.countDocuments({ role: "guest" });
    const usersPerMonth = await User.aggregate([
      { $match: { role: "guest" } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    const usersByTier = await User.aggregate([
      { $match: { role: "guest" } },
      { $group: { _id: "$tier", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Get transaction statistics
    const totalTransactions = await Transaction.countDocuments();
    const totalBuy = await Transaction.countDocuments({
      type: { $ne: "redeem" },
    });

    const transactionsByType = await Transaction.aggregate([
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);

    // Get points statistics
    const pointsStats = await User.aggregate([
      {$match: {role: "guest"}},
      {
        $group: {
          _id: null,
          totalPointsIssued: { $sum: "$points" },
          totalSpending: { $sum: "$totalSpend" },
          avgPointsPerUser: { $avg: "$points" },
        },
      },
    ]);

    // Get redemption statistics
    const totalRedemptions = await Redemption.countDocuments();
    const redemptionsPerMonth = await Redemption.aggregate([
      { $match: { status: { $ne: "expired" } } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    const redemptionsByType = await Redemption.aggregate([
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
          totalPoints: { $sum: "$pointsCost" },
          totalValue: { $sum: "$dollarValue" },
        },
      },
    ]);

    // Recent activity
    const recentTransactions = await Transaction.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("userId", "name email");

    const recentUsers = await User.find({ role: "guest" })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("-password");

    // -------- Avg Days to Tier Upgrade --------
    const usersWithHistory = await User.find(
      { 
        role: "guest",
        "tierHistory.1": { $exists: true } },
      { tierHistory: 1 }
    );

    const tierBuckets = {};

    usersWithHistory.forEach((user) => {
      const history = user.tierHistory;

      for (let i = 1; i < history.length; i++) {
        const from = history[i - 1];
        const to = history[i];

        const key = `from ${from.tier.replaceAll(
          " ",
          ""
        )}_to_${to.tier.replaceAll(" ", "")} :`;

        const days =
          (new Date(to.date) - new Date(from.date)) / (1000 * 60 * 60 * 24);

        if (!tierBuckets[key]) tierBuckets[key] = [];
        tierBuckets[key].push(Math.round(days));
      }
    });

    const avgTierUpgradeDays = {};
    let allDays = [];

    Object.entries(tierBuckets).forEach(([key, values]) => {
      const avg = values.reduce((sum, v) => sum + v, 0) / values.length;

      avgTierUpgradeDays[key] = Math.round(avg);
      allDays.push(...values);
    });

    avgTierUpgradeDays.overall = allDays.length
      ? Math.round(allDays.reduce((a, b) => a + b, 0) / allDays.length)
      : 0;

    return NextResponse.json({
      users: {
        total: totalUsers,
        usersPerMonth: usersPerMonth,
        byTier: usersByTier,
        avgTierUpgradeDays: avgTierUpgradeDays,
        recent: recentUsers,
      },
      transactions: {
        total: totalTransactions,
        totalBuy: totalBuy,
        byType: transactionsByType,
        recent: recentTransactions,
      },
      points: pointsStats[0] || {
        totalPointsIssued: 0,
        totalSpending: 0,
        avgPointsPerUser: 0,
      },
      redemptions: {
        total: totalRedemptions,
        byType: redemptionsByType,
        redemptionsPerMonth: redemptionsPerMonth,
      },
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
