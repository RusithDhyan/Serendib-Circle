"use client";
import { BadgePlus, Pencil, Trash2 } from "lucide-react";
import Sidebar from "../(components)/Sidebar";
import { useData } from "../context/DataContext";
import { useEffect, useState } from "react";
import Link from "next/link";
import Breadcrumbs from "../(components)/Breadcrumbs";
import AddAnyOffer from "../(components)/(hotels)/(forms)/AddAnyOffer";
import Image from "next/image";
import ProtectedRoute from "../(components)/ProtectedRoute";

export default function Offers() {
  const { offers ,currentUser} = useData();
  const [showPopup, setShowPopup] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  const [search, setSearch] = useState("");

  const filteredOffers = offers.filter((offer) =>
    offer.title.toLowerCase().includes(search.toLowerCase())
  );

  const currentOffers = filteredOffers.slice();

  // const fetchOffer = async () => {
  //   const res = await fetch("/api/offer");
  //   const data = await res.json();
  //   if (data.success) setOffers(data.data);
  // };

  //  useEffect(() => {
  //     fetchOffer();
  //   }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this Offer?")) return;

    const res = await fetch(`/api/offer/${id}`, { method: "DELETE" });
    const result = await res.json();
    if (result.success || result.message === "Offer deleted") {
      fetchOffer();
    } else {
      alert("Delete failed.");
    }
  };

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
        <div className="flex items-center justify-between px-2 py-2 my-5 border-b border-gray-300 mx-4">
          <h1 className="sm:text-xl 2xl:text-2xl font-bold">All-Site offers</h1>
          <div className="flex">
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            className="border border-gray-300 px-3 py-1 hover:bg-blue-50 rounded-md text-sm"
          />
        </div>
        {currentUser?.permissions?.canCreateOffer && (
          <button
            onClick={() => setShowPopup(true)}
            className="group flex items-center gap-2 px-3 py-1 text-sm border text-blue-500 border-blue-500 rounded-md hover:bg-blue-500 hover:text-white font-bold transition"
          >
            <BadgePlus
              size={18}
              strokeWidth={1.4}
              className="text-blue-500 group-hover:text-white"
            />
            Add Any offer
          </button>
        )}
        </div>
        
        {currentOffers.length === 0 && (
          <div className="flex h-full items-center justify-center px-6 mx-4 shadow-md rounded-md">
            <p className="text-gray-500 text-center">
              No offers available for this site.
            </p>
          </div>
        )}
        {!currentUser?.permissions?.canReadOffer ? (
        <div className="p-6 text-center text-gray-500">
          You do not have permission to view all offers.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 px-6 mt-10 pb-5">
          {currentOffers.map((offer) => (
            <div key={offer._id}
              className="bg-white rounded-md shadow-md overflow-hidden hover:shadow-lg transition duration-300"
            >
              <div className="w-full sm:h-50 2xl:h-60 relative">
                <Link href={`/offers/${offer._id}`}>
                <Image
                  src={offer.image}
                  alt={offer.title}
                  fill
                  className="w-full h-full object-cover"
                />
                </Link>
              </div>

              {/* Title & Description */}
              <div className="p-4 flex flex-col gap-2">
                <h2 className="text-lg font-semibold text-gray-800">
                  {offer.title}
                </h2>
                <p className="text-sm text-gray-600">
                  {offer.description}
                </p>
                <div className="flex gap-3 mt-2">
                  {currentUser?.permissions?.canUpdateOffer && (
                  <button
                    onClick={() => {
                      setEditingOffer(offer);
                      setShowPopup(true);
                    }}
                    className="flex items-center gap-1 px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    <Pencil size={16} strokeWidth={1.7} /> Edit
                  </button>
                  )}
                  {currentUser?.permissions?.canDeleteOffer && (
                  <button
                    onClick={() => handleDelete(offer._id)}
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
          ))}
          
        </div>
      )}
        {showPopup && (
          <AddAnyOffer
            onClose={() => {
              setShowPopup(false);
              setEditingOffer(null);
            }}
            editingOffer={editingOffer}
          />
        )}
      </div>
    </div>
    </ProtectedRoute>
  );
}
