"use client";

import { Wallet, TrendingUp } from "lucide-react";

export default function BalanceCard({ user }) {
  const pointsValue = (user.points / 100).toFixed(2);

  const getMultiplier = (tier) => {
    switch (tier) {
      case "The Circle":
        return "2.0x";
      case "Voyager":
        return "1.5x";
      case "Adventurer":
        return "1.25x";
      default:
        return "1.0x";
    }
  };

  const multiplier = getMultiplier(user.tier);

  return (
    <div className="card bg-gradient-to-br from-serendib-primary to-serendib-secondary text-white h-full">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Wallet size={24} />
            <h2 className="text-xl font-semibold">Point Balance</h2>
          </div>
          <p className="text-sm opacity-90">Real-time rewards tracking</p>
        </div>
        <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2">
          <div className="text-xs opacity-90">Earn Rate</div>
          <div className="text-lg font-bold">{multiplier}</div>
        </div>
      </div>

      <div className="mb-6">
        <div className="text-3xl sm:text-6xl font-bold mb-2">
          {user.points.toLocaleString()}
        </div>
        <div className="text-xl opacity-90">Active Points</div>
      </div>

      <div className="flex gap-4 pt-4 border-t border-white/20">
        <div>
          <div className="relative inline-block py-2">
            {/* stays – top right */}
            <div className="absolute -top-2 right-[-20] text-xs opacity-75">
              {user.totalStays} stays
            </div>

            {/* spend amount */}
            <div className="text-3xl sm:text-6xl font-bold">
              ${user.totalSpend.toLocaleString()}
            </div>
          </div>
          <div className="text-xl opacity-90">Total Spend</div>
        </div>
      </div>
    </div>
  );
}
