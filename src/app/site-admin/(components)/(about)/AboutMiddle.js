"use client";
import React, { useEffect, useState } from "react";
import AddAboutMiddle from "../(hotels)/(forms)/AddAboutMiddle";
import { useData } from "@/app/context/DataContext";
import Image from "next/image";

export default function AboutMiddle() {
  const [showAboutMiddlePopup, setShowAboutMiddlePopup] = useState(false);
  const [editingAboutMiddle, setEditingAboutMiddle] = useState(null);

  const { aboutMiddle } = useData();
  const { aboutContent } = useData();

  console.log("middle-about", aboutMiddle);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this Content?")) return;

    const res = await fetch(`/api/site-admin/about-middle/${id}`, {
      method: "DELETE",
    });
    const result = await res.json();
  };

  return (
    <div className="px-3">
      <div className="my-2 text-gray-800">
        <div className="mt-5">
          <div className="mt-4 space-y-2 shadow-md py-5 px-4">
            {aboutMiddle.length === 0 && (
              <p className="text-gray-500 text-center">
                No Visions available for this hotel.
              </p>
            )}
            {aboutContent && (
              <h1 className="sm:text-lg 2xl:text-xl font-bold text-blue-700">
                Vision-Title : {aboutContent.vision_title}
              </h1>
            )}
            {aboutMiddle?.map((choose) => (
              <div
                key={choose._id}
                className="border-b last:border-none border-gray-300 pb-4 flex gap-4 mt-10"
              >
                <div className="flex items-start">
                  {choose.card_image && (
                    <Image
                      src={choose.card_image}
                      alt={choose.title}
                      width={1000}
                      height={50}
                      className="w-15 h-15 object-cover rounded-full"
                    />
                  )}
                </div>

                <div className="flex-1">
                  <p className="font-bold sm:text-lg 2xl:text-xl">
                    {choose.card_title}
                  </p>
                  <h2 className="sm:text-sm 2xl:text-lg">
                    {choose.card_description}
                  </h2>

                  <div className="space-x-2 pt-2 flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        setEditingAboutMiddle(choose);
                        setShowAboutMiddlePopup(true);
                      }}
                      className="bg-green-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(choose._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {showAboutMiddlePopup && (
              <AddAboutMiddle
                onClose={() => {
                  setShowAboutMiddlePopup(false);
                  setEditingAboutMiddle(null);
                }}
                editingAboutMiddle={editingAboutMiddle}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
