"use client";
import AddOfferContent from "@/app/site-admin/(components)/(offer)/(form)/AddOfferContent";
import OfferContent from "@/app/site-admin/(components)/(offer)/OfferContent";
import { BadgePlus, Goal, Sidebar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function OfferInnerPage() {
  const [isHovered, setIsHovered] = useState(false);
  const [showOfferContentPopup, setShowOfferContentPopup] = useState(false);
  const [editingOfferContent, setEditingOfferContent] = useState(null);
  const [hotelNameById, setHotelNameById] = useState({});

  const [offer, setOffer] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        const res = await fetch(`/api/offer/${id}`);
        const data = await res.json();

        // normalize into an array so .map always works
        const normalized = Array.isArray(data.offer)
          ? data.offer
          : [data.offer];
        setOffer(normalized);
      } catch (e) {
        console.error("Failed to load offer:", e);
      }
    };

    if (id) fetchOffer();
  }, [id]);

  useEffect(() => {
    let cancelled = false;

    async function loadHotels() {
      try {
        const res = await fetch("/api/hotels", { cache: "no-store" });
        const json = await res.json();

        const map = {};
        (json?.data || []).forEach((h) => {
          map[h._id] = h.hotel_name || h.name;
        });

        if (!cancelled) setHotelNameById(map);
      } catch (e) {
        console.error("Failed to load hotels:", e);
      }
    }

    loadHotels();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!offer) return <div>Loading...</div>;

  return (
    <div className="">
      {offer.map((offer) => {
        const hotelId = offer.hotelId?._id || offer.hotelId;
        const hotelName = hotelNameById[hotelId] || offer.hotelName || "Hotel";
        const offerType =
          offer.offer_type || offer.offerType || "Special Offer";

        return (
          <div key={offer._id} className="flex-1 mt-12 ml-64">
            <div>
              <h1 className="sm:text-2xl 2xl:text-4xl text-center font-bold mt-10">
                {offerType} at{" "}
                <Link href={`/hotels/${hotelId}`}>
                  <span className="text-gray-400 hover:underline">
                    {hotelName}
                  </span>
                </Link>
              </h1>
              <div className="flex flex-col md:flex-row gap-6 bg-white  rounded-lg shadow-md pt-5">
                {/* Left Side: Text Info */}
                <div className="md:w-1/2 space-y-2 p-4">
                  <h2 className="sm:text-lg 2xl:text-xl font-bold">
                    Card Title :{" "}
                    <span className="text-gray-700 text-lg">{offer.title}</span>
                  </h2>
                  <p className="sm:text-lg 2xl:text-xl font-bold">
                    Card Description :{" "}
                    <span className="text-gray-700 text-sm">
                      {offer.description}
                    </span>
                  </p>

                  {offer?.bulletPoints && offer?.bulletPoints.length > 0 && (
                    <>
                      <h1 className="text-xl sm:text-2xl py-2 mt-2 underline">
                        Offer Inclusions ...
                      </h1>
                      <div className="mt-4 space-y-2">
                        {offer?.bulletPoints.map((point, index) => (
                          <div
                            key={index}
                            className="flex items-start sm:items-center gap-2"
                          >
                            <Goal size={15} />
                            <h3 className="text-xs sm:text-md 2xl:text-sm font-light">
                              {point}
                            </h3>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Right Side: 3 Images in a row */}
                <div className="flex justify-between w-1/2">
                  <div className="relative group md:w-1/2">
                    <Image
                      src={offer.image}
                      alt="Room 1"
                      width={1000}
                      height={50}
                      className="w-auto h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white opacity-0 group-hover:opacity-100 transition-all duration-700">
                      <h1 className="sm:text-lg sm:text-2xl font-bold mb-4">
                        Thumbnail Image
                      </h1>
                    </div>
                  </div>
                  {offer.bg_image != null && (
                    <div className="relative group md:w-1/2">
                      <Image
                        src={offer.bg_image}
                        alt="Room 1"
                        width={1000}
                        height={50}
                        className="w-auto h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white opacity-0 group-hover:opacity-100 transition-all duration-700">
                        <h1 className="sm:text-lg sm:text-2xl font-bold mb-4">
                          Background Image
                        </h1>
                      </div>
                    </div>
                  )}
                  <div className="relative group md:w-1/2">
                    <Image
                      src={offer.cover_image}
                      alt="Room 2"
                      width={1000}
                      height={50}
                      className="w-auto h-full object-cover rounded-r"
                    />
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white opacity-0 group-hover:opacity-100 transition-all duration-700">
                      <h1 className="sm:text-lg sm:text-2xl font-bold mb-4">
                        Cover Image
                      </h1>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 px-2 mt-10  border-b sm:w-65 2xl:w-70">
                <h1 className="sm:text-xl 2xl:text-2xl font-bold">
                  Add offer Content
                </h1>
                <button
                  onClick={() => setShowOfferContentPopup(true)}
                  className="text-sm text-blue-500 rounded-md transition"
                >
                  <BadgePlus
                    size={25}
                    strokeWidth={1.4}
                    className="text-green-500"
                  />
                </button>
              </div>
              <OfferContent offerId={offer._id} />
              {showOfferContentPopup && (
                <AddOfferContent
                  onClose={() => {
                    setShowOfferContentPopup(false);
                    setEditingOfferContent(null);
                  }}
                  editingOfferContent={editingOfferContent}
                  offerId={offer._id}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
