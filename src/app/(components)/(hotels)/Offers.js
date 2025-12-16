"use client";
import { useCallback, useEffect, useState } from "react";
import AddOffer from "./(forms)/AddOffer";
import Link from "next/link";
import Image from "next/image";
import { useData } from "@/app/context/DataContext";

export default function OfferSlider({ hotelId }) {
  const {currentUser} = useData();
  const [showPopup, setShowPopup] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);

  const [offers, setOffers] = useState([]);

  const fetchOffer = useCallback(async () => {
    const res = await fetch(`/api/offer?hotelId=${hotelId}`);
    const data = await res.json();
    if (data.success) setOffers(data.data);
  }, [hotelId]);

  useEffect(() => {
    fetchOffer();
  }, [fetchOffer]);

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
    <div className="mt-4 space-y-4 shadow-md py-10 px-4 mb-10">
      {offers.length === 0 && (
        <p className="text-gray-500 text-center">
          No offers available for this hotel.
        </p>
      )}

      {!currentUser?.permissions?.canReadOffer ? (
        <div className="p-6 text-center text-gray-500">
          You do not have permission to view hotel offers.
        </div>
      ) : (
        <div>

      {offers.map((offer) => (
        <div
          key={offer._id}
          className="border-b border-gray-300 last:border-none pb-4 flex items-center gap-4"
        >
          {offer.image && (
            <Image
              src={offer.image}
              alt="offer-img"
              width={1000}
              height={100}
              className="w-25 h-25 object-cover rounded-md"
            />
          )}

          <div className="flex-1">
            <Link href={`/offers/${offer._id}`}>
              <p className="hover:underline">{offer.offer_type}</p>
            </Link>
            <div>
              <h2 className="text-sm">{offer.description}</h2>
            </div>

            <div className="space-x-2 mt-2">
              {currentUser?.permissions?.canUpdateOffer && (
              <button
                onClick={() => {
                  setEditingOffer(offer);
                  setShowPopup(true);
                }}
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>
              )}

              {currentUser?.permissions?.canDeleteOffer && (
              <button
                onClick={() => handleDelete(offer._id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
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
        <AddOffer
          onClose={() => {
            setShowPopup(false);
            setEditingOffer(null);
          }}
          editingOffer={editingOffer}
          hotelId={hotelId}
        />
      )}
    </div>
  );
}
