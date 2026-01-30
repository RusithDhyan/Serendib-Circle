"use client";
import { useData } from "@/app/context/DataContext";
import { BadgePlus, Eye, Filter, Search } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import AddUsers from "../(hotels)/(forms)/AddUsers";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function AddAnyUsers() {
  const { data: session } = useSession();
  const [filterUsers, setFilterUsers] = useState([]);
  const [showAddUsersPopup, setShowAddUsersPopup] = useState(false);
  const [editingAddUsers, setEditingAddUsers] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTier, setFilterTier] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [searchTerm, filterTier]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      let url = "/api/admin/users?";
      if (searchTerm) url += `search=${searchTerm}&`;
      if (filterTier) url += `role=${filterTier}`;

      const response = await fetch(url);
      const data = await response.json();
      // console.log("Fetched users:", data);
      setFilterUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const usersPerPage = 10;

  const roleLevels = {
    owner: 5,
    admin: 4,
    manager: 3,
    supervisor: 2,
    moderator: 1,
    guest: 0,
  };

  // Filter users based on role hierarchy (only show users below current user's role)
  const filteredUsers = filterUsers.filter(
    (user) =>
      session?.user?.role &&
      roleLevels[user.role] < roleLevels[session.user.role]
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
    guest: "text-black",
    owner: "text-purple-600",
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const result = await res.json();

      if (res.ok && result.success) {
        alert(result.message || "User deleted successfully");
        fetchUsers(); // Refresh the list
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

  const roles = [
    { label: "Owner", value: "owner" },
    { label: "Admin", value: "admin" },
    { label: "Manager", value: "manager" },
    { label: "Supervisor", value: "supervisor" },
    { label: "Moderator", value: "moderator" },
    { label: "Guest", value: "guest" },
  ];

  const ROLE_LEVEL = {
    owner: 5,
    admin: 4,
    manager: 3,
    supervisor: 2,
    moderator: 1,
    guest: 0,
  };

  const allowedRoles = useMemo(() => {
    if (!session || !session.user.role) return roles;

    const currentLevel = ROLE_LEVEL[session.user.role.toLowerCase()];
    const editableRole = editingAddUsers?.role?.toLowerCase() || "";

    return roles.filter(
      (r) => ROLE_LEVEL[r.value] < currentLevel || r.value === editableRole
    );
  }, [session, editingAddUsers]);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md mt-5">
      <div className="flex justify-between items-center mb-4">
        <h1 className="pr-6 mt-2 sm:text-xl 2xl:text-2xl font-bold">
          All Users
        </h1>
        <div className="flex gap-2">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2 w-full  p-1 border border-gray-300 rounded-lg">
              <Search className="text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset to first page on search
                }}
              />
            </div>

            <div className="flex items-center gap-2 justify-around px-1 w-full border border-gray-300 rounded-lg">
              <Filter className="text-gray-400" size={20} />
              <select
                value={filterTier}
                onChange={(e) => {
                  setFilterTier(e.target.value);
                  setCurrentPage(1); // Reset to first page on filter
                }}
                className="w-full py-1 rounded-lg focus:ring-serendib-primary focus:border-transparent appearance-none"
              >
                <option value="">All Roles</option>
                {allowedRoles.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            onClick={() => setShowAddUsersPopup(true)}
            className="group flex items-center gap-2 px-3 py-1 text-sm border text-serendib-primary border-serendib-primary rounded-md hover:bg-serendib-secondary hover:text-white font-bold transition"
          >
            <BadgePlus
              size={18}
              strokeWidth={1.4}
              className="text-serendib-primary group-hover:text-white"
            />
            Add User
          </button>
        </div>
      </div>

      {!session?.user?.permissions?.canReadUsers ? (
        <div className="p-6 text-center text-gray-500">
          You do not have permission to view all users.
        </div>
      ) : (
        <>
          {isLoading ? (
            <div className="p-6 text-center text-gray-500">
              Loading users...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto text-sm">
                <thead>
                  <tr className="bg-gray-100 text-center">
                    <th className="p-3">Profile</th>
                    <th className="p-3">Full Name</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Phone</th>
                    <th className="p-3">Join Date</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="p-4 text-center text-gray-500">
                        {searchTerm || filterTier
                          ? "No users found matching your filters."
                          : "No Users found yet."}
                      </td>
                    </tr>
                  ) : (
                    currentUsers.map((user) => (
                      <tr key={user._id} className="border-t hover:bg-gray-50">
                        <td className="px-2">
                          <div className="flex justify-center items-center">
                            {user.image && (
                              <Image
                                src={user.image}
                                alt={user.name}
                                width={52}
                                height={52}
                                className="w-13 h-13 rounded-full object-cover"
                              />
                            )}
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="font-semibold text-gray-600 text-center">
                            {user.name}
                          </div>
                        </td>
                        <td>
                          <div className="text-sm text-gray-600 text-center">
                            {user.email}
                          </div>
                        </td>
                        <td
                          className={`p-3 font-bold text-center capitalize ${
                            roleColors[user.role] || ""
                          }`}
                        >
                          {user.role}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className="px-3 py-1 rounded-full text-sm text-gray-600">
                            {user.phone || "_"}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-600 text-center">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <Link
                            href={`/site-admin/addUsers/${user._id}`}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-serendib-secondary text-white rounded-lg hover:bg-serendib-primary transition-colors"
                          >
                            <Eye size={16} />
                            View
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-end mt-4 space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, idx) => (
            <button
              key={idx + 1}
              onClick={() => handlePageChange(idx + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === idx + 1
                  ? "bg-serendib-secondary hover:bg-serendib-primary text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {idx + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
          >
            Next
          </button>
        </div>
      )}

      {showAddUsersPopup && (
        <AddUsers
          onClose={() => {
            setShowAddUsersPopup(false);
            setEditingAddUsers(null);
            fetchUsers(); // Refresh list after adding user
          }}
          editingAddUsers={editingAddUsers}
        />
      )}
    </div>
  );
}
