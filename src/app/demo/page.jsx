'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, DollarSign, Hotel } from 'lucide-react';

export default function DemoPage() {
  const { data: session, status } = useSession();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('earn');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/auth/signin');
    }
  }, [status]);

  useEffect(() => {
    const checkAdmin = async () => {
      if (status === 'authenticated') {
        try {
          const response = await fetch('/api/user');
          const userData = await response.json();
          
          if (userData.role !== 'admin' && userData.role !== 'superadmin') {
            redirect('/dashboard');
          } else {
            setIsAdmin(true);
          }
        } catch (error) {
          console.error('Error checking admin status:', error);
          redirect('/dashboard');
        } finally {
          setLoading(false);
        }
      }
    };
    
    checkAdmin();
  }, [status]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-serendib-primary"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          amount: parseFloat(amount),
          description: description || `${type === 'stay' ? 'Hotel stay' : 'Purchase'} - $${amount}`,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const pointsEarned = data.transaction.points;
        alert(`Success! You earned ${pointsEarned} points!\n\nYour new balance: ${data.user.points} points\nCurrent tier: ${data.user.tier}`);
        setAmount('');
        setDescription('');
      } else {
        alert(data.error || 'Transaction failed');
      }
    } catch (error) {
      console.error('Error creating transaction:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-serendib-primary hover:text-serendib-secondary">
            <ArrowLeft size={20} />
            Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="card">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Demo Transaction Simulator</h1>
            <p className="text-gray-600 mb-8">Simulate earning points through spending and stays</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Transaction Type</label>
                <div className="grid grid-cols-2 gap-4">
                  <button type="button" onClick={() => setType('earn')}
                    className={`p-4 rounded-lg border-2 transition-all ${type === 'earn' ? 'border-serendib-primary bg-serendib-primary/5' : 'border-gray-200 hover:border-gray-300'}`}>
                    <DollarSign className="mx-auto mb-2" size={24} />
                    <div className="font-semibold">Purchase</div>
                    <div className="text-xs text-gray-600">F&B, Spa, etc.</div>
                  </button>
                  <button type="button" onClick={() => setType('stay')}
                    className={`p-4 rounded-lg border-2 transition-all ${type === 'stay' ? 'border-serendib-primary bg-serendib-primary/5' : 'border-gray-200 hover:border-gray-300'}`}>
                    <Hotel className="mx-auto mb-2" size={24} />
                    <div className="font-semibold">Hotel Stay</div>
                    <div className="text-xs text-gray-600">Counts towards tier</div>
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="amount" className="block text-sm font-semibold text-gray-700 mb-2">Amount (USD)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-serendib-primary focus:border-transparent"
                    placeholder="0.00" step="0.01" min="0" required />
                </div>
                {amount && (
                  <div className="mt-2 text-sm text-gray-600">Base points: {(parseFloat(amount) * 10).toFixed(0)} pts (before tier multiplier)</div>
                )}
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">Description (optional)</label>
                <input type="text" id="description" value={description} onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-serendib-primary focus:border-transparent"
                  placeholder="e.g., Dinner at Ocean View Restaurant" />
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full btn-primary">
                {isSubmitting ? 'Processing...' : 'Simulate Transaction'}
              </button>
            </form>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">💡 How Points Work</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Base rate: 10 points per $1 USD</li>
                <li>• Explorer: 1.0x multiplier (no bonus)</li>
                <li>• Adventurer: 1.25x multiplier (25% bonus)</li>
                <li>• Voyager: 1.5x multiplier (50% bonus)</li>
                <li>• The Circle: 2.0x multiplier (100% bonus)</li>
                <li>• Hotel stays count towards tier progression</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
