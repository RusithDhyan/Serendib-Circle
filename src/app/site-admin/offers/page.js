"use client";
import { BadgePlus, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useData } from "@/app/context/DataContext";
import AddAnyOffer from "../(components)/(hotels)/(forms)/AddAnyOffer";
import Breadcrumbs from "../(components)/Breadcrumbs";
import ProtectedRoute from "../(components)/ProtectedRoute";
import { useSession } from "next-auth/react";
import { fetchSecure } from "@/lib/fetchData";

export default function Offers() {
  const { data: session } = useSession();
  const { offers } = useData();
  const [showPopup, setShowPopup] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  const [search, setSearch] = useState("");

  const filteredOffers = offers.filter((offer) =>
    offer.title.toLowerCase().includes(search.toLowerCase())
  );

  const currentOffers = filteredOffers.slice();

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this Offer?")) return;

    const res = await fetch(`/api/site-admin/offer/${id}`, {
      method: "DELETE",
    });
    const result = await res.json();
    if (result.success || result.message === "Offer deleted") {
      fetchSecure("offer");
    } else {
      alert("Delete failed.");
    }
  };

  return (
    <div className="flex-1 mt-12 ml-64">
      <div
        
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
          {session?.user?.permissions?.canCreateOffer && (
            <button
              onClick={() => setShowPopup(true)}
              className="group flex items-center gap-2 px-3 py-1 text-sm border text-serendib-primary border-serendib-primary rounded-md hover:bg-serendib-secondary hover:text-white font-bold transition"
            >
              <BadgePlus
                size={18}
                strokeWidth={1.4}
                className="text-serendib-primary group-hover:text-white"
              />
              Add Any offer
            </button>
          )}
        </div>

        {currentOffers.length === 0 && (
          <div className="flex items-center justify-center px-6 mx-4 rounded-md">
            <p className="text-gray-500 text-center">
              No offers available for this site.
            </p>
          </div>
        )}
        {!session?.user?.permissions?.canReadOffer ? (
          <div className=" text-center text-gray-500">
            You do not have permission to view all offers.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 px-6 mt-10 pb-5">
            {currentOffers.map((offer) => (
              <div
                key={offer._id}
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
                  <p className="text-sm text-gray-600">{offer.description}</p>
                  <div className="flex gap-3 mt-2">
                    {session?.user?.permissions?.canUpdateOffer && (
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
                    {session?.user?.permissions?.canDeleteOffer && (
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
  );
}
