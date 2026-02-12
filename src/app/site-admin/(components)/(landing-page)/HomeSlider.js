import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-6 2xl:py-2">
          <div className="flex items-center justify-between">
              <div className="flex items-center">
                  <Image src="/all-images/logo/Serendib.png" 
                  alt="logo"
                  width={1000}
                  height={100}
                  className="w-30 2xl:w-40 h-auto object-cover"/>
              </div>
            
            <div className="flex items-center gap-4">
              <Link
                href="/auth/signin"
                className="px-6 py-2.5 text-gray-700 font-semibold hover:text-yellow-600 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className="px-6 py-2.5 bg-[#dfb98d] text-white font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center items-center pt-32 pb-20 px-6 text-center">
        <div className="space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Welcome to
            <span className="block text-[#dfb98d]">Serendib Circle</span>
          </h1>

          <p className="text-xl text-gray-600 leading-relaxed">
            Join our exclusive loyalty program and earn points with every stay.
            Redeem for free nights, upgrades, and unforgettable experiences.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="px-8 py-4 bg-[#dfb98d] text-white font-bold rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300 text-center"
            >
              Join Free Today
            </Link>
            <Link
              href="/auth/signin"
              className="px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-full hover:border-[#dfb98d] hover:text-yellow-600 transition-all duration-300 text-center"
            >
              Sign In
            </Link>
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-8 pt-8">
            <div>
              <div className="text-3xl font-bold text-blue-600">10K+</div>
              <div className="text-sm text-gray-600">Active Members</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">50M+</div>
              <div className="text-sm text-gray-600">Points Earned</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Why Join Serendib Circle?
            </h2>
            <p className="text-xl text-gray-600">
              Unlock exclusive benefits and rewards
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group p-8 bg-gradient-to-br from-blue-50 to-white rounded-2xl border border-blue-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 flex flex-col items-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3">Earn Points</h3>
              <p className="text-gray-600 text-center">
                Get 10 points per dollar spent. Tier members earn up to 2x bonus
                points on every purchase.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 bg-gradient-to-br from-purple-50 to-white rounded-2xl border border-purple-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 flex flex-col items-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3">Tier Benefits</h3>
              <p className="text-gray-600 text-center">
                Progress through 4 exclusive tiers and unlock premium perks,
                upgrades, and VIP treatment.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 bg-gradient-to-br from-green-50 to-white rounded-2xl border border-green-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 flex flex-col items-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3">Redeem Rewards</h3>
              <p className="text-gray-600 text-center">
                Use your points for free nights, dining vouchers, spa
                experiences, and exclusive offers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-[#dfb98d] to-gray-100">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Earning?
          </h2>
          <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
            Join thousands of members enjoying exclusive rewards and benefits.
            Sign up today and get 500 bonus points!
          </p>
          <Link
            href="/auth/register"
            className="inline-block px-12 py-4 bg-white text-yellow-600 font-bold rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-2 px-6 bg-black text-gray-400">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-15 h-15 bg-white/80 rounded-lg flex items-center justify-center">
              <div className="flex items-center">
                  <Image src="/all-images/logo/Serendib.png" 
                  alt="logo"
                  width={1000}
                  height={100}
                  className="w-15 h-auto object-cover"/>
              </div>
            </div>
            <span className="text-2xl font-bold text-white">
              Serendib Circle
            </span>
          </div>
          <p className="text-sm">
            © 2026 Serendib Circle. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
