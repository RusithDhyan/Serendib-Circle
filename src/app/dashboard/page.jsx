'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import Navbar from '../components/Navbar';
import TierTracker from '../components/TierTracker';
import RecentTransactions from '../components/RecentTransactions';
import RedemptionCenter from '../components/RedemptionCenter';
import ControlCenter from '../components/ControlCenter';
import BalanceCard from '../components/BalanceCard';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/auth/signin');
    }
  }, [status]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchUserData();
      fetchTransactions();
    }
  }, [status]);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user');
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/transactions');
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const refreshData = () => {
    fetchUserData();
    fetchTransactions();
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-serendib-primary"></div>
      </div>
    );
  }

  if (!userData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={userData} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {userData.name}!
          </h1>
          <p className="text-gray-600">Manage your rewards and track your progress</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <BalanceCard user={userData} />
          </div>
          <div>
            <TierTracker user={userData} />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <RedemptionCenter user={userData} onRedeem={refreshData} />
          <ControlCenter user={userData} onUpdate={refreshData} />
        </div>

        <div>
          <RecentTransactions transactions={transactions} />
        </div>
      </div>
    </div>
  );
}

// 'use client';

// import { useSession } from 'next-auth/react';
// import { useEffect, useState } from 'react';
// import { redirect } from 'next/navigation';
// import { Crown, Sparkles, Calendar, TrendingUp, Gift, ChevronRight, Star } from 'lucide-react';
// import Image from 'next/image';

// export default function DashboardLuxuryHotel() {
//   const { data: session, status } = useSession();
//   const [user, setUser] = useState(null);
//   const [transactions, setTransactions] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (status === 'unauthenticated') redirect('/auth/signin');
//     if (status === 'authenticated') fetchUserData();
//   }, [status]);

//   const fetchUserData = async () => {
//     try {
//       const res = await fetch('/api/user');
//       const data = await res.json();
//       setUser(data);
      
//       const transRes = await fetch('/api/transactions');
//       const transData = await transRes.json();
//       setTransactions(transData.slice(0, 6));
//     } catch (error) {
//       console.error('Error:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading || !user) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-900 via-amber-900/20 to-slate-900 flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-20 h-20 border-4 border-[#D9C6B1] border-t-[#dfb98d] rounded-full animate-spin mb-6"></div>
//           <p className="text-[#D9C6B1] font-serif text-lg">Loading your sanctuary...</p>
//         </div>
//       </div>
//     );
//   };

//   const getTierIcon = (tier) => {
//     switch (tier) {
//       case 'The Circle': return <Crown className="text-yellow-400" size={32} />;
//       case 'Voyager': return <Star className="text-[#D9C6B1]" size={32} fill="currentColor" />;
//       case 'Adventurer': return <Sparkles className="text-[#dfb98d]" size={32} />;
//       default: return <Star className="text-gray-400" size={32} />;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
//       {/* Luxury Background Elements */}
//       <div className="absolute inset-0 opacity-10">
//         <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#D9C6B1] rounded-full filter blur-3xl"></div>
//         <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#dfb98d] rounded-full filter blur-3xl"></div>
//       </div>
      
//       {/* Decorative Lines */}
//       <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D9C6B1] to-transparent"></div>
//       <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#dfb98d] to-transparent"></div>

//       {/* Content */}
//       <div className="relative z-10">
//         {/* Elegant Header */}
//         <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
//           <div className="container mx-auto px-8 py-6">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-12">
//                 <div className="flex items-center gap-4">
//                   <div className="w-12 h-12 bg-gradient-to-br from-[#D9C6B1] via-[#dfb98d] to-amber-600 rounded-lg flex items-center justify-center shadow-lg shadow-amber-500/50">
//                     <Crown className="text-slate-900" size={24} />
//                   </div>
//                   <div>
//                     <h1 className="text-2xl font-serif font-bold bg-gradient-to-r from-[#D9C6B1] to-[#dfb98d] bg-clip-text text-transparent">
//                       Serendib Circle
//                     </h1>
//                     <p className="text-xs text-gray-400 tracking-widest">LOYALTY REWARDS</p>
//                   </div>
//                 </div>
                
//                 <nav className="hidden lg:flex items-center gap-8">
//                   <a href="#" className="text-[#D9C6B1] font-medium hover:text-[#dfb98d] transition">Dashboard</a>
//                   <a href="#" className="text-gray-400 font-medium hover:text-[#D9C6B1] transition">Rewards</a>
//                   <a href="#" className="text-gray-400 font-medium hover:text-[#D9C6B1] transition">Benefits</a>
//                   <a href="#" className="text-gray-400 font-medium hover:text-[#D9C6B1] transition">History</a>
//                 </nav>
//               </div>

