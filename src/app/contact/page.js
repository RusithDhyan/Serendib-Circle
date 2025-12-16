"use client";
import { BadgePlus } from "lucide-react";
import Sidebar from "../(components)/Sidebar";
import { useState } from "react";
import Breadcrumbs from "../(components)/Breadcrumbs";
import AddContactContent from "../(components)/(hotels)/(forms)/AddContactContent";
import ContactContent from "../(components)/(contact)/ContactContent";
import ProtectedRoute from "../(components)/ProtectedRoute";
import { useData } from "../context/DataContext";

export default function ContactPage() {
  const {currentUser} = useData();
  const [showContactContentPopup, setShowContactContentPopup] = useState(false);
  const [editingContactContent, setEditingContactContent] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <ProtectedRoute>
    <div className="flex">
      <div
        className={`
          bg-gray-100 shadow-md transition-all duration-300
          ${isHovered ? "sm:w-50 2xl:w-64" : "w-20"}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Sidebar isHovered={isHovered} />
      </div>
      <div
        className={`
          flex-1 transition-all duration-300
          ${isHovered ? "ml-1" : "ml-1"}
          
        `}
      >
        <Breadcrumbs />
        <h1 className="sm:text-2xl 2xl:text-4xl font-bold text-center">Contact Page</h1>
        {currentUser?.permissions?.canCreateContactContent && (
        <div className="flex items-center justify-between px-3 mt-10 border-b sm:w-70 2xl:w-80 mx-3">
          <h1 className="sm:text-xl 2xl:text-2xl font-bold">Add Contact Content</h1>
          <button
            onClick={() => setShowContactContentPopup(true)}
            className="text-sm text-blue-500 rounded-md transition"
          >
            <BadgePlus size={25} strokeWidth={1.4} className="text-green-500" />
          </button>
        </div>
        )}

          <ContactContent/>

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
    </div>
    </ProtectedRoute>
  );
}
