"use client";
import { BadgePlus } from "lucide-react";
import Sidebar from "../(components)/Sidebar";
import { useState } from "react";
import Breadcrumbs from "../(components)/Breadcrumbs";
import AboutMiddle from "../(components)/(about)/AboutMiddle";
import AboutTop from "../(components)/(about)/AboutTop";
import AddAboutTop from "../(components)/(hotels)/(forms)/AddAboutTop";
import AddAboutMiddle from "../(components)/(hotels)/(forms)/AddAboutMiddle";
import AboutBottom from "../(components)/(about)/AboutBottom";
import AddAboutBottom from "../(components)/(hotels)/(forms)/AddAboutBottom";
import ProtectedRoute from "../(components)/ProtectedRoute";
import { useData } from "../context/DataContext";

export default function AboutPage() {
  const [showAboutContentPopup, setShowAboutContentPopup] = useState(false);
  const [editingAboutContent, setEditingAboutContent] = useState(null);
  const [showAboutMiddlePopup, setShowAboutMiddlePopup] = useState(false);
  const [editingAboutMiddle, setEditingAboutMiddle] = useState(null);
  const [showAboutBottomPopup, setShowAboutBottomPopup] = useState(false);
  const [editingAboutBottom, setEditingAboutBottom] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const {currentUser} = useData();

  return (
    <ProtectedRoute>
    <div className="flex">
      <div
        className={`
          bg-gray-100 shadow-md min-h-screen transition-all duration-300
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
        <h1 className="sm:text-2xl 2xl:text-4xl font-bold text-center">About Us Page</h1>
        {currentUser?.permissions?.canCreateAboutTop && (
        <div className="flex items-center justify-between px-3 mt-10 border-b sm:w-75 2xl:w-90 mx-3">
          <h1 className="sm:text-xl 2xl:text-2xl font-bold">Add About Content-Top</h1>
          <button
            onClick={() => setShowAboutContentPopup(true)}
            className="text-sm text-blue-500 rounded-md transition"
          >
            <BadgePlus size={25} strokeWidth={1.4} className="text-green-500" />
          </button>
        </div>
        )}
        <AboutTop />

        {currentUser?.permissions?.canCreateAboutMiddle && (
        <div className="flex items-center justify-between px-3 mt-10 border-b sm:w-82 2xl:w-100 mx-3">
          <h1 className="sm:text-xl 2xl:text-2xl font-bold">Add About Content-Middle</h1>
          <button
            onClick={() => setShowAboutMiddlePopup(true)}
            className="text-sm text-blue-500 rounded-md transition"
          >
            <BadgePlus size={25} strokeWidth={1.4} className="text-green-500" />
          </button>
        </div>
        )}

        <AboutMiddle />

        {currentUser?.permissions?.canCreateAboutBottom && (
        <div className="flex items-center justify-between px-3 mt-10 border-b sm:w-85 2xl:w-100 mx-3">
          <h1 className="sm:text-xl 2xl:text-2xl font-bold">Add About Content Bottom</h1>
          <button
            onClick={() => setShowAboutBottomPopup(true)}
            className="text-sm text-blue-500 rounded-md transition"
          >
            <BadgePlus size={25} strokeWidth={1.4} className="text-green-500" />
          </button>
        </div>
        )}

        <AboutBottom/>

        {showAboutContentPopup && (
          <AddAboutTop
            onClose={() => {
              setShowAboutContentPopup(false);
              setEditingAboutContent(null);
            }}
            editingAboutContent={editingAboutContent}
          />
        )}
        {showAboutMiddlePopup && (
          <AddAboutMiddle
            onClose={() => {
              setShowAboutMiddlePopup(false);
              setEditingAboutMiddle(null);
            }}
            editingAboutMiddle={editingAboutMiddle}
          />
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
    </ProtectedRoute>
  );
}
