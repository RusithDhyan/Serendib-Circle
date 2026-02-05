"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { redirect, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Receipt,
  Gift,
  BarChart3,
  LogOut,
  Shield,
  Hotel,
  Users,
  User2,
  HotelIcon,
  Tag,
  MountainSnow,
  FileText,
  HomeIcon,
  Lightbulb,
  MessageCircle,
  UserPlus,
} from "lucide-react";

export default function AdminLayoutClient({ children }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user,setUser] = useState(null);

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
          setUser(userData);
          if (
            userData.role !== "moderator" &&
            userData.role !== "supervisor" &&
            userData.role !== "manager" &&
            userData.role !== "admin" &&
            userData.role !== "owner"
          ) {
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
    { name: "Dashboard", href: "/site-admin", icon: LayoutDashboard },
    { name: "Hotels", href: "/site-admin/hotels", icon: HotelIcon },
    { name: "Offers", href: "/site-admin/offers", icon: Tag },
    { name: "Blogs", href: "/site-admin/blogs", icon: FileText },
    { name: "Experience", href: "/site-admin/experiences", icon: MountainSnow },
    { name: "Home Content", href: "/site-admin/homeContent", icon: HomeIcon },
    { name: "About", href: "/site-admin/about", icon: Lightbulb },
    { name: "Contact", href: "/site-admin/contact", icon: MessageCircle },
    { name: "Add Users", href: "/site-admin/addUsers", icon: UserPlus },
    { name: "Profile", href: "/site-admin/profile", icon: User2 },
  ];

   const isSiteAdmin =
    user.role === "admin" ||
    user.role === "owner";

    console.log(user.role)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-serendib-primary text-white shadow-lg fixed w-screen  z-50 shadow">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Shield size={24} />
              <span className="text-xl font-bold">Site-Admin Panel</span>
            </div>

            <div className="flex items-center gap-4">
              {/* <Link
                href="/admin"
                className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-all duration-300"
              >
                Admin View
              </Link> */}
              {isSiteAdmin && (
              <Link
                href="/admin"
                className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-all duration-300"
              >
                <span>Admin Panel</span>
              </Link>
            )}
             
              <span className="text-sm opacity-90">{session?.user?.email}</span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
              >
                <LogOut size={18} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 shadow-md bg-white fixed h-screen pt-20">
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
        <main className="flex-1 p-5 mt-2">{children}</main>
      </div>
    </div>
  );
}
