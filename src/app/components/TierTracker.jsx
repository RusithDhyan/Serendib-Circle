"use client";
import { Award, ChevronRight } from "lucide-react";

export default function TierTracker({ user }) {
  const tiers = [
    { name: "Explorer", stays: 0, spend: 0, icon: "🌟" },
    { name: "Adventurer", stays: 2, spend: 1000, icon: "🗺️" },
    { name: "Voyager", stays: 5, spend: 2000, icon: "⛵" },
    { name: "The Circle", stays: 11, spend: 3500, icon: "👑" },
  ];
  const currentTierIndex = tiers.findIndex((t) => t.name === user.tier);
  const nextTier = tiers[currentTierIndex + 1];

  const getProgress = () => {
    if (!nextTier) return 100;
    const stayProgress = (user.totalStays / nextTier.stays) * 100;
    const spendProgress = (user.totalSpend / nextTier.spend) * 100;
    return Math.min(Math.max(stayProgress, spendProgress), 100);
  };
  const progress = getProgress();

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-6">
        <Award className="text-serendib-primary" size={24} />
        <h2 className="text-xl font-semibold">Tier Progress</h2>
      </div>
      <div className="mb-6">
        <div className="text-4xl mb-2">{tiers[currentTierIndex].icon}</div>
        <div className="text-2xl font-bold text-serendib-primary mb-1">
          {user.tier}
        </div>
        <div className="text-sm text-gray-600">Current Status</div>
      </div>
      {nextTier ? (
        <>
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Progress to {nextTier.name}</span>
              <span className="font-semibold">{progress.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 2xl:h-3">
              <div
                className="bg-gradient-to-r from-serendib-secondary to-serendib-accent h-2 2xl:h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="text-sm text-gray-600">Stays</div>
                <div className="font-semibold">
                  {user.totalStays} / {nextTier.stays}
                </div>
              </div>
              <ChevronRight className="text-gray-400" size={20} />
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="text-sm text-gray-600">Spend</div>
                <div className="font-semibold">
                  ${user.totalSpend} / ${nextTier.spend}
                </div>
              </div>
              <ChevronRight className="text-gray-400" size={20} />
            </div>
          </div>
        </>
      ) : (
        <div className="p-4 bg-serendib-gold/10 rounded-lg text-center">
          <div className="text-lg font-bold text-serendib-gold mb-2">
            🎉 Highest Tier Achieved!
          </div>
          <div className="text-sm text-gray-600">
            You're enjoying all premium benefits
          </div>
        </div>
      )}
    </div>
  );
}
