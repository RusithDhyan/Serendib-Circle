"use client";
import React, { useEffect, useState } from "react";
import { Pencil, LogOut, X } from "lucide-react";
import { useRouter } from "next/navigation";
import Breadcrumbs from "../(components)/Breadcrumbs";
import { useSession, signOut } from "next-auth/react";
import ChangePasswordStepper from "../(components)/(profile)/ChangePassword";

export default function ProfileView() {
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState(null);
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);

  const { data: session, status, update } = useSession();

  // Initialize form with session data
  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
      setEmail(session.user.email || "");
      setPhone(session.user.phone || "");
    }
  }, [session]);

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
        credentials: "include",
      });

      const data = await res.json();

      if (data.success) {
        // Add timestamp to image URL to force browser reload
        const updatedImage =
          data.user.image?.includes("?")
            ? data.user.image + `&t=${Date.now()}`
            : data.user.image + `?t=${Date.now()}`;

        // Update NextAuth session instantly
        await update({
          ...session,
          user: {
            ...session.user,
            name: data.user.name,
            email: data.user.email,
            phone: data.user.phone,
            image: updatedImage || "/all-images/profile/profile.jpeg",
          },
        });

        setShowEditModal(false);
        alert("Profile updated successfully!");
      } else {
        alert(`Failed to update profile: ${data.message || "Unknown error"}`);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/");
    return null;
  }

  if (!session?.user) return <p>Not logged in</p>;

  return (
    <div className="flex-1 mt-12 ml-64">
      <Breadcrumbs />

      <div className="bg-white w-full p-6">
        <div className="flex items-center gap-6">
          {/* Profile Image */}
          <div className="w-28 h-28 relative">
            <img
              key={session?.user?.image} // forces re-render when URL changes
              src={session?.user?.image}
              alt="Profile Picture"
              className="w-28 h-28 object-cover rounded-full"
            />
          </div>

          {/* User Info */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{session.user.name}</h2>
            <h3 className="text-sm font-light">
              Last Password Changed Time:{" "}
              <span className="text-red-400">
                {session.user.updatedAt
                  ? new Date(session.user.updatedAt).toLocaleString()
                  : "Not has been Changed"}
              </span>
            </h3>
            <p className={`${roleColors[session.user.role] || "text-gray-600"}`}>
              {session.user.role}
            </p>
          </div>

          {/* Actions */}
          <div className="ml-auto flex gap-2">
            <button
              onClick={() => setShowEditModal(true)}
              className="flex items-center gap-2 text-sm px-4 py-2 text-white rounded-md bg-serendib-secondary hover:bg-serendib-primary"
            >
              <Pencil size={16} strokeWidth={1.7} /> Edit Profile
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>

        <div className="border-t border-gray-300 bg-gray-200 my-6"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-gray-600 text-sm">Email</label>
            <div className="text-gray-800 font-medium">{session.user.email}</div>
          </div>
          <div>
            <label className="text-gray-600 text-sm">Phone</label>
            <div className="text-gray-800 font-medium">{session.user.phone || "Not provided"}</div>
          </div>
        </div>

        <button
          onClick={() => setShowPopup(true)}
          className="text-white p-2 mt-5 rounded-md bg-serendib-primary hover:bg-serendib-secondary transition"
        >
          Change Password
        </button>
      </div>

      {/* Change Password Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <ChangePasswordStepper onClose={() => setShowPopup(false)} />
        </div>
      )}

      {/* === Edit Modal === */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-2xl relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              onClick={() => setShowEditModal(false)}
            >
              <X />
            </button>
            <h1 className="text-2xl text-center font-bold mb-4 text-blue-800">Edit Profile</h1>
            <form onSubmit={handleUpdate} encType="multipart/form-data" className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Profile Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                  className="w-full border border-black text-blue-500 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              {/* <div>
                <label className="block text-sm font-semibold mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div> */}
              <div>
                <label className="block text-sm font-semibold mb-1">Phone</label>
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
                className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
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
