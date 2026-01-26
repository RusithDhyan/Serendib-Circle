'use client';
import { useState } from 'react';
import { Gift, Coffee, Bed, Sparkles } from 'lucide-react';

export default function RedemptionCenter({ user, onRedeem }) {
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const vouchers = [
    { type: 'dining', icon: Coffee, title: 'Dining Voucher', description: 'Redeem for F&B at any Serendib property', amounts: [1000, 2500, 5000, 10000] },
    { type: 'room', icon: Bed, title: 'Room Voucher', description: 'Apply towards your next stay', amounts: [5000, 10000, 20000, 50000] },
    { type: 'experience', icon: Sparkles, title: 'Experience Voucher', description: 'Unlock exclusive experiences', amounts: [2500, 5000, 7500, 15000] },
  ];

  const handleRedeem = async (type, points) => {
    if (user.points < points) {
      alert('Insufficient points!');
      return;
    }
    if (!confirm(`Redeem ${points} points for a $${(points / 100).toFixed(2)} ${type} voucher?`)) return;
    setIsRedeeming(true);
    try {
      const response = await fetch('/api/redemptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, pointsCost: points }),
      });
      const data = await response.json();
      if (response.ok) {
        alert(`Success! Your voucher code is: ${data.redemption.voucherCode}\n\nValid until: ${new Date(data.redemption.expiresAt).toLocaleDateString()}`);
        onRedeem();
      } else {
        alert(data.error || 'Redemption failed');
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
    } finally {
      setIsRedeeming(false);
      setSelectedVoucher(null);
    }
  };

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-6">
        <Gift className="text-serendib-primary" size={24} />
        <h2 className="text-xl font-semibold">Redemption Center</h2>
      </div>
      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
        <div className="text-sm text-blue-800">💡 <strong>100 points = $1 USD</strong> • All vouchers valid for 6 months</div>
      </div>
      <div className="space-y-4">
        {vouchers.map((voucher) => (
          <div key={voucher.type} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start gap-3 mb-3">
              <div className="p-2 bg-serendib-primary/10 rounded-lg">
                <voucher.icon className="text-serendib-primary" size={20} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{voucher.title}</h3>
                <p className="text-sm text-gray-600">{voucher.description}</p>
              </div>
            </div>
            {selectedVoucher === voucher.type ? (
              <div className="space-y-2">
                <div className="text-sm font-semibold text-gray-700 mb-2">Select Amount:</div>
                <div className="grid grid-cols-2 gap-2">
                  {voucher.amounts.map((amount) => (
                    <button key={amount} onClick={() => handleRedeem(voucher.type, amount)} disabled={isRedeeming || user.points < amount}
                      className={`p-3 rounded-lg border-2 transition-all ${user.points >= amount ? 'border-serendib-primary hover:bg-serendib-primary hover:text-white cursor-pointer' : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'}`}>
                      <div className="font-bold">{amount.toLocaleString()} pts</div>
                      <div className="text-xs">${(amount / 100).toFixed(2)}</div>
                    </button>
                  ))}
                </div>
                <button onClick={() => setSelectedVoucher(null)} className="w-full mt-2 text-sm text-gray-600 hover:text-gray-900">Cancel</button>
              </div>
            ) : (
              <button onClick={() => setSelectedVoucher(voucher.type)} className="w-full btn-primary" disabled={isRedeeming}>Redeem</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
