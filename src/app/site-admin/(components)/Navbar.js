"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Moon, Sun } from "lucide-react";
import SignIn from "../sign-in/page";

export default function Navbar() {
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(false);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);

  const isAuthPage =
    pathname === "/sign-in" ||
    // pathname === "/forgot-password" ||
    pathname === "/";

  // Theme setup
  useEffect(() => {
    const prefersDark = localStorage.getItem("theme") === "dark";
    if (prefersDark) {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  // Fetch user
  useEffect(() => {
    const checkUser = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setAdmin(null);
        setLoading(false);
        return;
      }

      fetch("/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch profile");
          return res.json();
        })
        .then((data) => {
          if (data.success) setAdmin(data.admin);
          else setAdmin(null);
          setLoading(false);
        })
        .catch(() => {
          setAdmin(null);
          setLoading(false);
        });
    };

    checkUser();

    // ✅ Custom event listener
    window.addEventListener("authChange", checkUser);

    return () => {
      window.removeEventListener("authChange", checkUser);
    };
  }, []);

  if (isAuthPage) {
    return (
      <nav className="p-1 px-4 flex justify-between items-center bg-gray-100 shadow-md">
        <Image
          src="/all-images/logo/Serendib.png"
          alt="Logo"
          width={1000}
          height={30}
          className="w-30 h-15"
        />
        <div className="flex gap-3 items-center">
          <button
            onClick={() => {
              setShowPopup(true);
            }}
            className="text-md bg-[#dfb98d] hover:bg-[#D9C6B1] text-white sm:text-md 2xl:text-xl py-2 px-4 shadow-md rounded-md"
          >
            Sign In
          </button>
        </div>
        {showPopup && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <SignIn
              onClose={() => {
                setShowPopup(false);
              }}
            />
          </div>
        )}
      </nav>
    );
  }

  return (
    <nav className="p-2 px-2 flex justify-end items-center shadow-md bg-gray-100">
      {/* Right section */}
      <div className="flex items-center gap-10 px-2">
        {/* Dark mode toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-md hover:bg-gray-100"
        >
          {isDark ? (
            <Sun className="text-yellow-400" size={20} strokeWidth={1.4} />
          ) : (
            <Moon className="text-gray-800" size={20} strokeWidth={1.4} />
          )}
        </button>

        {/* User info or Sign links */}
        {!loading &&
          (admin ? (
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 2xl:w-12 2xl:h-12 relative">
                <Image
                  src={admin.profileImage || "/profile-icon.svg"}
                  alt="Profile"
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              <div className="flex flex-col ">
                <Link href="/profile">
                  <span className="text-sm font-medium text-black hover:underline">
                    {admin.fullname}
                  </span>
                </Link>
                <span className="text-xs text-gray-600">{admin.email}</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center">
              <Link href="/" className="text-md bg-[#dfb98d] hover:bg-[#D9C6B1] py-2 px-4 rounded-md shadow-md">
                Sign In
              </Link>
            </div>
          ))}
      </div>
    </nav>
  );
}
