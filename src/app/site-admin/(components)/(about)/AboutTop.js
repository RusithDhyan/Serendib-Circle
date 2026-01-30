"use client";
import { useData } from "@/app/context/DataContext";
import { Pencil, Trash2 } from "lucide-react";
import React, { useState } from "react";
import AddAboutContent from "../(hotels)/(forms)/AddAboutTop";
import Image from "next/image";

export default function AboutTop() {
  const { aboutContent } = useData();
  const [showAboutContentPopup, setShowAboutContentPopup] = useState(false);
  const [editingAboutContent, setEditingAboutContent] = useState(null);
  // console.log("about-content",aboutContent);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this content?")) return;

    const res = await fetch(`/api/site-admin/about-top/${id}`, {
      method: "DELETE",
    });
    const result = await res.json();
  };

  return (
    <div className="px-3">
      {aboutContent && (
        <div className="flex flex-col md:flex-row gap-6 bg-white  rounded-lg shadow-md pt-5">
          {/* Left Side: Text Info */}
          <div className="md:w-1/2 space-y-2 p-4">
            <h2 className="sm:text-lg 2xl:text-xl font-bold">
              Title :{" "}
              <span className="text-lg text-gray-700">
                {aboutContent.title}
              </span>
            </h2>
            <p className="sm:text-lg 2xl:text-xl font-bold">
              Description :{" "}
              <span className="text-sm text-gray-700">
                {aboutContent.description}
              </span>
            </p>
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => {
                  setEditingAboutContent(aboutContent);
                  setShowAboutContentPopup(true);
                }}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                <Pencil size={16} strokeWidth={1.7} /> Edit
              </button>

              <button
                onClick={() => handleDelete(aboutContent._id)}
                className="group flex items-center gap-1 px-3 py-1 text-sm border border-red text-red-500 rounded-md hover:bg-red-500 hover:text-white font-bold"
              >
                <Trash2
                  size={16}
                  strokeWidth={1.4}
                  className="text-red-500 group-hover:text-white"
                />
                Delete
              </button>
            </div>
          </div>

          {/* Right Side: 3 Images in a row */}
          <div className="flex justify-between w-1/2">
            <div className="relative group md:w-1/2">
              <Image
                src={aboutContent.content_image}
                alt="Room 1"
                width={1000}
                height={50}
                className="w-auto h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white opacity-0 group-hover:opacity-100 transition-all duration-700">
                <h1 className="text-lg sm:text-2xl font-bold mb-4">
                  Content Image
                </h1>
              </div>
            </div>
            <div className="relative group md:w-1/2">
              <Image
                src={aboutContent.bg_image}
                alt="Room 2"
                width={1000}
                height={50}
                className="w-auto h-full object-cover rounded-r"
              />
              <div className="absolute inset-0 bg-black/40 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white opacity-0 group-hover:opacity-100 transition-all duration-700">
                <h1 className="text-lg sm:text-2xl font-bold mb-4">
                  Background Image
                </h1>
              </div>
            </div>
          </div>
        </div>
      )}
      {showAboutContentPopup && (
        <AddAboutContent
          onClose={() => {
            setShowAboutContentPopup(false);
            setEditingAboutContent(null);
          }}
          editingAboutContent={editingAboutContent}
        />
      )}
    </div>
  );
}
