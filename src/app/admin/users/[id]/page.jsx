"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  DollarSign,
  TrendingUp,
  Calendar,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import Image from "next/image";

export default function UserDetail() {
  const params = useParams();
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [transactionForm, setTransactionForm] = useState({
    type: "earn",
    amount: "",
    description: "",
  });

  useEffect(() => {
    fetchUserData();
  }, [params.id]);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`/api/admin/users/${params.id}`);
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/admin/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: params.id,
          ...transactionForm,
          amount: parseFloat(transactionForm.amount),
        }),
      });

      if (response.ok) {
        alert("Transaction added successfully!");
        setShowAddTransaction(false);
        setTransactionForm({ type: "earn", amount: "", description: "" });
        fetchUserData();
      } else {
        alert("Failed to add transaction");
      }
    } catch (error) {
      console.error("Error adding transaction:", error);
      alert("Error adding transaction");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-serendib-primary"></div>
      </div>
    );
  }

  if (!userData) {
    return <div>User not found</div>;
  }

  const { user, transactions, redemptions } = userData;

  return (
    <div>
      <Link
        href="/admin/users"
        className="inline-flex items-center gap-2 text-serendib-primary hover:text-serendib-secondary mb-6"
      >
        <ArrowLeft size={20} />
        Back to Users
      </Link>

      {/* User Info Card */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {user.name}
            </h1>
            <p className="text-gray-600">{user.email}</p>
          </div>
          
          <div className="flex flex-col">
            <div className="flex justify-between items-center">
              {user.image && (
            <Image
              src={user.image}
              alt={user.name}
              width={1000}
              height={100}
              className="w-12 h-12 rounded-full object-cover"
            />
          )}
            <div
              className={`inline-flex items-center px-6 h-10 rounded-full text-sm font-semibold ${
                user.tier === "The Circle"
                  ? "bg-yellow-100 text-yellow-800"
                  : user.tier === "Voyager"
                  ? "bg-blue-100 text-blue-800"
                  : user.tier === "Adventurer"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {user.tier}
            </div>
            </div>
            <div className="text-right">
            
            <div className="text-sm text-gray-600 mt-2">
              Member since {new Date(user.createdAt).toLocaleDateString()}
            </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="p-4 bg-serendib-primary/5 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="text-serendib-primary" size={20} />
              <span className="text-sm text-gray-600">Points Balance</span>
            </div>
            <div className="text-3xl font-bold text-serendib-primary">
              {user.points.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              = ${(user.points / 100).toFixed(2)} USD
            </div>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="text-green-600" size={20} />
              <span className="text-sm text-gray-600">Total Spend</span>
            </div>
            <div className="text-3xl font-bold text-green-600">
              ${user.totalSpend.toLocaleString()}
            </div>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="text-blue-600" size={20} />
              <span className="text-sm text-gray-600">Total Stays</span>
            </div>
            <div className="text-3xl font-bold text-blue-600">
              {user.totalStays}
            </div>
          </div>
        </div>
      </div>

      {/* Add Transaction Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowAddTransaction(!showAddTransaction)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Add Transaction
        </button>
      </div>

      {/* Add Transaction Form */}
      {showAddTransaction && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Add Transaction</h2>
          <form onSubmit={handleAddTransaction} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Type</label>
                <select
                  value={transactionForm.type}
                  onChange={(e) =>
                    setTransactionForm({
                      ...transactionForm,
                      type: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                >
                  <option value="earn">Purchase</option>
                  <option value="dining">Dining</option>
                  <option value="experience">Experience</option>
                  <option value="stay">Hotel Stay</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Amount (USD)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={transactionForm.amount}
                  onChange={(e) =>
                    setTransactionForm({
                      ...transactionForm,
                      amount: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">
                Description
              </label>
              <input
                type="text"
                value={transactionForm.description}
                onChange={(e) =>
                  setTransactionForm({
                    ...transactionForm,
                    description: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Optional description"
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="btn-primary">
                Add Transaction
              </button>
              <button
                type="button"
                onClick={() => setShowAddTransaction(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Transactions */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Transaction History</h2>
        <div className="space-y-3">
          {transactions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No transactions yet
            </p>
          ) : (
            transactions.map((transaction) => (
              <div
                key={transaction._id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <div className="font-semibold">{transaction.description}</div>
                  <div className="text-sm text-gray-600">
                    {format(
                      new Date(transaction.createdAt),
                      "MMM dd, yyyy • h:mm a"
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`font-bold ${
                      transaction.points > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {transaction.points > 0 ? "+" : ""}
                    {transaction.points.toLocaleString()} pts
                  </div>
                  <div className="text-sm text-gray-600">
                    ${transaction.amount.toFixed(2)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Redemptions */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Redemptions</h2>
        <div className="space-y-3">
          {redemptions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No redemptions yet</p>
          ) : (
            redemptions.map((redemption) => (
              <div
                key={redemption._id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <div className="font-semibold capitalize">
                    {redemption.type} Voucher
                  </div>
                  <div className="text-sm text-gray-600">
                    Code: {redemption.voucherCode}
                  </div>
                  <div className="text-xs text-gray-500">
                    Expires:{" "}
                    {new Date(redemption.expiresAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-red-600">
                    -{redemption.pointsCost.toLocaleString()} pts
                  </div>
                  <div className="text-sm text-gray-600">
                    ${redemption.dollarValue.toFixed(2)}
                  </div>
                  <div
                    className={`text-xs mt-1 px-2 py-1 rounded-full inline-block ${
                      redemption.status === "active"
                        ? "bg-green-100 text-green-800"
                        : redemption.status === "used"
                        ? "bg-gray-100 text-gray-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {redemption.status}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
