// "use client";
// import { useEffect, useState } from "react";
// import Image from "next/image";
// import Link from "next/link";

// export default function HomeSlider() {
//   const [currentIndex, setCurrentIndex] = useState(0);

//   const homeSlider = [
//     { url: "/all-images/images/cover-image1-new.jpg" },
//     { url: "/all-images/images/cover-image2.jpg" },
//     { url: "/all-images/images/cover-image3.jpg" },
//     { url: "/all-images/images/cover-img4.jpg"}
//   ];

//   // Auto change image every 5s
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentIndex((prev) => (prev + 1) % homeSlider.length);
//     }, 5000);
//     return () => clearInterval(interval);
//   }, [homeSlider.length]);

//   return (
//     <div>
//     <div className="home_slider relative w-full h-screen">
//       {/* Overlay content */}
//       <div className="absolute inset-0 z-10 flex justify-left items-center sm:px-10 pointer-events-none">
//         <div className="flex flex-col">
//           <h1 className="text-2xl md:text-3xl lg:text-6xl 2xl:text-8xl text-white font-bold px-2 text-left drop-shadow-md">
//             Serendib Hotel <br />
//             Management System
//           </h1>
//           <p className="px-2 text-white">
//             Situated along the N265 in Liwonde, Waters Edge Hotel offers a
//             peaceful retreat with scenic surroundings <br /> and sweeping views
//             of the natural landscape...
//           </p>
//         </div>
//       </div>

//       {/* Slideshow images */}
//       <div className="absolute inset-0">
//         {homeSlider.map((slide, index) => (
//           <div
//             key={index}
//             className={`absolute inset-0 transition-opacity duration-1000 ${
//               index === currentIndex ? "opacity-100" : "opacity-0"
//             }`}
//           >
//             <Image
//               src={slide.url}
//               alt={`slide-${index}`}
//               fill
//               className="object-cover"
//               priority={index === 0}
//             />
//           </div>
//         ))}
//       </div>
//     </div>
//      <div className="min-h-screen bg-orange-100 from-serendib-primary via-serendib-secondary to-serendib-accent">
//       <div className="container mx-auto px-4 py-16">
//         <div className="max-w-4xl mx-auto text-center">
//           <h1 className="text-6xl font-bold mb-6">Serendib Circle</h1>
//           <p className="text-2xl mb-4">Your Gateway to Exclusive Rewards</p>
//           <p className="text-xl mb-12 opacity-90">
//             Earn 10 points per dollar. Unlock elite tiers. Redeem with USD-pegged stability.
//           </p>

//           <div className="grid md:grid-cols-3 gap-8 mb-16">
//             <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6">
//               <div className="text-4xl mb-4">💎</div>
//               <h3 className="text-xl font-bold mb-2">4 Elite Tiers</h3>
//               <p className="opacity-90">From Explorer to The Circle</p>
//             </div>
//             <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6">
//               <div className="text-4xl mb-4">⚡</div>
//               <h3 className="text-xl font-bold mb-2">Accelerated Earning</h3>
//               <p className="opacity-90">Up to 100% point bonus</p>
//             </div>
//             <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6">
//               <div className="text-4xl mb-4">💰</div>
//               <h3 className="text-xl font-bold mb-2">USD-Pegged Value</h3>
//               <p className="opacity-90">100 points = $1 USD</p>
//             </div>
//           </div>

//           <div className="flex gap-4 justify-center">
//             <Link
//               href="/auth/register"
//               className="inline-block bg-white text-serendib-primary font-bold text-lg px-12 py-4 rounded-lg hover:bg-gray-100 transition-colors duration-200 shadow-xl"
//             >
//               Create Account
//             </Link>
//             <Link
//               href="/auth/signin"
//               className="inline-block bg-transparent border-2 border-black font-bold text-lg px-12 py-4 rounded-lg hover:bg-black/10 transition-colors duration-200"
//             >
//               Sign In
//             </Link>
//           </div>

