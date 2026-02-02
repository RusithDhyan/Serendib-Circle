"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ForgotPassword({ onClick }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const route = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setMessage(data.message);
  };

  return (
    <div className="space-y-2 py-5">
      <h2 className="text-xl font-bold text-left">
        Forgot Password
      </h2>

      <p className="text-sm text-gray-600 mb-2">
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
            className="border border-gray-500 text-gray-500 hover:bg-gray-200 hover:text-gray-500 px-4 py-2 rounded-md transition-all duration-300 eas-in-out"
          >
            Back
          </button>
          <button
            type="submit"
            className="bg-serendib-primary text-white hover:bg-serendib-secondary px-4 py-2 rounded-md"
          >
            Send Reset Link
          </button>
        </div>
      </form>
      {message && <p className="mt-3 text-green-500">{message}</p>}
    </div>
  );
}
