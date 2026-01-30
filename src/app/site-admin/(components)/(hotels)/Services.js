"use client";
import {
  Baby,
  Bike,
  BikeIcon,
  Building,
  ConciergeBellIcon,
  FishIcon,
  Flower,
  Gamepad,
  Gamepad2,
  HandHelpingIcon,
  HeartPulse,
  Kayak,
  Map,
  Presentation,
  Puzzle,
  Sailboat,
  Table2,
  Target,
  TicketsPlane,
  Timer,
  User,
  Volleyball,
  WashingMachine,
  Waves,
} from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  CheckCircle,
  ParkingCircle,
  Plane,
  Utensils,
  Wifi,
  Wine,
} from "lucide-react";
import AddService from "./(forms)/AddService";
import Image from "next/image";
import { useData } from "@/app/context/DataContext";
import { useSession } from "next-auth/react";
import { fetchServiceByHotel } from "@/lib/fetchData";

const serviceIconMap = {
  "Room Service": <ConciergeBellIcon strokeWidth={0.5} size={65} />,
  Restaurant: <Utensils strokeWidth={0.5} size={65} />,
  "Airport Transfers": <Plane strokeWidth={0.5} size={65} />,
  "Laundry Services": <WashingMachine strokeWidth={0.5} size={65} />,
  "Free Public Parking": <ParkingCircle strokeWidth={0.5} size={65} />,
  "VIP Airport Service": <TicketsPlane strokeWidth={0.5} size={65} />,
  "Free Wifi": <Wifi strokeWidth={0.5} size={65} />,
  Babysitting: <Baby strokeWidth={0.5} size={65} />,
  "Concierge Services": <HandHelpingIcon strokeWidth={0.5} size={65} />,
  "24hr Front desk": <Timer strokeWidth={0.5} size={65} />,
  "Spa Service": <Flower strokeWidth={0.5} size={65} />,
  "Conferencing Facility": <Presentation strokeWidth={0.5} size={65} />,
  "Mini bar": <Wine strokeWidth={0.5} size={65} />,
  "Meeting Room": <User strokeWidth={0.5} size={65} />,
  Boardroom: <Building strokeWidth={0.5} size={65} />,
  Darts: <Target strokeWidth={0.5} size={65} />,
  "Board Games/Puzzles": <Puzzle strokeWidth={0.5} size={65} />,
  "City Tour": <Map strokeWidth={0.5} size={65} />,
  "Village Tour": <Bike strokeWidth={0.5} size={65} />,
  "Indoor Games": <Gamepad strokeWidth={0.5} size={65} />,
  "Mangunda Safari Cruise": <Sailboat strokeWidth={0.5} size={65} />,
  "Fishing at Shire Lake": <FishIcon strokeWidth={0.5} size={65} />,
  "Leisure Time Games": <Gamepad2 strokeWidth={0.5} size={65} />,
  "Village Cycle Tours": <Bike strokeWidth={0.5} size={65} />,
  Kayaking: <Kayak strokeWidth={0.5} size={65} />,
  Swimming: <Waves strokeWidth={0.5} size={65} />,
  Tennis: <Table2 strokeWidth={0.5} size={65} />,
  "Bike Rides": <BikeIcon strokeWidth={0.5} size={65} />,
  "Beach Soccer, netball and Volleyball": (
    <Volleyball strokeWidth={0.5} size={65} />
  ),
  Aerobics: <HeartPulse strokeWidth={0.5} size={65} />,
  "Wedding Venue": (
    <Image
      src="/all-images/icons/ring1.png"
      alt="Couple"
      width={1000}
      height={30}
      className="w-12 h-11 sm:w-17 sm:h-17"
    />
  ),
  default: <CheckCircle size={16} />,
};

export default function Services({ hotelId }) {
  const { data: session } = useSession();
  const [showPopup, setShowPopup] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const [services, setServices] = useState([]);

  const fetchService = useCallback(async () => {
    const services = await fetchServiceByHotel(hotelId);
    if (services) setServices(services);
  }, [hotelId]);

  useEffect(() => {
    fetchService();
  }, [fetchService]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this service?")) return;

    const res = await fetch(`/api/site-admin/services/${id}`, {
      method: "DELETE",
    });
    const result = await res.json();
    if (result.success || result.message === "service deleted") {
      fetchService();
    } else {
      alert("Delete failed.");
    }
  };

  return (
    <div className="mt-4 space-y-4 shadow-md py-10 px-4 mb-10">
      {services.length === 0 && (
        <p className="text-gray-500 text-center">
          No services available for this hotel.
        </p>
      )}

      {!session?.user?.permissions?.canReadService ? (
        <div className="p-6 text-center text-gray-500">
          You do not have permission to view hotel services.
        </div>
      ) : (
        <div>
          {services.map((service) => (
            <div key={service._id} className="mb-6">
              <div className="grid grid-cols-10 items-center justify-between">
                {service.service_type?.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center text-sm 2xl:text-md text-gray-700 2xl:mt-2 px-1"
                  >
                    {serviceIconMap[item] || serviceIconMap["default"]}
                    <h2 className="text-center">{item}</h2>
                  </div>
                ))}
              </div>

              <div className="space-x-2 pt-8 flex items-center justify-end gap-2">
                {session?.user?.permissions?.canUpdateService && (
                  <button
                    onClick={() => {
                      setEditingService(service);
                      setShowPopup(true);
                    }}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                )}

                {session?.user?.permissions?.canDeleteService && (
                  <button
                    onClick={() => handleDelete(service._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      {showPopup && (
        <AddService
          onClose={() => {
            setShowPopup(false);
            setEditingService(null);
          }}
          editingService={editingService}
          hotelId={hotelId}
        />
      )}
    </div>
  );
}
