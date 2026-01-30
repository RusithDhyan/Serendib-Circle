"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Pencil, LogOut, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfileView({ admin }) {
  const router = useRouter();
  const [showEditModal, setShowEditModal] = useState(false);
  const [fullname, setFullname] = useState(admin.fullname);
  const [email, setEmail] = useState(admin.email);
  const [phone, setPhone] = useState(admin.phone);
  const [image, setImage] = useState(null);

  const handleLogout = () => {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("fullname", fullname);
    formData.append("email", email);
    formData.append("phone", phone);
    if (image) formData.append("image", image);

    const res = await fetch("/api/profile", {
      method: "PUT",
      body: formData,
    });

    const data = await res.json();
    if (data.success) {
      window.location.reload(); // refresh UI
    } else {
      alert("Failed to update");
    }
  };

  return (
    <div>
      <div className="p-6">
        <div className="flex gap-6">
          <div className="w-28 h-28 relative">
            <Image
              src={admin.profileImage}
              alt="Profile"
              fill
              className="rounded-full object-cover"
            />
          </div>

          <div>
            <h2 className="text-2xl font-bold">{admin.fullname}</h2>
            <p className="text-gray-700">{admin.email}</p>
            <p className="text-gray-700">{admin.phone}</p>
          </div>

          <div className="ml-auto">
            <button
              onClick={() => setShowEditModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              <Pencil size={16} /> Edit
            </button>
            <button
              onClick={handleLogout}
              className="ml-2 px-4 py-2 bg-red-600 text-white rounded"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>

        {showEditModal && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg w-[90%] max-w-lg relative">
              <button
                className="absolute top-3 right-3"
                onClick={() => setShowEditModal(false)}
              >
                <X />
              </button>

              <form onSubmit={handleUpdate} className="space-y-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                  className="w-full border p-2"
                />

                <input
                  type="text"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  className="w-full border p-2"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border p-2"
                />

                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border p-2"
                />

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded"
                >
                  Save
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
