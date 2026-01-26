"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

export default function ResetPasswordPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token;

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [currentImage, setCurrentImage] = useState(0);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/auth-cp/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    const data = await res.json();
    setMessage(data.message);

    if (res.ok) {
      setTimeout(() => {
        router.push("/sign-up");
      }, 2000);
    }
  };

  return (
    <div className="items-center justify-center max-w-6xl mx-auto px-5 py-20 rounded-md shadow-xl mt-10">
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
        <div className="flex items-center justify-center w-full sm:w-1/2 transition-transform duration-500 py-10">
          <div className="max-w-md px-3 rounded">
            <h2 className="text-xl font-bold mb-4">Reset Password</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="password"
                placeholder="new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border w-full p-2 mb-3 rounded-md"
              />
              <button
                type="submit"
                className="bg-green-600 text-white p-2 rounded-md"
              >
                Update Password
              </button>
            </form>
            {message && <p className="mt-3 text-green-500">{message}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
