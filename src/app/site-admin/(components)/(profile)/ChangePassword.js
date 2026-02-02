"use client";
import { Eye, EyeOff, X } from "lucide-react";
import { useState } from "react";

export default function ChangePasswordStepper({ onClose }) {
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => {
    if (step === 1 && !formData.currentPassword)
      return setMessage({
        type: "error",
        text: "Please enter your current password.",
      });
    if (step === 2 && !formData.newPassword)
      return setMessage({
        type: "error",
        text: "Please enter a new password.",
      });
    if (step < 3) {
      setMessage({ type: "", text: "" });
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setMessage({ type: "", text: "" });
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match!" });
      return false; // ❌ indicates failure
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch("/api/site-admin/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({
          type: "success",
          text: data.message || "Password changed successfully!",
        });
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setStep(1);
        return true; // ✅ indicates success
      } else {
        setMessage({
          type: "error",
          text: data.message || "Failed to change password.",
        });
        return false;
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: "An error occurred. Please try again.",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-2xl bg-white rounded-md shadow-md px-6 py-4">
      <div className="flex justify-end">
        <button className="text-gray-500 hover:text-gray-800" onClick={onClose}>
          <X />
        </button>
      </div>
      {/* Stepper Header */}
      <div className="flex items-center justify-between my-8">
        {["Current", "New", "Confirm"].map((label, index) => {
          const stepNumber = index + 1;
          const isActive = step === stepNumber;
          const isCompleted = step > stepNumber;

          return (
            <div key={index} className="flex-1 flex items-center">
              {/* Left line (except for first step) */}
              {index !== 0 && (
                <div
                  className={`flex-1 h-0.5 ${
                    step >= stepNumber ? "bg-green-500" : "bg-gray-300"
                  }`}
                />
              )}

              {/* Step Circle */}
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full border-2 transition-all ${
                  isCompleted
                    ? "bg-green-500 border-green-500 text-white"
                    : isActive
                    ? "border-serendib-secondary text-serendib-secondary"
                    : "border-gray-300 text-gray-400"
                }`}
              >
                {isCompleted ? "✓" : stepNumber}
              </div>

              {/* Right line (except for last step) */}
              {index !== 2 && (
                <div
                  className={`flex-1 h-0.5 ${
                    step > stepNumber ? "bg-green-500" : "bg-gray-300"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      <div className="space-y-4">
        {step === 1 && (
          <div className="relative">
            <label className="block text-sm font-medium mb-1">
              Current Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
            />
            <span
              className="absolute inset-y-4 right-3 top-10 flex items-center cursor-pointer text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>
        )}

        {step === 2 && (
          <div className="relative">
            <label className="block text-sm font-medium mb-1">
              New Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
            />
            <span
              className="absolute inset-y-0 right-3 top-5 flex items-center cursor-pointer text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>
        )}

        {step === 3 && (
          <div className="relative">
            <label className="block text-sm font-medium mb-1">
              Confirm New Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
            />
            <span
              className="absolute inset-y-0 right-3 top-5 flex items-center cursor-pointer text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>
        )}

        {message.text && (
          <p
            className={`text-sm ${
              message.type === "error" ? "text-red-500" : "text-green-600"
            }`}
          >
            {message.text}
          </p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex justify-between mt-6">
        <button
          onClick={prevStep}
          disabled={step === 1 || loading}
          className={`px-4 py-2 rounded-lg font-semibold border transition ${
            step === 1
              ? "border-gray-300 text-gray-400 cursor-not-allowed"
              : "border-serendib-secondary text-serendib-secondary hover:bg-serendib-secondary hover:text-white"
          }`}
        >
          Back
        </button>

        {step < 3 ? (
          <button
            onClick={nextStep}
            className="px-4 py-2 rounded-lg font-semibold bg-serendib-secondary text-white hover:bg-serendib-primary"
          >
            Next
          </button>
        ) : (
          <button
            onClick={async () => {
              const success = await handleSubmit(); // wait for API call
              if (success) onClose(); // close only if successful
            }}
            disabled={loading}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
            } text-white`}
          >
            {loading ? "Changing..." : "Change Password"}
          </button>
        )}
      </div>
    </div>
  );
}
