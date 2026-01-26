"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Accommodation from "@/app/site-admin/(components)/(hotels)/Accommodation";
import OfferSlider from "@/app/site-admin/(components)/(hotels)/Offers";
import Experience from "@/app/site-admin/(components)/(hotels)/Experience";
import Gallery from "@/app/site-admin/(components)/(hotels)/Gallery";
import "swiper/css";
import "swiper/css/navigation";
import { BadgePlus } from "lucide-react";
import AddAccommodation from "@/app/site-admin/(components)/(hotels)/(forms)/AddAccommodation";
import AddPageExperience from "@/app/site-admin/(components)/(hotels)/(forms)/AddPageExperience";
import AddGallery from "@/app/site-admin/(components)/(hotels)/(forms)/AddGallery";
import AddOffer from "@/app/site-admin/(components)/(hotels)/(forms)/AddOffer";
import AddService from "@/app/site-admin/(components)/(hotels)/(forms)/AddService";
import Services from "@/app/site-admin/(components)/(hotels)/Services";
import Image from "next/image";
import { useData } from "@/app/context/DataContext";
import { fetchHotelById, getHotels } from "@/lib/fetchData";

export default function HotelInnerPage() {
  const { currentUser } = useData();
  const [hotel, setHotel] = useState({});
  const { id } = useParams();
  const [showAccPopup, setShowAccPopup] = useState(false);
  const [showExpPopup, setShowExpPopup] = useState(false);
  const [showGalPopup, setShowGalPopup] = useState(false);
  const [showOfferPopup, setShowOfferPopup] = useState(false);
  const [showServicePopup, setShowServicePopup] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const [editingAccommodation, setEditingAccommodation] = useState(null);
  const [editingExperience, setEditingExperience] = useState(null);
  const [editingGallery, setEditingGallery] = useState(null);
  const [editingOffer, setEditingOffer] = useState(null);
  const [editingService, setEditingService] = useState(null);

  // Refs for Swiper buttons
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [swiperReady, setSwiperReady] = useState(false);
  console.log("ID", id);

  useEffect(() => {
    const fetchHotel = async () => {
      // const res = await fetch(`/api/hotels/${id}`);
      // const data = await res.json();
      const hotels = await getHotels();

      const hotel = hotels.find((h) => h._id === id);
      console.log("hotel", hotel);
      setHotel(hotel);
    };
    if (id) fetchHotel();
  }, [id]);

  useEffect(() => {
    setSwiperReady(true);
  }, []);

  return (
    <div className="flex">
      <div
        className={`
          flex-1 transition-all duration-300 px-3
          
        `}
      >
        <h1 className="sm:text-2xl 2xl:text-4xl text-center font-bold mt-10">
          {hotel?.hotel_name}
        </h1>
        <div className="flex flex-col md:flex-row gap-6 bg-white  rounded-lg shadow-md pt-5">
          {/* Left Side: Text Info */}
          <div className="space-y-2 p-4 2xl:w-350">
            <h2 className="sm:text-lg 2xl:text-xl font-bold">
              Card Title :{" "}
              <span className="text-gray-700 sm:text-sm 2xl:text-lg">
                {hotel?.title}
              </span>
            </h2>
            <p className="sm:text-lg 2xl:text-xl font-bold">
              Location :{" "}
              <span className="text-gray-700 sm:text-sm 2xl:text-lg">
                {hotel?.location}
              </span>
            </p>
            <p className="sm:text-lg 2xl:text-xl font-bold">
              Card Description :{" "}
              <span className="text-gray-700 text-sm">
                {hotel?.description}
              </span>
            </p>
          </div>

          {/* Right Side: 3 Images in a row */}
          <div className="flex justify-between">
            <div className="relative group sm:w-1/2">
              <Image
                src={hotel?.thumbnail}
                alt="Room 1"
                width={1000}
                height={100}
                className="sm:w-auto sm:h-full 2xl:w-full 2xl:h-100 object-cover"
              />
              <div className="absolute inset-0 bg-black/40 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white opacity-0 group-hover:opacity-100 transition-all duration-700">
                <h1 className="sm:text-lg 2xl:text-xl font-bold mb-4">
                  Thumbnail Image
                </h1>
              </div>
            </div>
            <div className="relative group sm:w-1/2">
              <Image
                src={hotel?.cover_image}
                alt="Room 2"
                width={1000}
                height={100}
                className="sm:w-auto sm:h-full 2xl:w-full 2xl:h-100 object-cover rounded-r"
              />
              <div className="absolute inset-0 bg-black/40 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white opacity-0 group-hover:opacity-100 transition-all duration-700">
                <h1 className="sm:text-lg 2xl:text-xl font-bold mb-4">
                  Background Image
                </h1>
              </div>
            </div>
            <div className="relative group sm:w-1/2">
              <Image
                src={hotel?.image}
                alt="Room 2"
                width={1000}
                height={100}
                className="sm:w-auto sm:h-full 2xl:w-full 2xl:h-100 object-cover rounded-r"
              />
              <div className="absolute inset-0 bg-black/40 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white opacity-0 group-hover:opacity-100 transition-all duration-700">
                <h1 className="sm:text-lg 2xl:text-xl font-bold mb-4">
                  Cover Image
                </h1>
              </div>
            </div>
          </div>
        </div>
        {/* <Accommodation hotelId={hotel._id} /> */}
        {currentUser?.permissions?.canCreateAccommodation && (
          <div className="flex items-center justify-between px-3 mt-10  border-b sm:w-68 2xl:w-80">
            <h1 className="sm:text-xl 2xl:text-2xl font-bold">
              Add Accommodation
            </h1>
            <button
              onClick={() => setShowAccPopup(true)}
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
        <Accommodation hotelId={hotel?._id} />
        {currentUser?.permissions?.canCreatePageExp && (
          <div className="flex items-center justify-between px-3 mt-10  border-b sm:w-66 2xl:w-80">
            <h1 className="sm:text-xl 2xl:text-2xl font-bold">
              Add Page-Experience
            </h1>
            <button
              onClick={() => setShowExpPopup(true)}
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
        <Experience hotelId={hotel?._id} />
        {currentUser?.permissions?.canCreateGallery && (
          <div className="flex items-center justify-between px-3 mt-10  border-b sm:w-50 2xl:w-60">
            <h1 className="sm:text-xl 2xl:text-2xl font-bold">Add Galleries</h1>
            <button
              onClick={() => setShowGalPopup(true)}
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

        <Gallery hotelId={hotel?._id} />
        {currentUser?.permissions?.canCreateOffer && (
          <div className="flex items-center justify-between px-3 mt-10  border-b sm:w-45 2xl:w-55">
            <h1 className="sm:text-xl 2xl:text-2xl font-bold">Add Offers</h1>
            <button
              onClick={() => setShowOfferPopup(true)}
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
        <OfferSlider hotelId={hotel?._id} />
        {currentUser?.permissions?.canCreateService && (
          <div className="flex items-center justify-between px-3 mt-10  border-b sm:w-50 2xl:w-55">
            <h1 className="sm:text-xl 2xl:text-2xl font-bold">Add Services</h1>
            <button
              onClick={() => setShowServicePopup(true)}
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
        <Services hotelId={hotel?._id} />
        {showAccPopup && (
          <AddAccommodation
            onClose={() => {
              setShowAccPopup(false);
              setEditingAccommodation(null);
            }}
            editingAccommodation={editingAccommodation}
            hotelId={hotel?._id}
          />
        )}
        {showExpPopup && (
          <AddPageExperience
            onClose={() => {
              setShowExpPopup(false);
              setEditingExperience(null);
            }}
            editingExperience={editingExperience}
            hotelId={hotel?._id}
          />
        )}
        {showGalPopup && (
          <AddGallery
            onClose={() => {
              setShowGalPopup(false);
              setEditingGallery(null);
            }}
            editingGallery={editingGallery}
            hotelId={hotel?._id}
          />
        )}
        {showOfferPopup && (
          <AddOffer
            onClose={() => {
              setShowOfferPopup(false);
              setEditingOffer(null);
            }}
            editingOffer={editingOffer}
            hotelId={hotel?._id}
          />
        )}
        {showServicePopup && (
          <AddService
            onClose={() => {
              setShowServicePopup(false);
              setEditingService(null);
            }}
            editingService={editingService}
            hotelId={hotel?._id}
          />
        )}
      </div>
    </div>
  );
}
