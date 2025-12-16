"use client";
import React, { useEffect, useState } from "react";
import { Pencil, LogOut, X } from "lucide-react";
import Image from "next/image";
import Sidebar from "../(components)/Sidebar";
import { useRouter } from "next/navigation";
import Breadcrumbs from "../(components)/Breadcrumbs";
import ProtectedRoute from "../(components)/ProtectedRoute";
import ChangePassword from "../(components)/(profile)/ChangePassword";

export default function ProfileView() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [fullname, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState(null);
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const roleColors = {
    owner: "text-purple-600",
    admin: "text-red-600",
    manager: "text-blue-600",
    supervisor: "text-green-600",
    moderator: "text-yellow-600",
    user: "text-black",
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("token",token);

    if (!token) {
      setLoading(false);
      return;
    }

    fetch("/api/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch profile");
        return res.json();
      })
      .then((data) => {
        if (data.success) {
          setAdmin(data.admin);
          setName(data.admin.fullname);
          setEmail(data.admin.email);
          setPhone(data.admin.phone);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("fullname", fullname);
    formData.append("email", email);
    formData.append("phone", phone);
    if (image) {
      formData.append("image", image);
    }

    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();
    if (data.success) {
      setAdmin(data.admin);
      setShowEditModal(false);
    } else {
      alert("Failed to update profile");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!admin) return <p>Not logged in</p>;

  return (
    <ProtectedRoute>
      <div className="flex">
        <div
          className={`
          bg-gray-100 shadow-md transition-all duration-300
          ${isHovered ? "sm:w-50 2xl:w-64" : "w-20"}
        `}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Sidebar isHovered={isHovered} />
        </div>
        <div
          className={`
          flex-1 transition-all duration-300
          ${isHovered ? "ml-1" : "ml-1"}
          
        `}
        >
          <Breadcrumbs />
          <div className="bg-white w-full p-6">
            <div className="flex items-center gap-6">
              <div className="w-28 h-28 relative">
                <Image
                  src={admin.profileImage}
                  alt="Profile Picture"
                  fill
                  className="object-cover rounded-full"
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {admin.fullname}
                </h2>
                <h3 className="text-sm font-light">
                  Last Password Changed Time :{" "}
                  <span className="text-red-400">
                    {admin.resetPasswordExpire
                      ? new Date(admin.resetPasswordExpire).toLocaleString()
                      : "Not has been Changed"}
                  </span>
                </h3>
                <p className={`${roleColors[admin.role] || ""}`}>
                  {admin.role}
                </p>
              </div>

              <div className="ml-auto flex gap-2">
                <button
                  onClick={() => setShowEditModal(true)}
                  className="flex items-center gap-2 text-sm px-4 py-2 text-white rounded bg-[#D9C6B1] hover:bg-[#dfb98d]"
                >
                  <Pencil size={16} strokeWidth={1.7} /> Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </div>

            <div className="border-t border-gray-300 bg-gray-200  my-6"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-600 text-sm">Email</label>
                <div className="text-gray-800 font-medium">{admin.email}</div>
              </div>
              <div>
                <label className="text-gray-600 text-sm">Phone</label>
                <div className="text-gray-800 font-medium">{admin.phone}</div>
              </div>
            </div>
            <button onClick={()=>{
              setShowPopup(true)
            }} 
            className="bg-blue-800 text-white p-2 mt-5 rounded-md hover:bg-blue-900 transition">
              Change Password
            </button>
          </div>

          {showPopup && (
            <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
              <ChangePassword onClose ={()=>{setShowPopup(false)}}/>
              </div>
          )}

          {/* === Modal === */}
          {showEditModal && (
            <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg w-[90%] max-w-2xl relative">
                <button
                  className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                  onClick={() => setShowEditModal(false)}
                >
                  <X />
                </button>
                <h1 className="text-2xl text-center font-bold mb-4 text-blue-800">
                  Edit Profile
                </h1>
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
                      className="w-full border border-black text-blue-500 rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">
                      Full Name
                    </label>
                    <input
                      type="fullname"
                      value={fullname}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full border rounded px-3 py-2"
                      required
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
                      required
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
                    className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Save Changes
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
