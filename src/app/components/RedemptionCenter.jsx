"use client";
import { useState } from "react";
import { Gift, Coffee, Bed, Sparkles } from "lucide-react";

export default function RedemptionCenter({ user, onRedeem }) {
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);

  const vouchers = [
    {
      id: 1,
      type: "dining",
      icon: Coffee,
      title: "Dining Voucher",
      description: "Redeem for F&B at any Serendib property",
      amount: 1000,
      content: "Redeem with 1000 points",
    },
    {
      id: 2,
      type: "room",
      icon: Bed,
      title: "Room Voucher",
      description: "Apply towards your next stay",
      amount: 5000,
      content: "Redeem with 5000 points",
    },
    {
      id: 3,
      type: "experience",
      icon: Sparkles,
      title: "Experience Voucher",
      description: "Unlock exclusive experiences",
      amount: 15000,
      content: "Redeem with 15000 points",
    },
  ];

  const handleRedeem = async (type, points) => {
    if (user.points < points) {
      alert("Insufficient points!");
      return;
    }

    if (
      !confirm(
        `Redeem ${points} points for a $${(points / 100).toFixed(
          2
        )} ${type} voucher?`
      )
    )
      return;

    setIsRedeeming(true);

    try {
      const response = await fetch("/api/redemptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, pointsCost: points }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(
          `Success! Your voucher code is: ${
            data.redemption.voucherCode
          }\n\nValid until: ${new Date(
            data.redemption.expiresAt
          ).toLocaleDateString()}`
        );
        onRedeem();
      } else {
        alert(data.error || "Redemption failed");
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
    } finally {
      setIsRedeeming(false);
      setSelectedVoucher(null);
    }
  };

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-3 sm:mb-6">
        <Gift className="text-serendib-primary" size={24} />
        <h2 className="text-xl font-semibold">Redeem Now</h2>
      </div>

      <div className="space-y-4">
        {vouchers.map((voucher) => {
          const percentage = Math.min(
            (user.points / voucher.amount) * 100,
            100
          );

          const canRedeem = user.points >= voucher.amount;

          return (
            <div
              key={voucher.type}
              className="border border-gray-200 rounded-lg p-2 sm:p-4"
            >
              {/* Voucher Info */}
              <div className="flex items-start gap-3 mb-3">
                <div className="p-2 bg-serendib-primary/10 rounded-lg">
                  <voucher.icon className="text-serendib-primary" size={20} />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">
                      {voucher.title}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600">{voucher.description}</p>
                </div>
              </div>

              {/* Expanded Section */}
              {selectedVoucher === voucher.type ? (
                <div className="space-y-6">
                  {/* REAL REDEEM BUTTON */}
                  <button
                    onClick={() => handleRedeem(voucher.type, voucher.amount)}
                    disabled={!canRedeem || isRedeeming}
                    className={`px-3 rounded-lg border-2 transition-all w-full ${
                      canRedeem
                        ? "border-serendib-primary hover:bg-serendib-primary hover:text-white cursor-pointer"
                        : "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <div className="font-bold text-sm">
                      Redeem {voucher.amount.toLocaleString()} pts
                    </div>
                    <div className="text-xs">
                      ${(voucher.amount / 100).toFixed(2)}
                    </div>
                  </button>

                  {/* Cancel Button */}
                  <button
                    onClick={() => setSelectedVoucher(null)}
                    className="w-full mt-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 py-2 rounded-md transition-all duration-300 border border-gray-200"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                /* 🔥 OUTER REDEEM BUTTON WITH PROGRESS BAR */
                <button
                  onClick={() => canRedeem && setSelectedVoucher(voucher.type)}
                  disabled={!canRedeem || isRedeeming}
                  className={`relative w-full overflow-hidden rounded-lg border-2 py-0 font-semibold transition-all ${
                    canRedeem
                      ? "border-serendib-primary text-white bg-serendib-primary hover:bg-serendib-secondary hover:text-white cursor-pointer"
                      : "border-gray-300 text-gray-500 bg-gray-100 cursor-not-allowed"
                  }`}
                >
                  {/* Progress fill */}
                  <div
                    className="absolute left-0 top-0 h-full bg-serendib-secondary/50 transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />

                  {/* Button label */}
                  <div className="flex items-center justify-between px-2">
                    <span className="relative z-10 text-xs sm:text-sm flex-1">Redeem</span>
                    <p className="relative text-xs">{percentage.toFixed(1)}%</p>
                  </div>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
