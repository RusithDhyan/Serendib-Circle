"use client";
import { useCallback, useEffect, useState } from "react";
import AddGallery from "./(forms)/AddGallery";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { fetchGalleryByHotel } from "@/lib/fetchData";

export default function Experience({ hotelId }) {
  const { data: session } = useSession();
  const [showPopup, setShowPopup] = useState(false);
  const [editingGallery, setEditingGallery] = useState(null);

  const [galleries, setGallery] = useState(null);

  const fetchGallery = useCallback(async () => {
    const galleries = await fetchGalleryByHotel(hotelId);
    if (galleries) setGallery(galleries);
  }, [hotelId]);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this Gallery?")) return;

    const res = await fetch(`/api/site-admin/gallery/${id}`, {
      method: "DELETE",
    });
    const result = await res.json();
    if (result.success || result.message === "Gallery deleted") {
      fetchGallery();
    } else {
      alert("Delete failed.");
    }
  };
  console.log("erge", galleries);
  return (
    <div className="mt-4 space-y-4 shadow-md py-10 px-4">
      {galleries?.images?.length === 0 && (
        <p className="text-gray-500 text-center">
          No galleries available for this hotel.
        </p>
      )}

      {!session?.user?.permissions?.canReadGallery ? (
        <div className="p-6 text-center text-gray-500">
          You do not have permission to view hotel galleries.
        </div>
      ) : (
        <div>
          {galleries?.images?.map((gallery) => (
            <div key={gallery._id} className="pb-4">
              <div className="grid grid-cols2 sm:grid-cols-10 2xl:grid-cols-13 items-center gap-5">
                {Array.isArray(gallery.image_slider) &&
                  gallery.image_slider.map((img, idx) => (
                    <Image
                      key={idx}
                      src={img}
                      alt="room"
                      width={1000}
                      height={50}
                      className="sm:w-30 sm:h-30 object-cover rounded-md"
                    />
                  ))}
              </div>
              <div className="space-x-2 flex items-center justify-end gap-2 mt-2">
                {session?.user?.permissions?.canUpdateGallery && (
                  <button
                    onClick={() => {
                      setEditingGallery(gallery);
                      setShowPopup(true);
                    }}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                )}

                {session?.user?.permissions?.canDeleteGallery && (
                  <button
                    onClick={() => handleDelete(gallery._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      {showPopup && (
        <AddGallery
          onClose={() => {
            setShowPopup(false);
            setEditingGallery(null);
          }}
          editingGallery={editingGallery}
          hotelId={hotelId}
        />
      )}
    </div>
  );
}