//               <div className="flex items-center gap-6">
//                 <div className="text-right hidden md:block">
//                   <p className="text-sm text-gray-400">Welcome back,</p>
//                   <p className="font-serif font-semibold text-[#D9C6B1]">{user.name}</p>
//                 </div>
//                 <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#D9C6B1] shadow-lg shadow-amber-500/30">
//                   <Image
//                     src={user.image || '/all-images/profile/profile.jpeg'}
//                     alt={user.name}
//                     width={56}
//                     height={56}
//                     className="object-cover"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* Main Content */}
//         <div className="container mx-auto px-8 py-12 max-w-7xl">
//           {/* Hero Section */}
//           <div className="mb-16 relative">
//             <div className="absolute -top-4 -left-4 w-32 h-32 border-l-2 border-t-2 border-[#D9C6B1]/30"></div>
//             <div className="absolute -bottom-4 -right-4 w-32 h-32 border-r-2 border-b-2 border-[#dfb98d]/30"></div>
            
//             <div className="relative bg-gradient-to-br from-[#D9C6B1]/10 via-[#dfb98d]/5 to-transparent backdrop-blur-xl border border-white/20 rounded-3xl p-12 shadow-2xl">
//               <div className="grid lg:grid-cols-2 gap-12 items-center">
//                 <div>
//                   <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#D9C6B1]/20 border border-[#D9C6B1]/40 rounded-full mb-6">
//                     <Sparkles className="text-[#dfb98d]" size={16} />
//                     <span className="text-sm text-[#D9C6B1] font-medium">Your Current Balance</span>
//                   </div>
                  
//                   <div className="mb-8">
//                     <div className="flex items-baseline gap-4 mb-3">
//                       <h2 className="text-7xl font-serif font-bold bg-gradient-to-r from-[#D9C6B1] via-[#dfb98d] to-amber-400 bg-clip-text text-transparent">
//                         {user.points.toLocaleString()}
//                       </h2>
//                       <span className="text-3xl text-gray-400 font-light">points</span>
//                     </div>
//                     <p className="text-xl text-gray-300 font-serif">
//                       Equivalent to <span className="text-[#dfb98d] font-semibold">${(user.points / 100).toFixed(2)} USD</span>
//                     </p>
//                   </div>

//                   <div className="space-y-4">
//                     <div className="flex items-center justify-between text-sm">
//                       <span className="text-gray-400">Progress to Next Milestone</span>
//                       <span className="text-[#D9C6B1] font-semibold">{Math.min(Math.round((user.points / 50000) * 100), 100)}%</span>
//                     </div>
//                     <div className="relative h-3 bg-slate-800 rounded-full overflow-hidden">
//                       <div className="absolute inset-0 bg-gradient-to-r from-slate-700 to-slate-800"></div>
//                       <div 
//                         className="relative h-full bg-gradient-to-r from-[#D9C6B1] via-[#dfb98d] to-amber-500 rounded-full shadow-lg shadow-amber-500/50 transition-all duration-1000"
//                         style={{ width: `${Math.min((user.points / 50000) * 100, 100)}%` }}
//                       >
//                         <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-transparent"></div>
//                       </div>
//                     </div>
//                     <p className="text-xs text-gray-500">
//                       {Math.max(50000 - user.points, 0).toLocaleString()} points until your next exclusive reward
//                     </p>
//                   </div>
//                 </div>

//                 <div className="relative">
//                   <div className="absolute -inset-4 bg-gradient-to-br from-[#D9C6B1]/20 to-[#dfb98d]/20 rounded-3xl blur-2xl"></div>
//                   <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 border border-[#D9C6B1]/30 rounded-2xl p-8 shadow-2xl">
//                     <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
//                       <div className="w-16 h-16 bg-gradient-to-br from-[#D9C6B1] to-[#dfb98d] rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/50">
//                         {getTierIcon(user.tier)}
//                       </div>
//                       <div>
//                         <p className="text-sm text-gray-400 mb-1">Member Status</p>
//                         <h3 className="text-2xl font-serif font-bold text-[#D9C6B1]">{user.tier}</h3>
//                       </div>
//                     </div>

