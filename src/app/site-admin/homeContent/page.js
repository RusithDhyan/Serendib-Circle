"use client";
import { BadgePlus } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { useData } from "@/app/context/DataContext";
import Breadcrumbs from "../(components)/Breadcrumbs";
import HomeTop from "../(components)/(home-content)/HomeTop";
import HomeMiddle from "../(components)/(home-content)/HomeMiddle";
import HomeExp from "../(components)/(home-content)/HomeExp";
import HomeBottom from "../(components)/(home-content)/HomeBottom";
import AddHomeTop from "../(components)/(hotels)/(forms)/AddHomeTop";
import AddHomeMiddle from "../(components)/(hotels)/(forms)/AddHomeMiddle";
import AddHomeBottom from "../(components)/(hotels)/(forms)/AddHomeBottom";
import AddHomeExp from "../(components)/(hotels)/(forms)/AddHomeExp";
import { useSession } from "next-auth/react";
import AddHomeSlider from "../(components)/(hotels)/(forms)/AddHomeContent";

export default function HomeContent() {
  const [showHomeSliderPopup, setShowHomeSliderPopup] = useState(false);
  const [editingHomeSlider, setEditingHomeSlider] = useState(null);
  const [showHomeTopPopup, setShowHomeTopPopup] = useState(false);
  const [editingHomeTop, setEditingHomeTop] = useState(null);
  const [showHomeMiddlePopup, setShowHomeMiddlePopup] = useState(false);
  const [editingHomeMiddle, setEditingHomeMiddle] = useState(null);
  const [showHomeBottomPopup, setShowHomeBottomPopup] = useState(false);
  const [editingHomeBottom, setEditingHomeBottom] = useState(null);
  const [showHomeExpPopup, setShowHomeExpPopup] = useState(false);
  const [editingHomeExp, setEditingHomeExp] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const { homeSlider } = useData();
  const { data: session } = useSession();

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this Slider image?")) return;

    const res = await fetch(`/api/site-admin/home-slider/${id}`, {
      method: "DELETE",
    });
    const result = await res.json();
    if (result.success || result.message === "Home slider images are deleted") {
      fetchAccommodation();
    } else {
      alert("Delete failed.");
    }
  };

  return (
    <div className="flex-1 mt-12 ml-64">
      <div>
        <Breadcrumbs />
        <h1 className="sm:text-2xl 2xl:text-4xl font-bold text-center">
          Home Page Content
        </h1>
        {session?.user?.permissions?.canCreateHomeSlider && (
          <div className="flex items-center justify-between px-3 mt-10 border-b sm:w-58 2xl:w-65 mx-3">
            <h1 className="sm:text-xl 2xl:text-2xl font-bold">
              Add Home Slider
            </h1>
            <button
              onClick={() => setShowHomeSliderPopup(true)}
              className="text-sm text-blue-500 rounded-md transition"
            >
              <BadgePlus
                size={25}
                strokeWidth={1.4}
                className="text-green-500"
              />
            </button>
          </div>
        )}

        {!session?.user?.permissions?.canReadHomeSlider ? (
          <div className="p-6 text-center text-gray-500">
            You do not have permission to view home-slider content.
          </div>
        ) : (
          <div className="flex justify-between p-3 mt-4">
            {Array.isArray(homeSlider[0]?.home_slider_image) &&
              homeSlider[0].home_slider_image.map((img, idx) => (
                <div key={idx} className="relative group sm:w-1/2 rounded-md">
                  <Image
                    src={img}
                    alt="Room 1"
                    width={1000}
                    height={50}
                    className="w-full sm:h-70 2xl:h-100 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white opacity-0 group-hover:opacity-100 transition-all duration-700">
                    <h1 className="text-lg sm:text-2xl font-bold mb-4">
                      Home-Slider Image {idx + 1}
                    </h1>
                  </div>
                </div>
              ))}
          </div>
        )}
        <div className="space-x-2 flex items-center justify-end px-3 gap-2">
          {session?.user?.permissions?.canUpdateHomeSlider && (
            <button
              onClick={() => {
                setEditingHomeSlider(homeSlider[0]);
                setShowHomeSliderPopup(true);
              }}
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              Edit
            </button>
          )}

          {session?.user?.permissions?.canDeleteHomeSlider && (
            <button
              onClick={() => handleDelete(homeSlider[0]._id)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          )}
        </div>

        {session?.user?.permissions?.canCreateHomeTop && (
          <div className="flex items-center justify-between px-3 mt-10 border-b sm:w-75 2xl:w-88 mx-3">
            <h1 className="sm:text-xl 2xl:text-2xl font-bold">
              Add Home-Top Content
            </h1>
            <button
              onClick={() => setShowHomeTopPopup(true)}
              className="text-sm text-blue-500 rounded-md transition"
            >
              <BadgePlus
                size={25}
                strokeWidth={1.4}
                className="text-green-500"
              />
            </button>
          </div>
        )}

        <HomeTop />

        <div>
          {session?.user?.permissions?.canCreateHomeMiddle && (
            <div className="flex items-center justify-between px-3 mt-10 border-b sm:w-82 2xl:w-95 mx-3">
              <h1 className="sm:text-xl 2xl:text-2xl font-bold">
                Add Home Middle-Content
              </h1>
              <button
                onClick={() => setShowHomeMiddlePopup(true)}
                className="text-sm text-blue-500 rounded-md transition"
              >
                <BadgePlus
                  size={25}
                  strokeWidth={1.4}
                  className="text-green-500"
                />
              </button>
            </div>
          )}
          {/* <HomeMiddle/> */}
          <HomeMiddle
            onEdit={(item) => {
              setEditingHomeMiddle(item);
              setShowHomeMiddlePopup(true);
            }}
          />
        </div>

        <div>
          {session?.user?.permissions?.canCreateHomeExp && (
            <div className="flex items-center gap-2 justify-between px-3 mt-10 border-b sm:w-75 2xl:w-87 mx-3">
              <h1 className="sm:text-xl 2xl:text-2xl font-bold">
                Add Home Exp-Content
              </h1>
              <button
                onClick={() => setShowHomeExpPopup(true)}
                className="text-sm text-blue-500 rounded-md transition"
              >
                <BadgePlus
                  size={25}
                  strokeWidth={1.4}
                  className="text-green-500"
                />
              </button>
            </div>
          )}
          <HomeExp
            onEdit={(item) => {
              setEditingHomeExp(item);
              setShowHomeExpPopup(true);
            }}
          />
        </div>

        <div>
          {session?.user?.permissions?.canCreateHomeBottom && (
            <div className="flex items-center justify-between px-3 mt-10 border-b sm:w-84 2xl:w-98 mx-3">
              <h1 className="sm:text-xl 2xl:text-2xl font-bold">
                Add Home Bottom-Content
              </h1>
              <button
                onClick={() => setShowHomeBottomPopup(true)}
                className="text-sm text-blue-500 rounded-md transition"
              >
                <BadgePlus
                  size={25}
                  strokeWidth={1.4}
                  className="text-green-500"
                />
              </button>
            </div>
          )}
          <HomeBottom
            onEdit={(item) => {
              setEditingHomeBottom(item);
              setShowHomeBottomPopup(true);
            }}
          />
        </div>

        {showHomeSliderPopup && (
          <AddHomeSlider
            onClose={() => {
              setShowHomeSliderPopup(false);
              setEditingHomeSlider(null);
            }}
            editingHomeSlider={editingHomeSlider}
          />
        )}

        {showHomeTopPopup && (
          <AddHomeTop
            onClose={() => {
              setShowHomeTopPopup(false);
              setEditingHomeTop(null);
            }}
            editingHomeTop={editingHomeTop}
          />
        )}

        {showHomeMiddlePopup && (
          <AddHomeMiddle
            onClose={() => {
              setShowHomeMiddlePopup(false);
              setEditingHomeMiddle(null);
            }}
            editingHomeMiddle={editingHomeMiddle}
          />
        )}

        {showHomeBottomPopup && (
          <AddHomeBottom
            onClose={() => {
              setShowHomeBottomPopup(false);
              setEditingHomeBottom(null);
            }}
            editingHomeBottom={editingHomeBottom}
          />
        )}

        {showHomeExpPopup && (
          <AddHomeExp
            onClose={() => {
              setShowHomeExpPopup(false);
              setEditingHomeExp(null);
            }}
            editingHomeExp={editingHomeExp}
          />
        )}
      </div>
    </div>
  );
}
