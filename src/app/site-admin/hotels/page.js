"use client";
import Image from "next/image";
import { BadgePlus, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import AddHotel from "../(components)/(hotels)/(forms)/AddHotel";
import AddMetaData from "../(components)/(hotels)/(forms)/AddMetaData";
import Breadcrumbs from "../(components)/Breadcrumbs";
import ProtectedRoute from "../(components)/ProtectedRoute";
import { useData } from "@/app/context/DataContext";
import { useSession } from "next-auth/react";

export default function OurCollection() {
  const { data: session } = useSession();
  const { hotels } = useData();
  const [showPopup, setShowPopup] = useState(false);
  const [showMetaPopup, setShowMetaPopup] = useState(false);
  const [editingHotel, setEditingHotel] = useState(null);
  const [editingMetaData, setEditingMetaData] = useState(null);  

const handleDelete = async (id) => {
  if (!confirm("Are you sure you want to delete this Hotel?")) return;

  try {
    const res = await fetch(`/api/site-admin/hotels/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const result = await res.json();

    if (!res.ok) {
      // Show backend error message (403, 401, etc.)
      alert(result.error || "Failed to delete hotel");
      return;
    }

    if (result.success || result.message === "Hotel deleted") {
      alert("Hotel deleted successfully");
      fetchHotel(); // ✅ Refresh the hotel list
    } else {
      alert(result.error || "Delete failed.");
    }
  } catch (error) {
    console.error("Delete error:", error);
    alert("Something went wrong while deleting the hotel.");
  }
};

  return (
    <div className="flex">
     
      <div
        className={`
          flex-1 transition-all duration-300          
        `}
      >
        <Breadcrumbs />
        <div className="flex items-center justify-between px-2 py-2 border-b border-gray-300 mx-4 mt-5">
          <h1 className="sm:text-xl 2xl:text-2xl font-bold">Our Collections</h1>
          <div className="flex items-center gap-4">
            {/* <button
              onClick={() => setShowMetaPopup(true)}
              className="group flex items-center gap-2 px-3 py-1 text-sm border text-green-600 border-green-600 rounded-md hover:bg-green-600 hover:text-white font-bold transition"
            >
              <BadgePlus
                size={18}
                strokeWidth={1.4}
                className="text-green-600 group-hover:text-white"
              />
              Add Meta Data
            </button> */}
            {session?.user?.permissions?.canCreateHotel && (
            <button
              onClick={() => setShowPopup(true)}
              className="group flex items-center gap-2 px-3 py-1 text-sm border text-serendib-primary border-serendib-primary rounded-md hover:bg-serendib-secondary hover:text-white font-bold transition"
            >
              <BadgePlus
                size={18}
                strokeWidth={1.4}
                className="text-serendib-primary group-hover:text-white"
              />
              Add Hotel
            </button>
          )}

          </div>
        </div>
        {!session?.user?.permissions?.canReadHotel ? (
        <div className="p-6 text-center text-gray-500">
          You do not have permission to view all hotels.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 px-6 sm:mt-5 2xl:mt-10 pb-5">
          {hotels.map((hotel) => (
            <div key={hotel._id} className="bg-white rounded-md shadow-sm overflow-y-auto hover:shadow-lg transition duration-300">
              <div className="w-full sm:h-50 2xl:h-60 relative">
                <Link href={`/site-admin/hotels/${hotel._id}`}>
                  <Image
                    src={hotel.thumbnail}
                    alt={hotel.hotel_name}
                    fill
                    className="w-full h-full object-cover"
                  />
                </Link>
              </div>

              {/* Title & Description */}
              <div className="p-4 flex flex-col 2xl:gap-2">
                <h2 className="text-lg font-semibold text-gray-800">
                  {hotel.hotel_name}
                </h2>
                <p className="text-sm text-gray-600">{hotel.title}</p>
                <div className="flex gap-3 mt-2">
                  {session?.user?.permissions?.canUpdateHotel && (
                  <button
                    onClick={() => {
                      setEditingHotel(hotel);
                      setShowPopup(true);
                    }}
                    className="flex items-center gap-1 px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    <Pencil size={16} /> Edit
                  </button>
                  )}

                  {session?.user?.permissions?.canDeleteHotel && (
                  <button
                    onClick={() => handleDelete(hotel._id)}
                    className="group flex items-center gap-1 px-3 py-1 text-sm border border-red text-red-500 rounded-md hover:bg-red-500 hover:text-white font-bold"
                  >
                    <Trash2
                      size={16}
                      className="text-red-500 group-hover:text-white"
                    />
                    Delete
                  </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )} 
        {showPopup && (
          <AddHotel
            onClose={() => {
              setShowPopup(false);
              setEditingHotel(null);
            }}
            editingHotel={editingHotel}
          />
        )}
        {showMetaPopup && (
          <AddMetaData
            onClose={() => {
              setShowMetaPopup(false);
              setEditingMetaData(null);
            }}
            editingMetaData={editingMetaData}
          />
        )}
      </div>
    </div>
  );
}