//           <div className="mt-16 bg-white/5 backdrop-blur-sm rounded-xl p-8">
//             <h2 className="text-3xl font-bold mb-8">Tier Benefits</h2>
//             <div className="grid md:grid-cols-4 gap-6 text-left">
//               <div>
//                 <h4 className="font-bold text-lg mb-2">🌟 Explorer</h4>
//                 <p className="text-sm opacity-90">Entry level • Base points</p>
//               </div>
//               <div>
//                 <h4 className="font-bold text-lg mb-2">🗺️ Adventurer</h4>
//                 <p className="text-sm opacity-90">2+ stays • 25% bonus</p>
//               </div>
//               <div>
//                 <h4 className="font-bold text-lg mb-2">⛵ Voyager</h4>
//                 <p className="text-sm opacity-90">5+ stays • 50% bonus</p>
//               </div>
//               <div>
//                 <h4 className="font-bold text-lg mb-2">👑 The Circle</h4>
//                 <p className="text-sm opacity-90">11+ stays • 100% bonus</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//     </div>
//   );
// }

import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Serendib Circle
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <Link
                href="/auth/signin"
                className="px-6 py-2.5 text-gray-700 font-semibold hover:text-blue-600 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-block">
                <span className="px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">
                  ✨ Earn Rewards • Save More • Travel Better
                </span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Welcome to
                <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Serendib Circle
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                Join our exclusive loyalty program and earn points with every stay. 
                Redeem for free nights, upgrades, and unforgettable experiences.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/auth/register"
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300 text-center"
                >
                  Join Free Today
                </Link>
                <Link
                  href="/auth/signin"
                  className="px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-full hover:border-blue-600 hover:text-blue-600 transition-all duration-300 text-center"
                >
                  Sign In
                </Link>
              </div>

              {/* Stats */}
              <div className="flex gap-8 pt-8">
                <div>
                  <div className="text-3xl font-bold text-blue-600">10K+</div>
                  <div className="text-sm text-gray-600">Active Members</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600">50M+</div>
                  <div className="text-sm text-gray-600">Points Earned</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600">4.9★</div>
                  <div className="text-sm text-gray-600">Member Rating</div>
                </div>
              </div>
            </div>

            {/* Right Image/Card */}
            <div className="relative">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-72 h-72 bg-blue-200 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
              <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-200 rounded-full filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
              
              {/* Main Card */}
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                <div className="space-y-6">
                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-4 border-b">
                    <div>
                      <h3 className="text-2xl font-bold">Loyalty Card</h3>
                      <p className="text-sm text-gray-500">Member Benefits</p>
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>

                  {/* Points Display */}
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6">
                    <div className="text-sm text-gray-600 mb-2">Your Points Balance</div>
                    <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      12,450
                    </div>
                    <div className="text-sm text-gray-500 mt-1">≈ $124.50 USD</div>
                  </div>

                  {/* Tier Badges */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                      <div className="text-xs text-gray-500 mb-1">Current Tier</div>
                      <div className="font-bold text-gray-800">Voyager</div>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-4 border-2 border-yellow-200">
                      <div className="text-xs text-orange-600 mb-1">Next Tier</div>
                      <div className="font-bold text-orange-700">The Circle</div>
                    </div>
                  </div>

                  {/* Benefits List */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-700">50% Bonus Points on Stays</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-700">Free Room Upgrades</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-700">Early Check-in Access</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Join Serendib Circle?</h2>
            <p className="text-xl text-gray-600">Unlock exclusive benefits and rewards</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group p-8 bg-gradient-to-br from-blue-50 to-white rounded-2xl border border-blue-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3">Earn Points</h3>
              <p className="text-gray-600">Get 10 points per dollar spent. Tier members earn up to 2x bonus points on every purchase.</p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 bg-gradient-to-br from-purple-50 to-white rounded-2xl border border-purple-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3">Tier Benefits</h3>
              <p className="text-gray-600">Progress through 4 exclusive tiers and unlock premium perks, upgrades, and VIP treatment.</p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 bg-gradient-to-br from-green-50 to-white rounded-2xl border border-green-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3">Redeem Rewards</h3>
              <p className="text-gray-600">Use your points for free nights, dining vouchers, spa experiences, and exclusive offers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Earning?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of members enjoying exclusive rewards and benefits. Sign up today and get 500 bonus points!
          </p>
          <Link
            href="/auth/register"
            className="inline-block px-12 py-4 bg-white text-blue-600 font-bold rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-gray-900 text-gray-400">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="text-2xl font-bold text-white">Serendib Circle</span>
          </div>
          <p className="text-sm">© 2026 Serendib Circle. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}