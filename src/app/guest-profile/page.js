"use client";

import React, { useEffect, useState } from "react";
import { Pencil, LogOut, X, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import ChangePasswordStepper from "../site-admin/(components)/(profile)/ChangePassword";

export default function ProfileView() {
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [user, setUserData] = useState(null);

  const router = useRouter();
  const { data: session, status, update } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      fetchUserData();
    }
  }, [status]);

  useEffect(() => {
  if (showEditModal && user) {
    setName(user.name || "");
    setEmail(user.email || "");
    setPhone(user.phone || "");
  }
}, [showEditModal, user]);


  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/user");
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  /* ===== TIERS ===== */
  const tiers = [
    { name: "Explorer", stays: 0, spend: 0, icon: "🌟" },
    { name: "Adventurer", stays: 2, spend: 1000, icon: "🗺️" },
    { name: "Voyager", stays: 5, spend: 2000, icon: "⛵" },
    { name: "The Circle", stays: 11, spend: 3500, icon: "👑" },
  ];

  const currentTierIndex = tiers.findIndex((t) => t.name === user?.tier);
  const nextTier = tiers[currentTierIndex + 1];

  /* ===== ROLE COLORS ===== */
  const roleColors = {
    owner: "text-purple-600",
    admin: "text-red-600",
    manager: "text-blue-600",
    supervisor: "text-green-600",
    moderator: "text-yellow-600",
    user: "text-black",
    guest: "text-gray-600",
  };

  /* ===== LOGOUT ===== */
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  /* ===== UPDATE PROFILE ===== */
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("phone", phone);
      if (image) formData.append("image", image);

      const res = await fetch("/api/site-admin/profile", {
        method: "PUT",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();

      if (data.success) {
        await update({
          name: data.user.name,
          email: data.user.email,
          phone: data.user.phone,
          image: data.user.image,
        });

        setShowEditModal(false);
        alert("Profile updated successfully!");
      } else {
        alert(data.message || "Update failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* ===== AUTH GUARDS ===== */
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/");
    return null;
  }
  // console.log(user?.tier);
  if (!user) return null;
  if (!user.email) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />

      <div className="max-w-auto mx-auto px-6 py-8">
        {/* BACK */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-serendib-primary hover:text-serendib-secondary mb-6"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        {/* ===== PROFILE HEADER ===== */}
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col md:flex-row gap-6 items-center">
          <div className="flex flex-col items-center">
            <div className="relative w-28 h-28">
              <Image
                src={user?.image || "/all-images/profile/profile.jpeg"}
                alt="Profile"
                fill
                className="rounded-full object-cover"
              />
            </div>
            <p
              className={`text-lg font-semibold ${
                roleColors[user?.role] || "text-gray-600"
              }`}
            >
              {user?.role}
            </p>
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-800">{user?.name}</h2>
            <span className="text-md bg-yellow-200 px-2 rounded-2xl shadow-md">
              Loyalty Number : {user?.loyaltyNumber}
            </span>

            <p className="text-sm text-gray-500 mt-2">
              Last password change:{" "}
              <span className="text-red-400">
                {user?.resetPasswordExpire
                  ? new Date(user?.resetPasswordExpire).toLocaleString()
                  : "Not has been changed"}
              </span>
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowEditModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-serendib-secondary text-white hover:bg-serendib-primary"
            >
              <Pencil size={16} /> Edit
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>

        {/* ===== TIER CARD ===== */}
        <div className="bg-white rounded-2xl shadow p-6 mt-6">
          <div className="flex items-center gap-4">
            <div className="text-4xl">{tiers[currentTierIndex]?.icon}</div>
            <div>
              <h3 className="text-xl font-semibold text-serendib-primary">
                {user?.tier}
              </h3>
              <p className="text-sm text-gray-600">Current Tier</p>
            </div>
          </div>

          {nextTier && (
            <div className="mt-4 bg-serendib-primary/5 rounded-lg p-4">
              <p className="text-sm font-semibold text-serendib-primary">
                Next Tier: {nextTier.name}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {nextTier.name === "Adventurer" &&
                  "25% point bonus + Early check-in"}
                {nextTier.name === "Voyager" &&
                  "50% point bonus + Room upgrades"}
                {nextTier.name === "The Circle" &&
                  "100% point bonus + VIP status"}
              </p>
            </div>
          )}
        </div>

        {/* ===== ACCOUNT INFO ===== */}
        <div className="bg-white rounded-2xl shadow p-6 mt-6">
          <h3 className="text-lg font-semibold mb-4">Account Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium">{user?.phone || "Not provided"}</p>
            </div>
          </div>
        </div>
        <button
          onClick={() => {
            setShowPopup(true);
          }}
          className="bg-serendib-primary text-white p-2 mt-5 rounded-md hover:bg-serendib-secondary transition"
        >
          Change Password
        </button>
      </div>
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <ChangePasswordStepper
            onClose={() => {
              setShowPopup(false);
            }}
          />
        </div>
      )}

      {/* ===== EDIT MODAL ===== */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-2xl relative">
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              <X />
            </button>

            <h2 className="text-2xl font-bold text-center mb-6 text-serendib-primary">
              Edit Profile
            </h2>

            <form
              onSubmit={handleUpdate}
              encType="multipart/form-data"
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Profile Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 bg-serendib-primary text-white rounded hover:bg-serendib-secondary disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
