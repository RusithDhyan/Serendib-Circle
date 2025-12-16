"use client";
import { BadgePlus, Pencil, Trash2 } from "lucide-react";
import Sidebar from "../(components)/Sidebar";
import { useData } from "../context/DataContext";
import { useState } from "react";
import Link from "next/link";
import AddExperience from "../(components)/(hotels)/(forms)/AddExperience";
import Breadcrumbs from "../(components)/Breadcrumbs";
import Image from "next/image";
import ProtectedRoute from "../(components)/ProtectedRoute";

export default function ExperiencePage() {
  const { experiences, setExperiences, currentUser } = useData();
  const [showPopup, setShowPopup] = useState(false);
  const [editingExperience, setEditingExperience] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const ExperiencePerPage = 6;

  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("nature");

  const { homeExp } = useData();

  const expTypes = [...new Set(homeExp.map((exp) => exp.type))];

  const fetchExperience = async () => {
    const res = await fetch("/api/experience");
    const data = await res.json();
    if (data.success) setExperiences(data.data);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this Experience?")) return;
    const res = await fetch(`/api/experience/${id}`, { method: "DELETE" });
    const result = await res.json();
    if (result.success || result.message === "Experience deleted") {
      fetchExperience();
    } else {
      alert("Delete failed.");
    }
  };

  const filteredExperiences = experiences
    .filter((exp) => exp.type === activeTab)
    .filter((exp) => exp.title.toLowerCase().includes(search.toLowerCase()));
  const count = filteredExperiences.length;

  const totalPages = Math.ceil(count / ExperiencePerPage);
  const indexOfLast = currentPage * ExperiencePerPage;
  const indexOfFirst = indexOfLast - ExperiencePerPage;
  const currentExperience = filteredExperiences.slice(
    indexOfFirst,
    indexOfLast
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <ProtectedRoute>
      <div className="flex">
        {/* Sidebar */}
        <div
          className={`bg-gray-100 shadow-md transition-all duration-300 ${
            isHovered ? "sm:w-50 2xl:w-64" : "w-20"
          }`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Sidebar isHovered={isHovered} />
        </div>

        {/* Main */}
        <div className="flex-1 transition-all duration-300 ml-1">
          <Breadcrumbs />

          {/* Header */}
          <div className="flex items-center justify-between px-2 py-2 my-5 border-b border-gray-300 mx-4">
            <h1 className="sm:text-xl 2xl:text-2xl font-bold">
              All Experiences
            </h1>
            {currentUser?.permissions?.canCreateExperience && (
              <button
                onClick={() => setShowPopup(true)}
                className="group flex items-center gap-2 px-3 py-1 text-sm border text-blue-500 border-blue-500 rounded-md hover:bg-blue-500 hover:text-white font-bold transition"
              >
                <BadgePlus
                  size={18}
                  strokeWidth={1.4}
                  className="text-blue-500 group-hover:text-white"
                />
                Add Experience
              </button>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-4 px-6 mb-5 items-center justify-between px-10">
            <div className="flex items-center gap-4">
              {expTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setActiveTab(type)}
                  className={`px-4 py-2 rounded-md font-medium transition ${
                    activeTab === type
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="flex items-center gap-5">
              <div className="flex justify-center items-center">
                <input
                  type="text"
                  placeholder="Search by title..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border border-gray-300 px-3 py-2 hover:bg-blue-50 rounded-md text-sm"
                />
              </div>

              <div className="border rounded-md shadow-lg py-1 px-2">
                <h2 className="font-semibold">Count : {count}</h2>
              </div>
            </div>
          </div>

          {/* Table View */}
          <div className="overflow-x-auto px-6 mb-10">
            <table className="w-full rounded-lg overflow-hidden">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-2">Thumbnail</th>
                  <th className="px-4 py-2">Title</th>
                  <th className="px-4 py-2">Type</th>
                  <th className="px-4 py-2">Description</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              {/* {!currentUser?.permissions?.canReadExperience ? (
                <div className="p-6 text-center text-gray-500">
                  You do not have permission to view all experiences.
                </div>
              ) : ( */}
                <tbody>
                  {currentExperience.length > 0 ? (
                    currentExperience.map((experience) => (
                      <tr
                        key={experience._id}
                        className="border-b border-gray-300 hover:bg-orange-50 text-left"
                      >
                        <td className="px-4 py-1">
                          <Link href={`/experiences/${experience._id}`}>
                            <Image
                              src={experience.image}
                              alt={experience.title}
                              width={1000}
                              height={48}
                              className="w-12 h-12 object-cover rounded-full"
                            />
                          </Link>
                        </td>

                        <td className="px-4 py-2">
                          <Link
                            className="hover:underline text-sm"
                            href={`/experiences/${experience._id}`}
                          >
                            {experience.title}
                          </Link>
                        </td>

                        <td className="px-4 py-1 text-[#dfb98d] font-bold">
                          {experience.type}
                        </td>
                        <td className="px-4 py-1 text-sm">
                          {experience.description}
                        </td>

                        <td className="px-4 py-1 border-b border-gray-300 hover:bg-orange-50">
                          <div className="flex gap-2">
                            {currentUser?.permissions?.canUpdateExperience && (
                              <button
                                onClick={() => {
                                  setEditingExperience(experience);
                                  setShowPopup(true);
                                }}
                                className="flex items-center gap-1 px-2 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                              >
                                <Pencil size={14} strokeWidth={1.7} /> Edit
                              </button>
                            )}
                            {currentUser?.permissions?.canDeleteExperience && (
                              <button
                                onClick={() => handleDelete(experience._id)}
                                className="flex items-center gap-1 px-2 py-1 text-sm border border-red-500 text-red-500 rounded-md hover:bg-red-500 hover:text-white"
                              >
                                <Trash2 size={14} strokeWidth={1.4} /> Delete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="w-full text-center text-gray-500 py-4 border"
                      >
                        No experiences found
                      </td>
                    </tr>
                  )}
                </tbody>
              {/* )} */}
            </table>
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, idx) => (
                <button
                  key={idx + 1}
                  onClick={() => handlePageChange(idx + 1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === idx + 1
                      ? "bg-[#dfb98d] text-white hover:bg-[#D9C6B1]"
                      : "bg-gray-100"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>

          {/* Popup */}
          {showPopup && (
            <AddExperience
              onClose={() => {
                setShowPopup(false);
                setEditingExperience(null);
              }}
              editingExperience={editingExperience}
            />
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
