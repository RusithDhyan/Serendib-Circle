"use client";
import { useData } from "@/app/context/DataContext";
import { Pencil, Trash2 } from "lucide-react";
import React, { useState } from "react";
import AddContactContent from "../(hotels)/(forms)/AddContactContent";
import Image from "next/image";
import { useSession } from "next-auth/react";

export default function ContactContent() {
  const { data: session } = useSession();
  const { contactContent } = useData();
  const [showContactContentPopup, setShowContactContentPopup] = useState(false);
  const [editingContactContent, setEditingContactContent] = useState(null);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this content?")) return;

    const res = await fetch(`/api/contact/${id}`, { method: "DELETE" });
    const result = await res.json();
  };

  return (
    <div className="px-3">
      {!session?.user?.permissions?.canReadContactContent ? (
        <div className="p-6 text-center text-gray-500">
          You do not have permission to view contact content.
        </div>
      ) : (
        <div>
      {contactContent && (
        <div className="flex flex-col md:flex-row gap-6 bg-white  rounded-lg shadow-md pt-5">
          {/* Left Side: Text Info */}
          <div className="md:w-1/2 space-y-2 p-4">
            <h2 className="sm:text-lg 2xl:text-xl font-bold">
              Title : <span className="text-sm text-gray-700">{contactContent.title}</span>
            </h2>
            <h2 className="sm:text-xl 2xl:text-xl font-bold">
              Description : <span className="text-sm text-gray-700">{contactContent.description}</span>
            </h2>
            <p className="sm:text-xl 2xl:text-xl font-bold">Email : <span className="text-sm text-gray-700">{contactContent.email}</span></p>
            <p className="sm:text-xl 2xl:text-xl font-bold"> Phone : <span className="text-sm text-gray-700">{contactContent.phone}</span></p>
            
            <Image
              src={contactContent.bg_image}
              alt={contactContent.title}
              width={1000}
              height={20}
              className="w-50 rounded-md"
            />

            <div className="flex gap-3 mt-5">
              {session?.user?.permissions?.canUpdateContactContent && (
              <button
                onClick={() => {
                  setEditingContactContent(contactContent);
                  setShowContactContentPopup(true);
                }}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                <Pencil size={16} strokeWidth={1.7} /> Edit
              </button>
              )}
              {session?.user?.permissions?.canDeleteContactContent && (
              <button
                onClick={() => handleDelete(contactContent._id)}
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
        </div>
      )}
      </div>
      )}
      {showContactContentPopup && (
        <AddContactContent
          onClose={() => {
            setShowContactContentPopup(false);
            setEditingContactContent(null);
          }}
          editingContactContent={editingContactContent}
        />
      )}
    </div>
  );
}