//                     <div className="grid grid-cols-2 gap-4">
//                       <div className="bg-slate-700/30 rounded-xl p-4 border border-white/5">
//                         <p className="text-xs text-gray-400 mb-2">Points Multiplier</p>
//                         <p className="text-2xl font-bold text-[#dfb98d]">
//                           {user.tier === 'The Circle' ? '2.0x' : 
//                            user.tier === 'Voyager' ? '1.5x' : 
//                            user.tier === 'Adventurer' ? '1.25x' : '1.0x'}
//                         </p>
//                       </div>
                      
//                       <div className="bg-slate-700/30 rounded-xl p-4 border border-white/5">
//                         <p className="text-xs text-gray-400 mb-2">Total Stays</p>
//                         <p className="text-2xl font-bold text-white">{user.totalStays}</p>
//                       </div>

//                       <div className="col-span-2 bg-slate-700/30 rounded-xl p-4 border border-white/5">
//                         <p className="text-xs text-gray-400 mb-2">Lifetime Value</p>
//                         <p className="text-3xl font-bold bg-gradient-to-r from-[#D9C6B1] to-[#dfb98d] bg-clip-text text-transparent">
//                           ${user.totalSpend.toLocaleString()}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Stats Cards */}
//           <div className="grid md:grid-cols-3 gap-6 mb-12">
//             <div className="group relative overflow-hidden bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-[#D9C6B1]/50 transition-all duration-500">
//               <div className="absolute top-0 right-0 w-32 h-32 bg-[#D9C6B1]/10 rounded-full blur-3xl group-hover:bg-[#D9C6B1]/20 transition-all"></div>
//               <div className="relative">
//                 <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/30">
//                   <TrendingUp className="text-white" size={24} />
//                 </div>
//                 <p className="text-sm text-gray-400 mb-2">Average Spend</p>
//                 <p className="text-3xl font-bold text-white">
//                   ${user.totalStays > 0 ? (user.totalSpend / user.totalStays).toFixed(0) : '0'}
//                 </p>
//                 <p className="text-xs text-gray-500 mt-2">per booking</p>
//               </div>
//             </div>

//             <div className="group relative overflow-hidden bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-[#dfb98d]/50 transition-all duration-500">
//               <div className="absolute top-0 right-0 w-32 h-32 bg-[#dfb98d]/10 rounded-full blur-3xl group-hover:bg-[#dfb98d]/20 transition-all"></div>
//               <div className="relative">
//                 <div className="w-12 h-12 bg-gradient-to-br from-[#D9C6B1] to-[#dfb98d] rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-amber-500/30">
//                   <Sparkles className="text-slate-900" size={24} />
//                 </div>
//                 <p className="text-sm text-gray-400 mb-2">Points Per Stay</p>
//                 <p className="text-3xl font-bold text-white">
//                   {user.totalStays > 0 ? Math.round(user.points / user.totalStays).toLocaleString() : '0'}
//                 </p>
//                 <p className="text-xs text-gray-500 mt-2">average earnings</p>
//               </div>
//             </div>

//             <div className="group relative overflow-hidden bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-amber-500/50 transition-all duration-500">
//               <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-all"></div>
//               <div className="relative">
//                 <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-amber-500/30">
//                   <Calendar className="text-white" size={24} />
//                 </div>
//                 <p className="text-sm text-gray-400 mb-2">Member Since</p>
//                 <p className="text-3xl font-bold text-white">
//                   {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
//                 </p>
//                 <p className="text-xs text-gray-500 mt-2">loyalty journey</p>
//               </div>
//             </div>
//           </div>

//           {/* Recent Activity & Quick Actions */}
//           <div className="grid lg:grid-cols-3 gap-8">
//             {/* Recent Activity */}
//             <div className="lg:col-span-2 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
//               <div className="flex items-center justify-between mb-8">
//                 <div>
//                   <h3 className="text-2xl font-serif font-bold text-white mb-2">Recent Activity</h3>
//                   <p className="text-sm text-gray-400">Your latest transactions and rewards</p>
//                 </div>
//                 <button className="flex items-center gap-2 text-[#D9C6B1] hover:text-[#dfb98d] transition font-medium">
//                   View All
//                   <ChevronRight size={20} />
//                 </button>
//               </div>

