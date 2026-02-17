"use client";
import { ArrowLeft, ArrowRight, Gift, Settings, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useData } from "../context/DataContext";
import { useEffect, useState } from "react";

export default function ControlCenter({ user }) {
  // const { offers } = useData();
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
      id: 1,
      title: "50% Off Spa",
      description: "Relax and enjoy our spa services",
      image: "/all-images/offer/spa.jpeg",
      url: "https://serendibhotels.mw/offers",
    },
    {
      id: 2,
      title: "Free Breakfast",
      description: "Get a complimentary breakfast for 2",
      image: "/all-images/offer/breakfast.jpeg",
      url: "https://serendibhotels.mw/offers",
    },
    {
      id: 3,
      title: "Room Upgrade",
      description: "Upgrade to a deluxe room for free",
      image: "/all-images/offer/room.jpg",
      url: "https://serendibhotels.mw/offers",
    },
    {
      id: 4,
      title: "Room Upgrade",
      description: "Upgrade to a deluxe room for free",
      image: "/all-images/offer/room.jpg",
      url: "https://serendibhotels.mw/offers",
    },
  ];

  const [index, setIndex] = useState(0);

  // Create an extended list to simulate infinite scrolling
  const extendedList = Array.from({ length: 10 }, () => offers).flat();
  const middleIndex = Math.floor(extendedList.length / 2);

  useEffect(() => {
    setIndex(middleIndex);
  }, [middleIndex]);

  useEffect(() => {
    if (index > extendedList.length - 3) {
      setIndex(middleIndex);
    }
  }, [index, middleIndex, extendedList.length]);

  const nextSlide = () => setIndex((prev) => prev + 1);
  const prevSlide = () =>
    setIndex((prev) => (prev - 1 + extendedList.length) % extendedList.length);

  return (
    <div className="card">
      <div className="flex items-center gap-2">
        <Settings className="text-serendib-primary" size={24} />
        <h2 className="text-xl font-semibold">Control Center</h2>
      </div>

      <div className="mt-2 sm:mt-3 p-2 sm:p-4 bg-gray-50 rounded-lg">
        <div className="text-sm font-semibold text-gray-900 mb-2">
          Stay History
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-gray-600">Total Stays</div>
            <div className="sm:text-2xl font-bold text-serendib-primary">
              {user.totalStays}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-600">Member Since</div>
            <div className="text-xs sm:text-sm font-semibold">
              {new Date(user.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 my-3">Explore</h3>
        <div className="flex  gap-2">
          {exploreOptions.map((option, idx) => (
            <button
              onClick={() => window.open(option.url, "_blank")}
              // href={option.url}
              key={idx}
              className="px-3 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all bg-serendib-primary hover:bg-serendib-secondary text-white"
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      {/* Carousel Container */}
      <div className="hidden lg:block mt-3">
        <h3 className="text-lg font-semibold">Explore Offers</h3>

        {offers.length === 0 ? (
          <div className="text-center py-12 text-gray-500 border border-gray-200 rounded-lg">
            <Tag size={48} className="mx-auto mb-4 opacity-50" />
            <p>No offers found</p>
          </div>
        ) : (
          <div className="relative overflow-hidden">
            {/* Left Arrow */}
            <button
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow hover:bg-gray-100"
              onClick={prevSlide}
            >
              <ArrowLeft size={15} />
            </button>

            {/* Carousel Container */}
            <div
              id="offersCarousel"
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${index * 70}%)` }}
            >
              {extendedList.map((offer, idx) => (
                <div
                  key={idx}
                  className="w-[50%] sm:w-[300px] flex-shrink-0 bg-white rounded-xl shadow p-4  transition"
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
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
              onClick={nextSlide}
            >
              <ArrowRight size={15} />
            </button>
          </div>
        )}
      </div>

      {/* Mobile Infinite Carousel */}
      <div className="lg:hidden relative mt-5  overflow-hidden">
        <h3 className=" font-semibold my-2 text-center">Explore Offers</h3>
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {extendedList.map((offer, i) => (
            <div
              key={i}
              className="w-full flex-shrink-0 bg-white relative h-60 overflow-hidden rounded-md"
            >
              <Image
                src={offer.image}
                alt={offer.title}
                fill
                className="object-cover px-2"
              />

              <div className="absolute bottom-0 left-0 right-0 bg-white/50 backdrop-blur-sm flex flex-col items-center p-2 mx-2">
                <h1 className="text-lg font-semibold mb-1">{offer.title}</h1>
                <p className="text-gray-600 mb-2 text-sm">
                  {offer.description}
                </p>
                <Link href={offer.url}>
                  <button className="bg-gray-200 hover:bg-gray-300 border border-gray-300 shadow-md rounded-lg px-2 transition-all duration-300">
                    Explore
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Arrows (Accommodation-style) */}
        <div className="absolute inset-y-0 left-0 right-0 bottom-0 flex justify-between items-center p-4">
          <button
            onClick={prevSlide}
            className="p-1 sm:p-2 rounded-full bg-gray-100 shadow hover:bg-gray-200"
          >
            <ArrowLeft size={15} />
          </button>
          <button
            onClick={nextSlide}
            className="p-1 sm:p-2 rounded-full bg-gray-100 shadow hover:bg-gray-200"
          >
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
