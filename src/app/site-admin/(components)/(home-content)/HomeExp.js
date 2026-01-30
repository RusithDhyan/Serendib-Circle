"use client";
import { useData } from "@/app/context/DataContext";
import { Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import React from "react";

export default function HomeExp({ onEdit }) {
  const { homeExp, currentUser } = useData();

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this content?")) return;

    const res = await fetch(`/api/site-admin/home-exp/${id}`, {
      method: "DELETE",
    });
    const result = await res.json();
  };

  if (!homeExp) return null;

  return (
    <div className="px-3 mt-4">
      {/* Grid with 3 columns */}
      {/* {!currentUser?.permissions?.canReadHomeExp ? (
        <div className="p-6 text-center text-gray-500">
          You do not have permission to view home-exp content.
        </div>
      ) : ( */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {homeExp?.map((exp, idx) => (
          <div
            key={idx}
            className="bg-white rounded-lg shadow-md sm:p-2 2xl:p-5 space-y-3"
          >
            {/* Title */}
            <h2 className="sm:text-lg 2xl:text-xl font-bold">
              Title :{" "}
              <span className="text-lg text-gray-700">
                {exp.card_title}-
                <span className="text-[#dfb98d]">{exp.type}</span>
              </span>
            </h2>

            {/* Description */}
            <p className="sm:text-lg 2xl:text-xl font-bold">
              Description :{" "}
              <span className="text-sm text-gray-700">
                {exp.card_description}
              </span>
            </p>

            {/* Image */}
            <div className="relative flex flex-col items-start">
              {/* <h2 className="sm:text-lg 2xl:text-xl font-bold">Card Image :</h2> */}
              <Image
                src={exp.card_image}
                alt="Blog"
                width={1000}
                height={50}
                className="w-full h-60 object-cover rounded-md"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-3">
              {currentUser?.permissions?.canUpdateHomeExp && (
                <button
                  onClick={() => onEdit(exp)}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  <Pencil size={16} strokeWidth={1.7} /> Edit
                </button>
              )}
              {currentUser?.permissions?.canDeleteHomeExp && (
                <button
                  onClick={() => handleDelete(exp._id)}
                  className="group flex items-center gap-1 px-3 py-1 text-sm border border-red text-red-500 rounded-md hover:bg-red-500 hover:text-white font-bold"
                >
                  <Trash2
                    size={16}
                    strokeWidth={1.4}
                    className="text-red-500 group-hover:text-white"
                  />
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      {/* )} */}
    </div>
  );
}
