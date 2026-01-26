'use client';

import { useEffect, useState } from 'react';
import { Users, DollarSign, TrendingUp, Gift } from 'lucide-react';

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/admin/analytics');
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
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

  const stats = [
    {
      name: 'Total Users',
      value: analytics?.users?.total || 0,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      name: 'Total Spending',
      value: `$${(analytics?.points?.totalSpending || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-green-500',
    },
    {
      name: 'Points Issued',
      value: (analytics?.points?.totalPointsIssued || 0).toLocaleString(),
      icon: TrendingUp,
      color: 'bg-serendib-primary',
    },
    {
      name: 'Redemptions',
      value: analytics?.redemptions?.total || 0,
      icon: Gift,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Overview of your loyalty program</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="text-white" size={24} />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-gray-600">{stat.name}</div>
          </div>
        ))}
      </div>

      {/* Users by Tier */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Users by Tier</h2>
          <div className="space-y-3">
            {analytics?.users?.byTier?.map((tier) => (
              <div key={tier._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-semibold">{tier._id}</span>
                <span className="text-2xl font-bold text-serendib-primary">
                  {tier.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Transactions by Type</h2>
          <div className="space-y-3">
            {analytics?.transactions?.byType?.map((trans) => (
              <div key={trans._id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold capitalize">{trans._id}</span>
                  <span className="text-lg font-bold">{trans.count}</span>
                </div>
                <div className="text-sm text-gray-600">
                  Total: ${trans.totalAmount?.toFixed(2) || 0}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Users */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Users</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Name</th>
                <th className="text-left py-3 px-4">Email</th>
                <th className="text-left py-3 px-4">Tier</th>
                <th className="text-left py-3 px-4">Points</th>
                <th className="text-left py-3 px-4">Joined</th>
              </tr>
            </thead>
            <tbody>
              {analytics?.users?.recent?.map((user) => (
                <tr key={user._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{user.name}</td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-serendib-primary/10 text-serendib-primary rounded-full text-sm font-semibold">
                      {user.tier}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold">
                    {user.points.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
