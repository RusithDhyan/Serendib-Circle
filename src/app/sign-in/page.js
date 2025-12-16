"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { Eye, EyeOff, LogIn, X } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ForgotPassword from "../forgot-password/page";

export default function SignIn({ onClose }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currentImage, setCurrentImage] = useState(0);
  const [isForgotPassword, setIsForgotPassword] = useState(false); // New state for toggling between forms
  const router = useRouter();

  // 👇 Add your image URLs here
  const images = [
    "/all-images/sign-in/auth1.png",
    "/all-images/sign-in/auth2.png",
    "/all-images/sign-in/auth3-new.png",
    "/all-images/sign-in/auth4.png",
    "/all-images/sign-in/auth5.png",
  ];

  // Auto-slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  const handleSignIn = async () => {
    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        window.location.href = "/dashboard";
      } else {
        alert(data.error || "Login failed");
      }

      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        window.dispatchEvent(new Event("authChange"));
        router.push("/dashboard");
      } else {
        alert(data.message || "Sign in failed");
      }
    } catch (err) {
      alert("Something went wrong");
    }
  };

  return (
    <div className="items-center justify-center max-w-6xl p-5 bg-white rounded-md shadow-xl">
      <div className="flex justify-end">
        <button className="text-gray-500 hover:text-gray-800" onClick={onClose}>
          <X />
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-6">
        {/* LEFT SIDE */}
        <div className="flex flex-col items-center border-r border-gray-400 pr-5 w-full sm:w-1/2">
          <p className="font-bold text-start text-xl 2xl:text-2xl mb-5">
            Welcome To Serendib Hotel Management System
          </p>

          {/* 👇 Image Slider */}
          <div className="relative w-75 h-full overflow-hidden ">
            {images.map((src, idx) => (
              <Image
                key={idx}
                src={src}
                fill
                alt={`slide-${idx}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-2000 ${
                  idx === currentImage ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
          </div>
        </div>

        {/* RIGHT SIDE (Sign-in Form) */}
        <div className="flex items-center justify-center w-full sm:w-1/2 duration-500">
          <div className="relative py-10 overflow-hidden w-full">
            {/* Sign In Form */}
            {!isForgotPassword ? (
              <div className="px-4 space-y-4">
                <h2 className="text-2xl 2xl:text-3xl font-bold text-left py-4">
                  Sign In
                </h2>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email"
                  className="w-full border p-2 rounded-md mb-3"
                />

                <div className="relative mb-2">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="password"
                    className="w-full border p-2 rounded-md pr-10"
                  />
                  <span
                    className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </span>
                </div>

                <div className="text-right mt-1">
                  <button
                    onClick={() => setIsForgotPassword(true)}
                    className="text-sm text-orange-500 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>

                <button
                  onClick={handleSignIn}
                  className="flex items-center justify-between bg-black rounded-md w-full mt-4"
                >
                  <span className="text-white font-bold p-2 w-full text-left">
                    Sign In
                  </span>
                  <div className="bg-[#dfb98d] hover:bg-[#D9C6B1] p-2 rounded-r-md">
                    <LogIn size={25} color="white" />
                  </div>
                </button>
              </div>
            ) : (
              <ForgotPassword onClick={() => setIsForgotPassword(false)} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
