"use client";
import PermissionAccordion from "@/app/(components)/(users)/PermissionAccordian";
import ProtectedRoute from "@/app/(components)/ProtectedRoute";
import Sidebar from "@/app/(components)/Sidebar";
import { useData } from "@/app/context/DataContext";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function UserAccessPage() {
  const { currentUser } = useData();
  const { id } = useParams();
  const [isHovered, setIsHovered] = useState(false);
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState({
    canCreateHotel: false,
    canReadHotel: false,
    canUpdateHotel: false,
    canDeleteHotel: false,
    canCreateAccommodation: false,
    canReadAccommodation: false,
    canUpdateAccommodation: false,
    canDeleteAccommodation: false,
    canCreatePageExp: false,
    canReadPageExp: false,
    canUpdatePageExp: false,
    canDeletePageExp: false,
    canCreateGallery: false,
    canReadGallery: false,
    canUpdateGallery: false,
    canDeleteGallery: false,
    canCreateService: false,
    canReadService: false,
    canUpdateService: false,
    canDeleteService: false,

    canCreateOffer: false,
    canReadOffer: false,
    canUpdateOffer: false,
    canDeleteOffer: false,

    canCreateExperience: false,
    canReadExperience: false,
    canUpdateExperience: false,
    canDeleteExperience: false,

    canCreateBlog: false,
    canReadBlog: false,
    canUpdateBlog: false,
    canDeleteBlog: false,
    
    canCreateBlogContent: false,
    canReadBlogContent: false,
    canUpdateBlogContent: false,
    canDeleteBlogContent: false,

    canCreateHomeSlider: false,
    canReadHomeSlider: false,
    canUpdateHomeSlider: false,
    canDeleteHomeSlider: false,
    canCreateHomeTop: false,
    canReadHomeTop: false,
    canUpdateHomeTop: false,
    canDeleteHomeTop: false,
    canCreateHomeMiddle: false,
    canReadHomeMiddle: false,
    canUpdateHomeMiddle: false,
    canDeleteHomeMiddle: false,
    canCreateHomeExp: false,
    canReadHomeExp: false,
    canUpdateHomeExp: false,
    canDeleteHomeExp: false,
    canCreateHomeBottom: false,
    canReadHomeBottom: false,
    canUpdateHomeBottom: false,
    canDeleteHomeBottom: false,

    canCreateAboutTop: false,
    canReadAboutTop: false,
    canUpdateAboutTop: false,
    canDeleteAboutTop: false,
    canCreateAboutMiddle: false,
    canReadAboutMiddle: false,
    canUpdateAboutMiddle: false,
    canDeleteAboutMiddle: false,
    canCreateAboutBottom: false,
    canReadAboutBottom: false,
    canUpdateAboutBottom: false,
    canDeleteAboutBottom: false,

    canCreateContactContent: false,
    canReadContactContent: false,
    canUpdateContactContent: false,
    canDeleteContactContent: false,

    canCreateUsers: false,
    canReadUsers: false,
    canUpdateUsers: false,
    canDeleteUsers: false,

    canViewReports: false,
    canPrintReports: false,

    canViewPermissions: false,
  });

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch(`/api/users/${id}`);
      const data = await res.json();
      setUser(data.data);

      // If backend sends permissions, load them
      if (data.data?.permissions) {
        setPermissions(data.data.permissions);
      }
    };
    if (id) fetchUser();
  }, [id]);

  const handleToggle = (key) => {
    setPermissions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/users/${id}/permissions`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ permissions }),
      });

      const result = await res.json();
      if (result.success) {
        alert("Permissions updated successfully!");
      } else {
        alert("Failed to update permissions");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating permissions");
    }
  };

  if (!user) return <div className="p-6">Loading...</div>;

  const roleColors = {
    owner: "text-purple-600",
    admin: "text-red-600",
    manager: "text-blue-600",
    supervisor: "text-green-600",
    moderator: "text-yellow-600",
    user: "text-black",
  };
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
          <div className="flex flex-col md:flex-row gap-8 p-4 min-h-screen">
            {/* LEFT: User Profile */}
            <div className="md:w-1/2 bg-white p-6 rounded-md shadow">
              <div className="flex flex-col items-center">
                <Image
                  src={user?.profileImage || "/default-avatar.png"}
                  alt="User Avatar"
                  width={1000}
                  height={100}
                  className="w-40 h-40 rounded-full border-4 border-[#dfb98d] object-cover"
                />
                <h2 className="text-2xl font-semibold mt-4">{user.fullname}</h2>
                <p className="text-gray-600">{user.email}</p>
                {/* <p className="text-gray-600">{user.phone}</p> */}
                <p className="text-sm mt-2 bg-[#D9C6B1] px-3 py-1 rounded-full">
                  Role: {user.role || "User"}
                </p>
              </div>

              <div className="mt-6 space-y-2 text-gray-700">
                <p>
                  <span className="font-light">Phone:</span> {user.phone || "—"}
                </p>
                <p>
                  <span className="font-light">Joined Account At :</span>{" "}
                  {new Date(user.createdAt).toLocaleString()}
                </p>
                <p>
                  <span className="font-light">Updated Account At :</span>{" "}
                  {new Date(user.updatedAt).toLocaleString()}
                </p>
                <p className="font-light">
                  Last Password Changed Time :{" "}
                  <span className="text-red-400">
                    {user.resetPasswordExpire
                      ? new Date(user.resetPasswordExpire).toLocaleString()
                      : "Not has been Changed"}
                  </span>
                </p>
                <p>
                  Added By : {user.addedBy ? user.addedBy.fullname : "—"} |{" "}
                  <span>{user.addedBy ? user.addedBy.email : "-"}</span> |{" "}
                  <span className={`${roleColors[user.addedBy.role] || ""}`}>
                    {user.addedBy ? user.addedBy.role : "-"}
                  </span>
                </p>
              </div>
            </div>

            {/* RIGHT: Permissions */}
            <div className="md:w-1/2 bg-white p-6 rounded-md shadow">
              <h2 className="text-xl font-semibold mb-4">
                Authorization Access
              </h2>
              {!currentUser?.permissions?.canViewPermissions ? (
                <div className="p-6 text-center text-gray-500">
                  You do not have permission to view/allow permissions.
                </div>
              ) : (
                <PermissionAccordion
                  permissions={permissions}
                  handleToggle={handleToggle}
                />
              )}

              <button
                onClick={handleSave}
                className="mt-6 w-full  text-white py-2 rounded-md bg-[#dfb98d] text-white hover:bg-[#D9C6B1] transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
