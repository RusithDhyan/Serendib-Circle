"use client";
import React, { useState } from "react";
import { useData } from "@/app/context/DataContext";
import AddAboutBottom from "../(hotels)/(forms)/AddAboutBottom";

export default function AboutBottom() {
    const [showAboutBottomPopup, setShowAboutBottomPopup] = useState(false);
    const [editingAboutBottom, setEditingAboutBottom] = useState(null);


  const { aboutBottom } = useData();
  console.log("about-bottom",aboutBottom);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this Content?")) return;

    const res = await fetch(`/api/about-bottom/${id}`, { method: "DELETE" });
    const result = await res.json();
  };

  return (
    <div className="px-3">
      <div className="my-2 text-gray-800">
        <div className="mt-5">
          <div className="mt-4 space-y-2 shadow-md py-5 px-4">
           
            {aboutBottom && (
              <div className="flex flex-col items-start gap-4 px-4 mt-5">
                <h1 className="sm:text-lg 2xl:text-xl font-semibold">
                  Title : <span className="font-light text-lg">{aboutBottom.title}</span>
                </h1>
                <h1 className="sm:text-lg 2xl:text-xl font-semibold">
                  Description : <span className="font-light sm:text-sm 2xl:text-lg">{aboutBottom.description}</span>
                </h1>

                <div className="space-x-2 pt-2 flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        setEditingAboutBottom(aboutBottom);
                        setShowAboutBottomPopup(true);
                      }}
                      className="bg-green-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(aboutBottom._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>

              </div>
              )}
            {showAboutBottomPopup && (
              <AddAboutBottom
                onClose={() => {
                  setShowAboutBottomPopup(false);
                  setEditingAboutBottom(null);
                }}
                editingAboutBottom={editingAboutBottom}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
