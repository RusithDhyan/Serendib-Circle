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
      <div className="flex items-center gap-2 mb-6">
        <Gift className="text-serendib-primary" size={24} />
        <h2 className="text-xl font-semibold">Redeem Now</h2>
      </div>
      {/* <div className="mb-4 p-3 bg-blue-50 rounded-lg">
        <div className="text-sm text-blue-800">💡 <strong>100 points = $1 USD</strong> • All vouchers valid for 6 months</div>
      </div> */}
      <div className="space-y-4">
        {vouchers.map((voucher) => {
          const percentage =
            user.points < voucher.amount
              ? ((user.points / voucher.amount) * 100).toFixed(1)
              : 100;

          return (
            <div
              key={voucher.type}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="p-2 bg-serendib-primary/10 rounded-lg">
                  <voucher.icon className="text-serendib-primary" size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {voucher.title}
                  </h3>
                  <p className="text-sm text-gray-600">{voucher.description}</p>
                </div>
              </div>
              {selectedVoucher === voucher.type ? (
                <div className="space-y-6">
                  <div className="w-full rounded-full h-3">
                    <div className="text-sm text-end text-gray-600 mt-1">
                      {percentage}%
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 2xl:h-3">
                    <div
                      className="h-2 2xl:h-3 rounded-full transition-all duration-500 bg-serendib-secondary"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  </div>

                  <div className="flex-1 w-50 text-center text-sm font-semibold text-purple-700 my-2 bg-purple-100 px-2 rounded-xl shadow-md">
                    {voucher.content}
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <button
                      onClick={() => handleRedeem(voucher.type, voucher.amount)}
                      disabled={isRedeeming || user.points < voucher.amount}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        user.points >= voucher.amount
                          ? "border-serendib-primary hover:bg-serendib-primary hover:text-white cursor-pointer"
                          : "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      <div className="font-bold">
                        {voucher.amount.toLocaleString()} pts
                      </div>
                      <div className="text-xs">
                        ${(voucher.amount / 100).toFixed(2)}
                      </div>
                    </button>
                  </div>
                  <button
                    onClick={() => setSelectedVoucher(null)}
                    className="w-full mt-2 text-sm text-gray-600 hover:text-gray-900"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setSelectedVoucher(voucher.type)}
                  className="w-full btn-primary"
                  disabled={isRedeeming}
                >
                  Redeem
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
