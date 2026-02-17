"use client";
import { History, TrendingUp, TrendingDown, Hotel } from "lucide-react";
import { format } from "date-fns";

export default function RecentTransactions({ transactions }) {
  const getIcon = (type) => {
    switch (type) {
      case "earn":
        return TrendingUp;
      case "redeem":
        return TrendingDown;
      case "stay":
        return Hotel;
      default:
        return History;
    }
  };
  const getColor = (type) => {
    switch (type) {
      case "earn":
      case "stay":
        return "text-green-600";
      case "redeem":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-6">
        <History className="text-serendib-primary" size={24} />
        <h2 className="text-xl font-semibold">Recent Activity</h2>
      </div>
      {transactions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <History size={25} className="mx-auto mb-2 sm:mb-4 opacity-50" />
          <p>No transactions yet</p>
          <p className="text-xs sm:text-sm mt-2">
            Your earning and redemption history will appear here
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((transaction) => {
            const Icon = getIcon(transaction.type);
            const color = getColor(transaction.type);
            return (
              <div
                key={transaction._id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-white ${color}`}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {transaction.description}
                    </div>
                    <div className="text-sm text-gray-600">
                      {format(
                        new Date(transaction.createdAt),
                        "MMM dd, yyyy • h:mm a"
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-bold ${color}`}>
                    {transaction.points > 0 ? "+" : ""}
                    {transaction.points.toLocaleString()} pts
                  </div>
                  <div className="text-sm text-gray-600">
                    ${transaction.amount.toFixed(2)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
