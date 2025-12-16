"use client";
import AddExpContent from "@/app/(components)/(experience)/AddExpContent";
import ExpContent from "@/app/(components)/(experience)/ExpContent";
import Sidebar from "@/app/(components)/Sidebar";
import { BadgePlus, Goal } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function ExperienceInnerPage() {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [showExpContentPopup, setShowExpContentPopup] = useState(false);
  const [editingExpContent, setEditingExpContent] = useState(null);
  const [experience, setExperience] = useState({});
  const { id } = useParams();

  useEffect(() => {
    const fetchExperience = async () => {
      const res = await fetch(`/api/experience/${id}`);
      const data = await res.json();
      setExperience(data.data);
    };
    if (id) fetchExperience();
  }, [id]);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`bg-gray-100 shadow-md transition-all duration-300
          ${isHovered ? "sm:w-50 2xl:w-64" : "w-20"}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Sidebar isHovered={isHovered} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex pb-5">
        {/* Left Section: Experience Info */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-col gap-4">
            {/* Header */}
            <div>
              <h1 className="text-2xl font-semibold">{experience.title}</h1>
              <p className="text-gray-500">
                Type Of:{" "}
                <span className="text-orange-500 font-semibold">
                  {experience.type}
                </span>
              </p>
            </div>

            {/* Description */}
            <p className="text-sm text-justify text-gray-700">
              {experience.description}
            </p>

            {/* Image */}
            <div className="bg-white rounded-md shadow-md overflow-hidden hover:shadow-lg transition duration-300">
              {experience.image && (
                <Image
                  src={experience.image}
                  alt="exp-inner image"
                  width={1000}
                  height={400}
                  className="w-full sm:h-60 2xl:h-100 object-cover"
                />
              )}

              {/* Exp Content Header */}
              <div className="flex items-center px-4 mt-6 border-b w-75 gap-2 pb-2">
                <h2 className="text-lg font-bold text-gray-800">
                  Add Experience Content
                </h2>
                <button
                  onClick={() => setShowExpContentPopup(true)}
                  className="text-sm text-blue-500 rounded-md transition flex items-center gap-1"
                >
                   <BadgePlus size={22} strokeWidth={1.4} className="text-green-600" />
                </button>
              </div>

              {/* Exp Content List */}
              <ExpContent expId={experience._id} />

              {/* Experience Body */}
              <div className="p-4 flex flex-col gap-3">
                <h2 className="text-lg font-semibold text-gray-800">
                  {experience.body_title}
                </h2>
                <p className="text-sm text-gray-600">
                  {experience?.body_description ||
                    "No added body description yet..."}
                </p>

                {experience?.bulletPoints?.length > 0 && (
                  <>
                    <h1 className="text-xl mt-2 underline">Experience Packages</h1>
                    <div className="space-y-2">
                      {experience.bulletPoints.map((point, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <Goal size={20} strokeWidth={1.5} />
                          <span className="text-sm text-gray-700">{point}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* Back Button */}
                <div className="mt-4 flex justify-start">
                  <button
                    onClick={() => router.back()}
                    className="w-24 bg-blue-800 hover:bg-blue-900 text-white font-semibold rounded-md py-2 transition"
                  >
                    Back
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Popup Drawer */}
        {showExpContentPopup && (
          <div className="fixed right-0 top-0 w-[35%] h-full bg-white shadow-2xl z-50 border-l border-gray-200 overflow-y-auto p-6 animate-slideIn">
            <AddExpContent
              onClose={() => {
                setShowExpContentPopup(false);
                setEditingExpContent(null);
              }}
              editingExpContent={editingExpContent}
              expId={experience._id}
            />
          </div>
        )}
      </div>
    </div>
  );
}
