"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Receipt,
  Gift,
  BarChart3,
  LogOut,
  Shield,
  User,
} from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";

export default function AdminLayout({ children }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/auth/signin");
    }
  }, [status]);

  useEffect(() => {
    const checkAdmin = async () => {
      if (status === "authenticated") {
        try {
          const response = await fetch("/api/user");
          const userData = await response.json();

          if (userData.role !== "admin" && userData.role !== "owner") {
            redirect("/dashboard");
          } else {
            setIsAdmin(true);
          }
        } catch (error) {
          console.error("Error checking admin status:", error);
          redirect("/dashboard");
        } finally {
          setLoading(false);
        }
      }
    };

    checkAdmin();
  }, [status]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-serendib-primary"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    // { name: "Users", href: "/admin/users", icon: Users },
    { name: "Transactions", href: "/admin/transactions", icon: Receipt },
    { name: "Redemptions", href: "/admin/redemptions", icon: Gift },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { name: "Profile", href: "/admin/profile", icon: User },
  ];

  const isSiteAdmin =
    session?.user?.role === "moderator" ||
    session?.user?.role === "supervisor" ||
    session?.user?.role === "manager" ||
    // session?.user?.role === "admin" ||
    session?.user?.role === "owner";
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-serendib-primary text-white shadow-lg fixed w-screen  z-50 shadow">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Shield size={24}/>
              <span className="text-xl font-bold">Admin Panel</span>
            </div>

            <div className="flex items-center gap-4">
              {/* <Link
                href="/dashboard"
                className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
              >
                Guest View
              </Link> */}
              {isSiteAdmin && (
                <Link
                  href="/site-admin"
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all duration-300 font-semibold"
                >
                  <span>Site Admin Panel</span>
                </Link>
              )}
              {session.user.image && (
                  <Link href="/admin/profile" className="flex flex-col items-center">
                    <Image
                      src={
                        session.user.image
                      }
                      alt={session.user.name}
                      width={1000}
                      height={100}
                      className="rounded-full w-8 h-8 object-cover"
                    />

                    <span className="text-xs opacity-90 hover:underline ">
                      {session?.user?.email}
                    </span>
                  </Link>
                )}

              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center gap-1 2xl:gap-2 px-2 2xl:px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
              >
                <LogOut size={18} />
                <span className="sm:text-sm">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className="sm:w-52 2xl:w-64 bg-white shadow-md fixed h-screen pt-20 ">
          <nav className="p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-serendib-primary text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
