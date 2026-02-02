"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";

export default function ResetPasswordPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token;
  console.log(token);

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [currentImage, setCurrentImage] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  const images = [
    "/all-images/sign-in/auth1.png",
    "/all-images/sign-in/auth2.png",
    "/all-images/sign-in/auth3-new.png",
    "/all-images/sign-in/auth4.png",
    "/all-images/sign-in/auth5.png",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    const data = await res.json();
    setMessage(data.message);

    if (res.ok) {
      setTimeout(() => {
        router.push("/auth/signin");
      }, 2000);
    }
  };

  return (
        <div className="min-h-screen bg-gradient-to-br from-serendib-primary via-serendib-secondary to-serendib-accent flex items-center justify-center px-4">

    <div className="items-center justify-center max-w-6xl mx-auto px-5 py-10 rounded-md bg-white shadow-md">
      <div className="flex flex-col sm:flex-row gap-6">
        {/* LEFT SIDE */}
        <div className="flex flex-col items-center border-r border-gray-400 pr-5 w-full">
          <p className="font-bold text-start text-xl 2xl:text-2xl mb-5">
            Welcome To Serendib Circle
          </p>

          <div className="relative w-100 h-100 overflow-hidden ">
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
        <div className="flex items-center justify-center w-full transition-transform duration-500 py-10">
          <div className="max-w-2xl px-3 rounded">
            <h2 className="text-xl font-bold mb-4">Reset Password</h2>
            <form onSubmit={handleSubmit}>
              <div className="relative w-100">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border w-full p-2 rounded-md"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <button
                type="submit"
                className="bg-serendib-primary hover:bg-serendib-secondary text-white p-2 rounded-md my-2"
              >
                Update Password
              </button>
            </form>
            {message && <p className="mt-3 text-green-500">{message}</p>}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
