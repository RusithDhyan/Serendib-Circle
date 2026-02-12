"use client";
import { Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ControlCenter({ user }) {
  const exploreOptions = [
    {
      label: "Experience",
      url: "https://serendibhotels.mw/experiences",
    },
    {
      label: "Location",
      url: "https://serendibhotels.mw/our-collection",
    },
  ];

  const offers = [
    {
      title: "50% Off Spa",
      description: "Relax and enjoy our spa services",
      image: "/all-images/offer/spa.jpeg",
      url: "https://serendibhotels.mw/offers",
    },
    {
      title: "Free Breakfast",
      description: "Get a complimentary breakfast for 2",
      image: "/all-images/offer/breakfast.jpeg",
      url: "https://serendibhotels.mw/offers",
    },
    {
      title: "Room Upgrade",
      description: "Upgrade to a deluxe room for free",
      image: "/all-images/offer/room.jpg",
      url: "https://serendibhotels.mw/offers",
    },
    {
      title: "Room Upgrade",
      description: "Upgrade to a deluxe room for free",
      image: "/all-images/offer/room.jpg",
      url: "https://serendibhotels.mw/offers",
    },
    // Add more...
  ];

  const scrollCarousel = (direction) => {
    const container = document.getElementById("offersCarousel");
    const scrollAmount = 220; // adjust based on tile width + gap
    if (direction === "left") {
      container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleOfferClick = (offer) => {
    console.log("Clicked offer:", offer);
    // Navigate or show modal
  };

  return (
    <div className="card">
      <div className="flex items-center gap-2">
        <Settings className="text-serendib-primary" size={24} />
        <h2 className="text-xl font-semibold">Control Center</h2>
      </div>

      <div className="mt-3 p-4 bg-gray-50 rounded-lg">
        <div className="text-sm font-semibold text-gray-900 mb-2">
          Stay History
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-gray-600">Total Stays</div>
            <div className="text-2xl font-bold text-serendib-primary">
              {user.totalStays}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-600">Member Since</div>
            <div className="text-sm font-semibold">
              {new Date(user.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Explore</h3>
        <div className="flex  gap-2">
          {exploreOptions.map((option, idx) => (
            <Link
            onClick={() => window.open(offer.url, "_blank")}
              href={option.url}
              key={idx}
              className="px-3 py-2 rounded-lg text-sm font-medium transition-all bg-serendib-primary hover:bg-serendib-secondary text-white"
            >
              {option.label}
            </Link>
          ))}
        </div>
      </div>

      {/* ===== Explore Offers Carousel ===== */}
      <div className="mt-3">
        <h3 className="text-lg font-semibold mb-3">Explore Offers</h3>

        {offers.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Gift size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No offers found</p>
                  </div>
                ) : (

        <div className="relative">
          {/* Left Arrow */}
          <button
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow hover:bg-gray-100"
            onClick={() => scrollCarousel("left")}
          >
            &#8592;
          </button>

          {/* Carousel Container */}
          <div
            id="offersCarousel"
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
          >
            {offers.map((offer, idx) => (
              <div
                key={idx}
                className="min-w-[300px] flex-shrink-0 bg-white rounded-xl shadow p-4  transition"
                onClick={() => handleOfferClick(offer)}
              >
                <Image
                  src={offer.image}
                  alt={offer.title}
                  width={1000}
                  height={100}
                  className="w-full h-32 object-cover rounded-lg mb-2"
                />
                <h4 className="text-sm font-semibold">{offer.title}</h4>
                <div className="flex items-end justify-between">
                  <p className="text-xs text-gray-500">{offer.description}</p>
                  <button
                    onClick={() => window.open(offer.url, "_blank")}
                    className="bg-gray-200 hover:bg-gray-300 border border-gray-300 shadow-md rounded-lg px-2 transition-all duration-300 cursor-pointer"
                  >
                    Explore
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow hover:bg-gray-100"
            onClick={() => scrollCarousel("right")}
          >
            &#8594;
          </button>
        </div>
                )}
      </div>
    </div>
  );
}
