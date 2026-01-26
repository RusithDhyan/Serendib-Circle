"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ForgotPassword({ onClick }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const route = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/auth-cp/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setMessage(data.message);
  };

  return (
    <div className="space-y-4 py-10">
      <h2 className="text-2xl 2xl:text-3xl font-bold text-left py-4">
        Forgot Password
      </h2>

      <p className="text-sm text-gray-600 mb-4">
        Please enter your email to receive a password reset link.
      </p>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border w-full p-2 mb-3 rounded-md"
        />
        <div className="flex items-center gap-2">
          <button
            onClick={onClick}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Back
          </button>
          <button
            type="submit"
            className="bg-[#dfb98d] text-white hover:bg-[#D9C6B1] px-4 py-2 rounded"
          >
            Send Reset Link
          </button>
        </div>
      </form>
      {message && <p className="mt-3 text-green-500">{message}</p>}
    </div>
  );
}
