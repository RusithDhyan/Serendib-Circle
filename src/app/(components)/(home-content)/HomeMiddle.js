"use client";
import { useData } from "@/app/context/DataContext";
import { Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import React from "react";

export default function HomeMiddle({ onEdit }) {
  const { homeMiddle, currentUser } = useData();
  console.log("home-Middle", homeMiddle);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this content?")) return;

    const res = await fetch(`/api/home-Middle/${id}`, { method: "DELETE" });
    const result = await res.json();
    // Optionally, refresh data here
  };

  if (!homeMiddle) return null;

  return (
    <div className="px-3 mt-4">

      {/* {!currentUser?.permissions?.canReadHomeExp ? (
        <div className="p-6 text-center text-gray-500">
          You do not have permission to view home-middle content.
        </div>
      ) : ( */}
      <div className="flex flex-col md:flex-row gap-6 bg-white rounded-lg shadow-md pt-5">
        {/* Left Side: Text Info */}
        <div className="md:w-1/2 space-y-2 p-4">
          <h2 className="sm:text-lg 2xl:text-xl font-bold">
            Map Title : <span className="text-lg text-gray-700">{homeMiddle.map_title}</span>
          </h2>
          <p className="sm:text-lg 2xl:text-xl font-bold">
            Map Description : <span className="text-sm text-gray-700">{homeMiddle.map_description}</span>
          </p>
          <div className="flex gap-3 mt-5">
            {currentUser?.permissions?.canUpdateHomeMiddle && (
            <button
              onClick={() => onEdit(homeMiddle)}
              className="flex items-center gap-1 px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              <Pencil size={16} strokeWidth={1.7} /> Edit
            </button>
            )}
            {currentUser?.permissions?.canDeleteHomeMiddle && (
            <button
              onClick={() => handleDelete(homeMiddle._id)}
              className="group flex items-center gap-1 px-3 py-1 text-sm border border-red text-red-500 rounded-md hover:bg-red-500 hover:text-white font-bold"
            >
              <Trash2 size={16} strokeWidth={1.4} className="text-red-500 group-hover:text-white" />
              Delete
            </button>
            )}
          </div>
        </div>

        {/* Right Side: Blog Image */}
        <div className="relative w-1/2">
          <Image
            src={homeMiddle.blog_image}
            alt="Blog"
            width={1000}
            height={50}
            className="w-full sm:h-auto 2xl:h-80 object-cover rounded-r-md"
          />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white opacity-0 group-hover:opacity-100 transition-all duration-700">
            <h1 className="text-lg sm:text-2xl font-bold">Blog Image</h1>
          </div>
        </div>
      </div>
      {/* )} */}
    </div>
  );
}
