"use client";
import { useCallback, useEffect, useState } from "react";
import AddPageExperience from "./(forms)/AddPageExperience";
import Image from "next/image";
import { useData } from "@/app/context/DataContext";

export default function Experience({ hotelId }) {
  const {currentUser} = useData();
  const [showPopup, setShowPopup] = useState(false);
  const [editingExperience, setEditingExperience] = useState(null);

  const [experiences, setExperiences] = useState([]);

  const fetchExperience =useCallback(async () => {
    const res = await fetch(`/api/page-exp?hotelId=${hotelId}`);
    const data = await res.json();
    if (data.success) setExperiences(data.data);
  },[hotelId])

  useEffect(() => {
    fetchExperience();
  }, [fetchExperience]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this Experience?")) return;

    const res = await fetch(`/api/page-exp/${id}`, { method: "DELETE" });
    const result = await res.json();
    if (result.success || result.message === "Experience deleted") {
      fetchExperience();
    } else {
      alert("Delete failed.");
    }
  };

  return (
    <div className="mt-4 space-y-4 shadow-md py-10 px-4">
      {experiences.length === 0 && (
        <p className="text-gray-500 text-center">
          No page-experiences available for this hotel.
        </p>
      )}
      {!currentUser?.permissions?.canReadPageExp ? (
        <div className="p-6 text-center text-gray-500">
          You do not have permission to view hotel page-experiences.
        </div>
      ) : (
        <div>
      {experiences.map((experience) => (
        <div
          key={experience._id}
          className="pb-4"
        >
          <div className="flex items-start gap-5">
            <div>
              <h1 className="text-gray-500 font-bold">Left-Side Content</h1>

              <Image
                src={experience.image_left}
                alt="image-right"
                width={1000}
                height={50}
                className="w-full h-50 object-cover rounded-md mt-2"
              />
              <p className="text-sm mt-2">{experience.description_left}</p>
            </div>
            <div>
              <h1 className="text-gray-500 font-bold">Right-Side Content</h1>
              <Image
                src={experience.image_right}
                alt="image-right"
                width={1000}
                height={50}
                className="w-full h-50 object-cover rounded-md mt-2"
              />
              <p className="text-sm mt-2">{experience.description_right}</p>
            </div>
          </div>
          <div className="space-x-2 mt-2 flex items-center justify-end gap-2">
            {currentUser?.permissions?.canUpdatePageExp && (
            <button
              onClick={() => {
                setEditingExperience(experience);
                setShowPopup(true);
              }}
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              Edit
            </button>
            )}
            {currentUser?.permissions?.canDeletePageExp && (
            <button
              onClick={() => handleDelete(experience._id)}
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
        <AddPageExperience
          onClose={() => {
            setShowPopup(false);
            setEditingExperience(null);
          }}
          editingExperience={editingExperience}
          hotelId={hotelId}
        />
      )}
    </div>
  );
}