//               <div className="space-y-4">
//                 {transactions.length === 0 ? (
//                   <div className="text-center py-12">
//                     <Gift className="w-16 h-16 text-gray-600 mx-auto mb-4" />
//                     <p className="text-gray-400">No transactions yet</p>
//                     <p className="text-sm text-gray-500 mt-2">Start your journey today</p>
//                   </div>
//                 ) : (
//                   transactions.map((t, i) => (
//                     <div
//                       key={t._id}
//                       className="group relative bg-slate-700/20 hover:bg-slate-700/40 border border-white/5 hover:border-[#D9C6B1]/30 rounded-xl p-5 transition-all duration-300"
//                       style={{ animationDelay: `${i * 100}ms` }}
//                     >
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center gap-4">
//                           <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
//                             t.points > 0 
//                               ? 'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/30' 
//                               : 'bg-gradient-to-br from-[#D9C6B1] to-[#dfb98d] shadow-lg shadow-amber-500/30'
//                           }`}>
//                             {t.points > 0 ? (
//                               <TrendingUp className="text-white" size={20} />
//                             ) : (
//                               <Gift className="text-slate-900" size={20} />
//                             )}
//                           </div>
//                           <div>
//                             <p className="font-semibold text-white mb-1">{t.description}</p>
//                             <p className="text-xs text-gray-400">
//                               {new Date(t.createdAt).toLocaleDateString('en-US', {
//                                 month: 'long',
//                                 day: 'numeric',
//                                 year: 'numeric'
//                               })}
//                             </p>
//                           </div>
//                         </div>

//                         <div className="text-right">
//                           <p className={`text-2xl font-bold ${
//                             t.points > 0 ? 'text-emerald-400' : 'text-[#D9C6B1]'
//                           }`}>
//                             {t.points > 0 ? '+' : ''}{t.points.toLocaleString()}
//                           </p>
//                           <p className="text-sm text-gray-500">${t.amount?.toFixed(2)}</p>
//                         </div>
//                       </div>
//                     </div>
//                   ))
//                 )}
//               </div>
//             </div>

//             {/* Quick Actions */}
//             <div className="space-y-6">
//               <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
//                 <h3 className="text-xl font-serif font-bold text-white mb-6">Quick Actions</h3>
                
//                 <div className="space-y-3">
//                   <button className="w-full group relative overflow-hidden bg-gradient-to-r from-[#D9C6B1] to-[#dfb98d] p-4 rounded-xl shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-all duration-300">
//                     <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
//                     <div className="relative flex items-center justify-between text-slate-900">
//                       <div className="flex items-center gap-3">
//                         <Gift size={20} />
//                         <span className="font-semibold">Redeem Points</span>
//                       </div>
//                       <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
//                     </div>
//                   </button>

//                   <button className="w-full group bg-slate-700/30 hover:bg-slate-700/50 border border-white/10 hover:border-[#D9C6B1]/30 p-4 rounded-xl transition-all duration-300">
//                     <div className="flex items-center justify-between text-white">
//                       <div className="flex items-center gap-3">
//                         <Crown size={20} className="text-[#D9C6B1]" />
//                         <span className="font-semibold">Tier Benefits</span>
//                       </div>
//                       <ChevronRight size={20} className="text-gray-400 group-hover:translate-x-1 group-hover:text-[#D9C6B1] transition-all" />
//                     </div>
//                   </button>

//                   <button className="w-full group bg-slate-700/30 hover:bg-slate-700/50 border border-white/10 hover:border-[#dfb98d]/30 p-4 rounded-xl transition-all duration-300">
//                     <div className="flex items-center justify-between text-white">
//                       <div className="flex items-center gap-3">
//                         <Calendar size={20} className="text-[#dfb98d]" />
//                         <span className="font-semibold">Book Stay</span>
//                       </div>
//                       <ChevronRight size={20} className="text-gray-400 group-hover:translate-x-1 group-hover:text-[#dfb98d] transition-all" />
//                     </div>
//                   </button>
//                 </div>
//               </div>

//               {/* Next Reward */}
//               <div className="relative overflow-hidden bg-gradient-to-br from-amber-900/30 to-slate-900/50 backdrop-blur-xl border border-amber-500/30 rounded-2xl p-6">
//                 <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl"></div>
//                 <div className="relative">
//                   <div className="flex items-center gap-2 mb-4">
//                     <Star className="text-amber-400" size={20} fill="currentColor" />
//                     <p className="text-sm text-amber-400 font-semibold">Next Reward</p>
//                   </div>
//                   <h4 className="text-xl font-serif font-bold text-white mb-2">
//                     Complimentary Suite Upgrade
//                   </h4>
//                   <p className="text-sm text-gray-400 mb-4">
//                     Available at {Math.max(50000 - user.points, 0).toLocaleString()} more points
//                   </p>
//                   <div className="flex items-center gap-2 text-xs text-amber-400">
//                     <Sparkles size={14} />
//                     <span>Exclusive member benefit</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }