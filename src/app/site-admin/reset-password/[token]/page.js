"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token;

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    const data = await res.json();
    setMessage(data.message);

    // if (res.ok) {
    //   setTimeout(() => {
    //     router.push("/signin");
    //   }, 2000);
    // }
  };

  return (
    <div className="items-center justify-center max-w-6xl mx-auto px-5 py-20 rounded-md shadow-xl mt-10">
      <div className="flex flex-col sm:flex-row gap-6">
        {/* LEFT SIDE */}
        <div className="flex flex-col items-center border-r border-gray-400 pr-5 w-full sm:w-1/2">
          <p className="font-bold text-start text-xl 2xl:text-2xl mb-5">
            Welcome To Serendib Hotel Management System
          </p>
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
