"use client";
import { useCallback, useEffect, useState } from "react";
import AddAccommodation from "./(forms)/AddAccommodation";
import Image from "next/image";
import { fetchAccommodationByHotel } from "@/lib/fetchData";
import { useSession } from "next-auth/react";

export default function Accommodation({ hotelId }) {
  const { data: session } = useSession();

  const [showPopup, setShowPopup] = useState(false);
  const [editingAccommodation, setEditingAccommodation] = useState(null);
  const [accommodations, setAccommodations] = useState([]);

  const fetchAccommodation = useCallback(async () => {
    const accommodations = await fetchAccommodationByHotel(hotelId);
    if (accommodations) setAccommodations(accommodations);
  }, [hotelId]);

  useEffect(() => {
    fetchAccommodation();
  }, [fetchAccommodation]);

  const handleDelete = async (id) => {

    if (!confirm("Are you sure you want to delete this Accommodation?")) return;

    const res = await fetch(`/api/site-admin/accommodation/${id}`, { method: "DELETE" });
    const result = await res.json();
    if (result.success || result.message === "Accommodation deleted") {
      fetchAccommodation();
    } else {
      alert("Delete failed.");
    }
  };

  return (
    <div className="mt-4 space-y-4 shadow-md py-10 px-4">
      {accommodations.length === 0 && (
        <p className="text-gray-500 text-center">
          No accommodations available for this hotel.
        </p>
      )}
      {!session?.user?.permissions?.canReadAccommodation ? (
        <div className="p-6 text-center text-gray-500">
          You do not have permission to view hotel accommodations.
        </div>
      ) : (
        <div>
          {accommodations.map((accommodation) => (
            <div
              key={accommodation._id}
              className="border-b border-gray-300 last:border-none pb-4 flex items-start gap-4"
            >
              <div>
                <h1 className="font-semibold text-gray-500">Room Image</h1>
                {accommodation.image && (
                  <Image
                    src={accommodation.image}
                    alt={accommodation.room_type}
                    width={1000}
                    height={50}
                    className="w-full sm:h-20 2xl:h-32 object-cover rounded-md"
                  />
                )}
              </div>
              <div>
                <h1 className="font-semibold text-gray-500">Slider Images</h1>
                <div className="grid grid-cols-5 gap-2">
                  {Array.isArray(accommodation.images) &&
                    accommodation.images.map((img, idx) => (
                      <Image
                        key={idx}
                        src={img}
                        alt="room"
                        width={1000}
                        height={50}
                        className="sm:w-20 sm:h-10 2xl:w-30 2xl:h-15 object-cover rounded-md"
                      />
                    ))}
                </div>
              </div>

              <div className="flex-1 mt-8">
                <p className="font-bold">{accommodation.room_type}</p>
                <div>
                  <h2 className="sm:text-sm 2xl:text-lg">
                    {accommodation.description}
                  </h2>
                </div>

                <div className="space-x-2 pt-8 flex items-center justify-end gap-2">
                  {session?.user?.permissions?.canUpdateAccommodation && (
                    <button
                      onClick={() => {
                        setEditingAccommodation(accommodation);
                        setShowPopup(true);
                      }}
                      className="bg-green-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                  )}
                  {session?.user?.permissions?.canDeleteAccommodation && (
                    <button
                      onClick={() => handleDelete(accommodation._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
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
        <AddAccommodation
          onClose={() => {
            setShowPopup(false);
            setEditingAccommodation(null);
          }}
          editingAccommodation={editingAccommodation}
          hotelId={hotelId}
        />
      )}
    </div>
  );
}
