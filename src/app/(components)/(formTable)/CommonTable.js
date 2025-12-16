"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

export default function CommonTable({ data, columns, searchField = "name" }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter data
  const filteredData = data.filter((item) =>
    item[searchField]?.toLowerCase().includes(search.toLowerCase())
  );
  const count = filteredData.length;

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirst, indexOfLast);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [search, data]);

  // ✅ Generate Report (no context, sends all data)
  const handleGenerateReport = () => {
    const encoded = encodeURIComponent(JSON.stringify(filteredData));
    router.push(`/hotel-report?data=${encoded._id}`);
  };

  return (
    <div className="bg-white rounded shadow p-4">
      {/* Search Bar */}
      <div className="mb-4 flex items-center justify-end gap-3">
        <input
          type="text"
          placeholder={`Search by ${searchField}`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 px-3 py-1 rounded-md text-sm"
        />
        <div className="border rounded-md shadow-lg py-1 px-2">
          <h2 className="font-semibold">Count : {count}</h2>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className="px-4 py-2 font-bold text-center text-gray-700"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentItems.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-4 text-gray-500"
                >
                  No results found.
                </td>
              </tr>
            ) : (
              currentItems.map((item, idx) => (
                <tr key={idx} className="border-t hover:bg-orange-50">
                  {columns.map((col, cIdx) => (
                    <td key={cIdx} className="px-4 py-2 text-center">
                      {col.render ? col.render(item) : item[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination & Buttons */}
      <div className="flex flex-row items-center justify-between mt-5">
        <div>
          <button
            onClick={() => router.back()}
            className="border rounded-md py-1 px-4 mr-2 hover:bg-gray-200 duration-300 shadow-md text-gray-400"
          >
            Back
          </button>

          <button
            className="mt-4 px-4 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={handleGenerateReport}
          >
            Generate Report
          </button>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 rounded-md disabled:opacity-50"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`px-3 py-1 rounded-md ${
                currentPage === i + 1
                  ? "bg-[#dfb98d] hover:bg-[#D9C6B1] text-white"
                  : "bg-gray-100"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
