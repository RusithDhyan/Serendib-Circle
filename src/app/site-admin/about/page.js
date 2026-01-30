"use client";
import { useData } from "@/app/context/DataContext";
import { BadgePlus } from "lucide-react";
import { useState } from "react";
import Breadcrumbs from "../(components)/Breadcrumbs";
import AboutTop from "../(components)/(about)/AboutTop";
import AboutMiddle from "../(components)/(about)/AboutMiddle";
import AboutBottom from "../(components)/(about)/AboutBottom";
import AddAboutTop from "../(components)/(hotels)/(forms)/AddAboutTop";
import AddAboutMiddle from "../(components)/(hotels)/(forms)/AddAboutMiddle";
import AddAboutBottom from "../(components)/(hotels)/(forms)/AddAboutBottom";
import { useSession } from "next-auth/react";

export default function AboutPage() {
  const [showAboutContentPopup, setShowAboutContentPopup] = useState(false);
  const [editingAboutContent, setEditingAboutContent] = useState(null);
  const [showAboutMiddlePopup, setShowAboutMiddlePopup] = useState(false);
  const [editingAboutMiddle, setEditingAboutMiddle] = useState(null);
  const [showAboutBottomPopup, setShowAboutBottomPopup] = useState(false);
  const [editingAboutBottom, setEditingAboutBottom] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const { data: session } = useSession();

  return (
    <div className="flex mt-12 ml-64">
      <div
       
      >
        <Breadcrumbs />
        <h1 className="sm:text-2xl 2xl:text-4xl font-bold text-center">About Us Page</h1>
        {session?.user?.permissions?.canCreateAboutTop && (
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

        {session?.user?.permissions?.canCreateAboutMiddle && (
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

        {session?.user?.permissions?.canCreateAboutBottom && (
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
  );
}
