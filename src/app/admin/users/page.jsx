"use client";

import { useEffect, useState } from "react";
import { Search, Filter, UserPlus, Eye } from "lucide-react";
import Link from "next/link";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTier, setFilterTier] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  useEffect(() => {
    fetchUsers();
  }, [searchTerm, filterTier]);

  const fetchUsers = async () => {
    try {
      let url = "/api/admin/users?";
      if (searchTerm) url += `search=${searchTerm}&`;
      if (filterTier) url += `tier=${filterTier}`;

      const response = await fetch(url);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(users.length / usersPerPage);
  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;
  const currentUsers = users.slice(indexOfFirst, indexOfLast);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const getTierColor = (tier) => {
    switch (tier) {
      case "The Circle":
        return "bg-yellow-100 text-yellow-800";
      case "Voyager":
        return "bg-blue-100 text-blue-800";
      case "Adventurer":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex-1 ml-64 mt-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          User Management
        </h1>
        <p className="text-gray-600">
          View and manage all loyalty program members
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-serendib-primary focus:border-transparent"
            />
          </div>

          <div className="relative">
            <Filter
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <select
              value={filterTier}
              onChange={(e) => setFilterTier(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-serendib-primary focus:border-transparent appearance-none"
            >
              <option value="">All Tiers</option>
              <option value="Explorer">Explorer</option>
              <option value="Adventurer">Adventurer</option>
              <option value="Voyager">Voyager</option>
              <option value="The Circle">The Circle</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-serendib-primary"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">
                    User
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">
                    Tier
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">
                    Points
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">
                    Spend
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">
                    Stays
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">
                    Joined
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <tr key={user._id} className="border-t hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div>
                        <div className="font-semibold text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {user.email}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${getTierColor(
                          user.tier
                        )}`}
                      >
                        {user.tier}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-semibold text-serendib-primary">
                      {user.points.toLocaleString()}
                    </td>
                    <td className="py-4 px-6">
                      ${user.totalSpend.toLocaleString()}
                    </td>
                    <td className="py-4 px-6">{user.totalStays}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                      <Link
                        href={`/admin/users/${user._id}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-serendib-primary text-white rounded-lg hover:bg-serendib-secondary transition-colors"
                      >
                        <Eye size={16} />
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {users.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No users found
              </div>
            )}
          </div>
        )}
        <div className="flex justify-end m-4 space-x-2">
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
                  ? "bg-serendib-secondary hover:bg-serendib-primary text-white"
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
      </div>
    </div>
  );
}
