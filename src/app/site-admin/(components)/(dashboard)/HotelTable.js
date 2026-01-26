"use client";
import { useData } from "@/app/context/DataContext";
import { File } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function HotelTable() {
  const { hotels } = useData();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const hotelsPerPage = 4;
  const filteredHotels = hotels.filter((hotel) =>
  hotel.hotel_name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredHotels.length / hotelsPerPage);
  const indexOfLast = currentPage * hotelsPerPage;
  const indexOfFirst = indexOfLast - hotelsPerPage;
  const currentHotels = filteredHotels.slice(indexOfFirst, indexOfLast);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h1 className="pr-6 mt-2 sm:text-xl 2xl:text-2xl font-bold">All Serendib Hotels</h1>
        <input
          type="text"
          placeholder="Search by hotel name"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="border border-gray-300 px-3 py-1 rounded-md text-sm"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">Thumbnail</th>
              <th className="p-3">Name</th>
              <th className="p-3">Location</th>
              <th className="p-3">Title</th>
              <th className="p-3">Description</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentHotels.map((hotel) => (
              <tr
                key={hotel._id}
                className="border-b border-gray-300 hover:bg-gray-100"
              >
                <td className="p-2">
                  <Image
                    src={hotel.thumbnail}
                    alt={hotel.hotel_name}
                    width={1000}
                    height={48}
                    className="w-12 h-12 object-cover rounded-full"
                  />
                </td>
                <td className="p-3">{hotel.hotel_name}</td>
                <td className="p-3">{hotel.location}</td>
                <td className="p-3">
                  <div className="w-60 truncate" title={hotel.title}>
                    {hotel.title}
                  </div>
                </td>
                <td className="p-3">
                  <div
                    className="w-120 truncate"
                    description={hotel.description}
                  >
                    {hotel.description}
                  </div>
                </td>
                <td className="p-3">
                  <Link href={`/hotels/${hotel._id}`}>
                    <button className="flex items-center gap-2 text-white px-3 py-1 rounded-md text-sm bg-serendib-secondary">
                      <File size={15} /> View
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
            {currentHotels.length === 0 && (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  No hotels found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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
                ? "bg-serendib-secondary text-white"
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
  );
}
