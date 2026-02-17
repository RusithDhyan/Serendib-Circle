"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Navbar({ user }) {

  if (!user) return null;

  const getTierColor = (tier) => {
    switch (tier) {
      case "The Circle":
        return "bg-serendib-gold text-white";
      case "Voyager":
        return "bg-serendib-silver text-gray-800";
      case "Adventurer":
        return "bg-serendib-bronze text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const isAdmin = user.role === "admin" || user.role === "owner";
  const isSiteAdmin =
    user.role === "moderator" ||
    user.role === "supervisor" ||
    user.role === "manager" ||
    user.role === "admin" ||
    user.role === "owner";
  console.log("current user:", user.tier);

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className="text-2xl font-bold text-serendib-primary hover:text-serendib-secondary transition-colors"
            >
              Serendib Circle
            </Link>

            {/* {isAdmin && (
              <Link
                href="/admin"
                className="flex items-center gap-2 px-4 py-2 bg-serendib-primary text-white rounded-lg hover:bg-serendib-secondary transition-colors font-semibold"
              >
                <span>Admin Panel</span>
              </Link>
            )}
            {isSiteAdmin && (
              <Link
                href="/site-admin"
                className="flex items-center gap-2 px-4 py-2 bg-serendib-primary text-white rounded-lg hover:bg-serendib-secondary transition-colors font-semibold"
              >
                <span>Site Admin Panel</span>
              </Link>
            )} */}
          </div>

          <div className="flex items-center gap-4">
            <div className={`tier-badge ${getTierColor(user.tier)} hidden sm:block`}>
              {user.tier}
            </div>

            {user.image && (
              <Link href="/guest-profile">
                <Image
                  src={user.image || "/all-images/profile/profile.jpeg"}
                  alt={user.name}
                  width={1000}
                  height={100}
                  className="rounded-full w-12 h-12 object-cover"
                />
              </Link>
            )}

            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <LogOut size={20} />
              <span className="hidden md:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
