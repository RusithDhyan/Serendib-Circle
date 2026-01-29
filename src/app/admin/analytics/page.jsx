"use client";

import { useEffect, useState } from "react";
import {
  TrendingUp,
  Users,
  DollarSign,
  Award,
  Calendar,
  Activity,
} from "lucide-react";

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("all");

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch("/api/admin/analytics");
      const data = await response.json();
      console.log(data);
      setAnalytics(data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-serendib-primary"></div>
      </div>
    );
  }

  if (!analytics) {
    return <div>Error loading analytics</div>;
  }

  const avgPointsPerUser = analytics.points?.avgPointsPerUser || 0;
  const totalUsers = analytics.users?.total || 0;
  const usersPerMonth = analytics.users?.usersPerMonth || [];

  const currentMonthUsers =
    usersPerMonth.length > 0
      ? usersPerMonth[usersPerMonth.length - 1].count
      : 0;

  const redemptionsPerMonth = analytics.redemptions?.redemptionsPerMonth || [];

  const currentMonthRedemptions =
    redemptionsPerMonth.length > 0
      ? redemptionsPerMonth[redemptionsPerMonth.length - 1].count
      : 0;

  console.log("redemptions per month:", currentMonthRedemptions);
  console.log(analytics.users?.byTier[0]?._id);
  console.log("current month user:", currentMonthUsers);

  const totalSpending = analytics.points?.totalSpending || 0;
  const totalPointsIssued = analytics.points?.totalPointsIssued || 0;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Analytics & Insights
        </h1>
        <p className="text-gray-600">
          Deep dive into your loyalty program performance
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <Users size={24} />
            <TrendingUp size={20} className="opacity-75" />
          </div>
          <div className="text-3xl font-bold mb-1">{totalUsers}</div>
          <div className="text-sm opacity-90">Total Members</div>
        </div>

        {/* <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <DollarSign size={24} />
            <TrendingUp size={20} className="opacity-75" />
          </div>
          <div className="text-3xl font-bold mb-1">${totalSpending.toLocaleString()}</div>
          <div className="text-sm opacity-90">Total Revenue</div>
        </div> */}

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <Award size={24} />
            <TrendingUp size={20} className="opacity-75" />
          </div>
          <div className="text-3xl font-bold mb-1">
            {totalPointsIssued.toLocaleString()}
          </div>
          <div className="text-sm opacity-90">Available Points </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <Activity size={24} />
            <TrendingUp size={20} className="opacity-75" />
          </div>
          <div className="text-3xl font-bold mb-1">
            {Math.round(avgPointsPerUser)}
          </div>
          <div className="text-sm opacity-90">Avg Points/User</div>
        </div>
      </div>

      {/* User Distribution */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Users size={24} className="text-serendib-primary" />
            Members by Tier
          </h2>
          <div className="space-y-4">
            {analytics.users?.byTier?.map((tier, index) => {
              const percentage = ((tier.count / totalUsers) * 100).toFixed(1);
              const colors = [
                "bg-gray-400",
                "bg-serendib-bronze",
                "bg-blue-500",
                "bg-serendib-gold",
              ];
              const color = colors[index] || "bg-gray-400";

              return (
                <div key={tier._id}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-700">
                      {tier._id}
                    </span>
                    <span className="text-2xl font-bold text-serendib-primary">
                      {tier.count}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`${color} h-3 rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {percentage}% of total members
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Activity size={24} className="text-serendib-primary" />
            Transaction Breakdown
          </h2>
          <div className="space-y-4">
            {analytics.transactions?.byType?.map((trans) => {
              const icons = {
                earn: "💰",
                stay: "🏨",
                redeem: "🎁",
              };

              return (
                <div
                  key={trans._id}
                  className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">
                        {icons[trans._id] || "📊"}
                      </span>
                      <div>
                        <div className="font-bold text-gray-900 capitalize">
                          {trans._id}
                        </div>
                        <div className="text-sm text-gray-600">
                          {trans.count} transactions
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-serendib-primary">
                        ${trans.totalAmount?.toFixed(2) || "0.00"}
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-serendib-primary h-2 rounded-full"
                      style={{
                        width: `${(
                          (trans.count / analytics.transactions.total) *
                          100
                        ).toFixed(1)}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Redemptions Analysis */}
      {/* <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Award size={24} className="text-serendib-primary" />
          Redemption Insights
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {analytics.redemptions?.byType?.map((redemption) => {
            const icons = {
              dining: '🍽️',
              room: '🏨',
              experience: '✨'
            };
            
            return (
              <div key={redemption._id} className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl">
                <div className="text-4xl mb-3">{icons[redemption._id] || '🎁'}</div>
                <div className="font-bold text-lg text-gray-900 capitalize mb-2">{redemption._id}</div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Count:</span>
                    <span className="font-bold">{redemption.count}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Points:</span>
                    <span className="font-bold text-red-600">{redemption.totalPoints?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Value:</span>
                    <span className="font-bold text-green-600">${redemption.totalValue?.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div> */}

      {/* Program Health Metrics */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Program Health
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div>
                <div className="text-sm text-gray-600 mb-1 font-semibold">No. Of Logins</div>
                <div className="text-2xl font-bold text-green-600">
                  {currentMonthUsers}
                </div>
                <div className="text-xs text-gray-500">per month</div>
              </div>
              <TrendingUp size={32} className="text-green-600" />
            </div>

            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <div className="text-sm text-gray-600 mb-1 font-semibold">
                  Average Buy Rate
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {totalPointsIssued > 0
                    ? (
                        (analytics.transactions?.totalBuy / totalUsers) *
                        100
                      ).toFixed(1)
                    : 0}
                  %
                </div>
                <div className="text-xs text-gray-500">of members</div>
              </div>
              <DollarSign size={32} className="text-blue-600" />
            </div>

            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <div>
                <div className="text-sm text-gray-600 font-semibold mb-1">
                  Average Days to Tier Upgrade
                </div>
                {analytics.users?.avgTierUpgradeDays &&
                  Object.entries(analytics.users.avgTierUpgradeDays).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between text-sm text-gray-500 mb-2"
                      >
                        <span>{key.replaceAll("_", " ")}</span>
                        <span className="font-semibold text-purple-600 ">
                          {value} days
                        </span>
                      </div>
                    )
                  )}
                {/* <div className="text-xs text-gray-500">per transaction</div> */}
              </div>
              <Award size={32} className="text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-serendib-primary to-serendib-secondary text-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-6">Quick Insights</h2>
          <div className="space-y-4">
            <div className="p-4 bg-white/10 backdrop-blur-sm rounded-lg">
              <div className="text-3xl mb-2">🎯</div>
              <div className="text-sm opacity-90 mb-1">Most Popular Tier</div>
              <div className="text-2xl font-bold">
                {analytics.users?.byTier?.[0]?._id || "N/A"}
              </div>
            </div>

            {/* <div className="p-4 bg-white/10 backdrop-blur-sm rounded-lg">
              <div className="text-3xl mb-2">💎</div>
              <div className="text-sm opacity-90 mb-1">Total Points in Circulation</div>
              <div className="text-2xl font-bold">
                {totalPointsIssued.toLocaleString()}
              </div>
              <div className="text-xs opacity-75 mt-1">
                ≈ ${(totalPointsIssued / 100).toLocaleString()} value
              </div>
            </div> */}

            <div className="p-4 bg-white/10 backdrop-blur-sm rounded-lg">
              <div className="text-3xl mb-2">📈</div>
              <div className="text-sm opacity-90 mb-1">
                (Month of month)Growth of Users
              </div>
              <div className="text-2xl font-bold">
                {(
                  (1 - currentMonthRedemptions / currentMonthUsers) *
                  100
                ).toFixed(0)}
                %
              </div>
              <div className="text-xs opacity-75 mt-1">
                members yet to redeem
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Calendar size={24} className="text-serendib-primary" />
          Recent Activity
        </h2>
        <div className="space-y-3">
          {analytics.transactions?.recent?.slice(0, 5).map((transaction) => (
            <div
              key={transaction._id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-serendib-primary/10 rounded-full flex items-center justify-center">
                  <Activity size={20} className="text-serendib-primary" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {transaction.description}
                  </div>
                  <div className="text-sm text-gray-600">
                    {transaction.userId?.email || "Unknown user"}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div
                  className={`font-bold ${
                    transaction.points > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {transaction.points > 0 ? "+" : ""}
                  {transaction.points?.toLocaleString() || 0} pts
                </div>
                <div className="text-sm text-gray-600">
                  ${transaction.amount?.toFixed(2) || "0.00"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
