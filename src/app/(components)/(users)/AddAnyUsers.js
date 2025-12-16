"use client";
import { useData } from "@/app/context/DataContext";
import { BadgePlus, File, Trash } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import AddUsers from "../(hotels)/(forms)/AddUsers";
import Link from "next/link";

export default function AddAnyUsers() {
  const { users, currentUser, fetchAddUsers } = useData();
  const [search, setSearch] = useState("");
  const [showAddUsersPopup, setShowAddUsersPopup] = useState(false);
  const [editingAddUsers, setEditingAddUsers] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const roleLevels = {
    owner: 5,
    admin: 4,
    manager: 3,
    supervisor: 2,
    moderator: 1,
    user: 0,
  };

  const filteredUsers = users.filter(
    (user) =>
      currentUser?.role &&
      user.fullname.toLowerCase().includes(search.toLowerCase()) &&
      roleLevels[user.role] < roleLevels[currentUser.role]
  );

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const roleColors = {
    admin: "text-red-600",
    manager: "text-blue-600",
    supervisor: "text-green-600",
    moderator: "text-yellow-600",
    user: "text-black",
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // ✅ send token
        },
      });

      const result = await res.json();

      if (res.ok && result.success) {
        alert(result.message || "User deleted successfully");
        // fetchAddUsers();
      } else {
        alert(
          "Failed to delete user: " +
            (result.message || result.error || "Unknown error")
        );
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("An error occurred while deleting the user: " + error.message);
    }
  };

  if (!currentUser) {
    return <div className="text-center p-4">Loading current user...</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h1 className="pr-6 mt-2 sm:text-xl 2xl:text-2xl font-bold">
          All Users
        </h1>
        <input
          type="text"
          placeholder="Search by user name"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="border border-gray-300 px-3 py-1 rounded-md text-sm"
        />
        <button
          onClick={() => setShowAddUsersPopup(true)}
          className="group flex items-center gap-2 px-3 py-1 text-sm border text-blue-500 border-blue-500 rounded-md hover:bg-blue-500 hover:text-white font-bold transition"
        >
          <BadgePlus
            size={18}
            strokeWidth={1.4}
            className="text-blue-500 group-hover:text-white"
          />
          Add User
        </button>
      </div>

      {!currentUser?.permissions?.canReadUsers ? (
        <div className="p-6 text-center text-gray-500">
          You do not have permission to view all users.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3">Profile</th>
                <th className="p-3">Full Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr
                  key={user._id}
                  className="border-b border-gray-300 hover:bg-orange-50"
                >
                  <td className="p-2">
                    <Image
                      src={user.profileImage}
                      alt="profile-image"
                      width={1000}
                      height={48}
                      className="w-12 h-12 object-cover rounded-full"
                    />
                  </td>
                  <td className="p-3">
                    {user.fullname}
                    {user._id === currentUser?._id && " (me)"}
                  </td>
                  <td className="p-3">{user.email}</td>
                  <td
                    className={`p-3 font-bold ${roleColors[user.role] || ""}`}
                  >
                    {user.role}
                  </td>
                  <td className="p-3">{user.phone}</td>
                  <td className="py-3 flex items-center gap-2">
                    <Link href={`/addUsers/${user._id}`}>
                      <button className="flex items-center gap-2 text-white px-3 py-1 rounded-md text-sm bg-[#dfb98d] hover:bg-[#D9C6B1]">
                        <File size={15} /> View
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="flex items-center gap-2 px-3 py-1 rounded-md text-sm"
                    >
                      <Trash size={20} color="red" />
                    </button>
                  </td>
                </tr>
              ))}
              {currentUsers.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-4 text-center text-gray-500">
                    No Users found yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-end mt-4 space-x-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, idx) => (
          <button
            key={idx + 1}
            onClick={() => handlePageChange(idx + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === idx + 1
                ? "bg-[#dfb98d] hover:bg-[#D9C6B1] text-white"
                : "bg-gray-100"
            }`}
          >
            {idx + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
      {showAddUsersPopup && (
        <AddUsers
          onClose={() => {
            setShowAddUsersPopup(false);
            setEditingAddUsers(null);
          }}
          editingAddUsers={editingAddUsers}
        />
      )}
    </div>
  );
}
