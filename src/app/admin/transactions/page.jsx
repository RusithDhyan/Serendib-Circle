'use client';

import { useEffect, useState } from 'react';
import { Search, Filter, TrendingUp, TrendingDown, Hotel, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('');
  const [searchUserId, setSearchUserId] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, [filterType, searchUserId]);

  const fetchTransactions = async () => {
    try {
      let url = '/api/admin/transactions?limit=100';
      if (filterType) url += `&type=${filterType}`;
      if (searchUserId) url += `&userId=${searchUserId}`;
      
      const response = await fetch(url);
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'earn': return TrendingUp;
      case 'stay': return Hotel;
      case 'redeem': return TrendingDown;
      default: return TrendingUp;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'earn':
      case 'stay': return 'text-green-600 bg-green-50';
      case 'redeem': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const totalPoints = transactions.reduce((sum, t) => sum + (t.points || 0), 0);
  const totalAmount = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);
  const earnTransactions = transactions.filter(t => t.type === 'earn' || t.type === 'stay').length;
  const redeemTransactions = transactions.filter(t => t.type === 'redeem').length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Transaction Management</h1>
        <p className="text-gray-600">View and monitor all loyalty program transactions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Transactions</span>
            <Calendar className="text-serendib-primary" size={20} />
          </div>
          <div className="text-3xl font-bold text-gray-900">{transactions.length}</div>
        </div> */}

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Points</span>
            <TrendingUp className="text-green-600" size={20} />
          </div>
          <div className="text-3xl font-bold text-green-600">
            +{transactions.filter(t => t.points > 0).reduce((sum, t) => sum + t.points, 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-500 mt-1">{earnTransactions} transactions</div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Redemptions</span>
            <TrendingDown className="text-red-600" size={20} />
          </div>
          <div className="text-3xl font-bold text-red-600">
            {Math.abs(transactions.filter(t => t.points < 0).reduce((sum, t) => sum + t.points, 0)).toLocaleString()}
          </div>
          <div className="text-sm text-gray-500 mt-1">{redeemTransactions} redemptions</div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Spend</span>
            <TrendingUp className="text-serendib-primary" size={20} />
          </div>
          <div className="text-3xl font-bold text-serendib-primary">
            ${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-serendib-primary focus:border-transparent appearance-none"
            >
              <option value="">All Transaction Types</option>
              <option value="earn">Purchase</option>
              <option value="stay">Hotel Stay</option>
              <option value="redeem">Redemption</option>
            </select>
          </div>
          
          <button
            onClick={() => {
              setFilterType('');
              setSearchUserId('');
            }}
            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-serendib-primary"></div>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Calendar size={48} className="mx-auto mb-4 opacity-50" />
            <p>No transactions found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Date & Time</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Type</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Description</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Amount</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Points</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">User ID</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => {
                  const Icon = getTypeIcon(transaction.type);
                  const colorClass = getTypeColor(transaction.type);
                  
                  return (
                    <tr key={transaction._id} className="border-t hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div className="text-sm font-semibold text-gray-900">
                          {format(new Date(transaction.createdAt), 'MMM dd, yyyy')}
                        </div>
                        <div className="text-xs text-gray-500">
                          {format(new Date(transaction.createdAt), 'h:mm a')}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${colorClass}`}>
                          <Icon size={16} />
                          <span className="text-sm font-semibold capitalize">{transaction.type}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm text-gray-900">{transaction.description}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm font-semibold text-gray-900">
                          ${transaction.amount?.toFixed(2) || '0.00'}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className={`text-sm font-bold ${transaction.points > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.points > 0 ? '+' : ''}{transaction.points?.toLocaleString() || 0}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-xs text-gray-500 font-mono">
                          {transaction.userId?.substring(0, 8)}...
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary Footer */}
      {/* {transactions.length > 0 && (
        <div className="mt-6 bg-gradient-to-r from-serendib-primary to-serendib-secondary text-white rounded-xl p-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="text-sm opacity-90 mb-1">Net Points Change</div>
              <div className="text-3xl font-bold">
                {totalPoints > 0 ? '+' : ''}{totalPoints.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-sm opacity-90 mb-1">Total Revenue Tracked</div>
              <div className="text-3xl font-bold">
                ${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <div>
              <div className="text-sm opacity-90 mb-1">Average Transaction</div>
              <div className="text-3xl font-bold">
                ${(totalAmount / transactions.length || 0).toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
}
