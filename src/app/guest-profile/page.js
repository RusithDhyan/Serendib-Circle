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

  const tiers = [
    { name: "Explorer", icon: "🌟" },
    { name: "Adventurer", icon: "🗺️" },
    { name: "Voyager", icon: "⛵" },
    { name: "The Circle", icon: "👑" },
  ];

  const currentTierIndex = tiers.findIndex((t) => t.name === user?.tier);
  const nextTier = tiers[currentTierIndex + 1];

  const roleColors = {
    owner: "text-purple-600",
    admin: "text-red-600",
    manager: "text-blue-600",
    supervisor: "text-green-600",
    moderator: "text-yellow-600",
    user: "text-black",
    guest: "text-gray-600",
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

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
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

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

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />

      <div className=" mx-auto px-6 py-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-serendib-primary hover:text-serendib-secondary mb-6"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        {/* PROFILE HEADER */}
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left">

          {/* Image + Role */}
          <div className="flex flex-col items-center">
            <div className="relative w-28 h-28">
              <Image
                src={user?.image || "/all-images/profile/profile.jpeg"}
                alt="Profile"
                fill
                className="rounded-full object-cover"
              />
            </div>
            <p className={`text-lg font-semibold ${roleColors[user?.role] || "text-gray-600"}`}>
              {user?.role}
            </p>
          </div>

          {/* Name Section */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-800">
              {user?.name}
            </h2>

            <span className="text-md bg-yellow-200 px-3 py-1 rounded-2xl shadow-md inline-block mt-2">
              Loyalty Number : {user?.loyaltyNumber}
            </span>

            <p className="text-sm text-gray-500 mt-3">
              Last password change:{" "}
              <span className="text-red-400">
                {user?.passwordChangedAt
                  ? new Date(user?.passwordChangedAt).toLocaleString()
                  : "Not changed yet"}
              </span>
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 justify-center md:justify-end">
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

        {/* TIER CARD */}
        <div className="bg-white rounded-2xl shadow p-6 mt-6 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
            <div className="text-4xl">
              {tiers[currentTierIndex]?.icon}
            </div>

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
            </div>
          )}
        </div>

        {/* ACCOUNT INFO */}
        <div className="bg-white rounded-2xl shadow p-6 mt-6 text-center md:text-left">
          <h3 className="text-lg font-semibold mb-4">
            Account Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{user?.email}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium">
                {user?.phone || "Not provided"}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowPopup(true)}
          className="bg-serendib-primary text-white p-2 mt-6 rounded-md hover:bg-serendib-secondary transition w-full md:w-auto mx-auto md:mx-0 flex justify-center"
        >
          Change Password
        </button>
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <ChangePasswordStepper onClose={() => setShowPopup(false)} />
        </div>
      )}
    </div>
  );
}
