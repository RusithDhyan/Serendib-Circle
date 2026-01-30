"use client";

import { useEffect, useState } from "react";
import {
  Gift,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { format } from "date-fns";
import { generateChecksum } from "@/lib/fetchData";

export default function AdminRedemptions() {
  const [redemptions, setRedemptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  useEffect(() => {
    fetchRedemptions();
  }, [filterType, filterStatus]);

  const fetchRedemptions = async () => {
      const t = Date.now().toString();
      const cs = await generateChecksum(t);

    try {
      const response = await fetch(`/api/redemptions?t=${t}&cs=${cs}`);
      let data = await response.json();

      // Apply filters
      if (filterType) {
        data = data.filter((r) => r.type === filterType);
      }
      if (filterStatus) {
        data = data.filter((r) => r.status === filterStatus);
      }

      setRedemptions(data);
    } catch (error) {
      console.error("Error fetching redemptions:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(redemptions.length / usersPerPage);
  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;
  const currentRedemptions = redemptions.slice(indexOfFirst, indexOfLast);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return CheckCircle;
      case "used":
        return CheckCircle;
      case "expired":
        return XCircle;
      default:
        return Clock;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-50";
      case "used":
        return "text-blue-600 bg-blue-50";
      case "expired":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "dining":
        return "🍽️";
      case "room":
        return "🏨";
      case "experience":
        return "✨";
      default:
        return "🎁";
    }
  };

  const stats = {
    total: redemptions.length,
    active: redemptions.filter((r) => r.status === "active").length,
    used: redemptions.filter((r) => r.status === "used").length,
    expired: redemptions.filter((r) => r.status === "expired").length,
    totalPoints: redemptions.reduce((sum, r) => sum + (r.pointsCost || 0), 0),
    totalValue: redemptions.reduce((sum, r) => sum + (r.dollarValue || 0), 0),
  };
  console.log("edfer", redemptions);
  return (
    <div className="flex-1 ml-64 mt-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Redemption Management
        </h1>
        <p className="text-gray-600">
          Track and manage all voucher redemptions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Redemptions</span>
            <Gift className="text-serendib-primary" size={20} />
          </div>
          <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Active Vouchers</span>
            <CheckCircle className="text-green-600" size={20} />
          </div>
          <div className="text-3xl font-bold text-green-600">
            {stats.active}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Used Vouchers</span>
            <CheckCircle className="text-blue-600" size={20} />
          </div>
          <div className="text-3xl font-bold text-blue-600">{stats.used}</div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Value</span>
            <Gift className="text-purple-600" size={20} />
          </div>
          <div className="text-3xl font-bold text-purple-600">
            ${stats.totalValue.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {stats.totalPoints.toLocaleString()} points
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="relative">
            <Filter
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-serendib-primary focus:border-transparent appearance-none"
            >
              <option value="">All Types</option>
              <option value="dining">Dining</option>
              <option value="room">Room</option>
              <option value="experience">Experience</option>
            </select>
          </div>

          <div className="relative">
            <Filter
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-serendib-primary focus:border-transparent appearance-none"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="used">Used</option>
              <option value="expired">Expired</option>
            </select>
          </div>

          <button
            onClick={() => {
              setFilterType("");
              setFilterStatus("");
            }}
            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Redemptions Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-serendib-primary"></div>
          </div>
        ) : redemptions.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Gift size={48} className="mx-auto mb-4 opacity-50" />
            <p>No redemptions found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">
                    Date
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">
                    Type
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">
                    Voucher Code
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">
                    Value
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">
                    Points
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">
                    Expires
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentRedemptions.map((redemption) => {
                  const StatusIcon = getStatusIcon(redemption.status);
                  const statusColor = getStatusColor(redemption.status);
                  const typeIcon = getTypeIcon(redemption.type);
                  const isExpired = new Date(redemption.expiresAt) < new Date();

                  return (
                    <tr
                      key={redemption._id}
                      className="border-t hover:bg-gray-50"
                    >
                      <td className="py-4 px-6">
                        <div className="text-sm font-semibold text-gray-900">
                          {format(
                            new Date(redemption.createdAt),
                            "MMM dd, yyyy"
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          {format(new Date(redemption.createdAt), "h:mm a")}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{typeIcon}</span>
                          <span className="text-sm font-semibold capitalize">
                            {redemption.type}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-mono text-sm font-bold text-serendib-primary">
                          {redemption.voucherCode}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm font-bold text-gray-900">
                          ${redemption.dollarValue?.toFixed(2) || "0.00"}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm font-semibold text-red-600">
                          -{redemption.pointsCost?.toLocaleString() || 0}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${statusColor}`}
                        >
                          <StatusIcon size={16} />
                          <span className="text-sm font-semibold capitalize">
                            {redemption.status}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div
                          className={`text-sm ${
                            isExpired
                              ? "text-red-600 font-semibold"
                              : "text-gray-600"
                          }`}
                        >
                          {format(
                            new Date(redemption.expiresAt),
                            "MMM dd, yyyy"
                          )}
                        </div>
                        {isExpired && (
                          <div className="text-xs text-red-500 mt-1">
                            Expired
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <div className="flex-1 justify-end m-4 space-x-2">
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
            </table>
          </div>
        )}
      </div>

      {/* Redemption Breakdown */}
      {redemptions.length > 0 && (
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">By Type</h3>
            <div className="space-y-3">
              {["dining", "room", "experience"].map((type) => {
                const count = redemptions.filter((r) => r.type === type).length;
                const value = redemptions
                  .filter((r) => r.type === type)
                  .reduce((sum, r) => sum + r.dollarValue, 0);
                return (
                  <div
                    key={type}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{getTypeIcon(type)}</span>
                      <span className="font-semibold capitalize">{type}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">{count}</div>
                      <div className="text-xs text-gray-600">
                        ${value.toFixed(2)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">By Status</h3>
            <div className="space-y-3">
              {['active', 'used', 'expired'].map(status => {
                const count = redemptions.filter(r => r.status === status).length;
                const percentage = ((count / stats.total) * 100).toFixed(1);
                return (
                  <div key={status} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold capitalize">{status}</span>
                      <span className="text-2xl font-bold text-serendib-primary">{count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-serendib-primary h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-600 mt-1">{percentage}% of total</div>
                  </div>
                );
              })}
            </div>
          </div> */}

          <div className="bg-gradient-to-br from-serendib-primary to-serendib-secondary text-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-bold mb-4">Summary</h3>
            <div className="space-y-4">
              <div>
                <div className="text-sm opacity-90 mb-1">
                  Total Points Redeemed
                </div>
                <div className="text-3xl font-bold">
                  {stats.totalPoints.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-sm opacity-90 mb-1">
                  Total Dollar Value
                </div>
                <div className="text-3xl font-bold">
                  ${stats.totalValue.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-sm opacity-90 mb-1">
                  Average Redemption
                </div>
                <div className="text-2xl font-bold">
                  ${(stats.totalValue / stats.total || 0).toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
