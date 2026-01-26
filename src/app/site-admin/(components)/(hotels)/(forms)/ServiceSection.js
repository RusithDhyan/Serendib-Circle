"use client";
import {
  Baby,
  BedIcon,
  Bike,
  BikeIcon,
  BookUser,
  Briefcase,
  CheckCircle,
  ConciergeBell,
  ConciergeBellIcon,
  FishIcon,
  Flower,
  Gamepad,
  Gamepad2,
  Gift,
  HandHelping,
  HeartPulse,
  Kayak,
  LoaderCircle,
  Map,
  ParkingCircle,
  Plane,
  Presentation,
  Puzzle,
  Sailboat,
  SailboatIcon,
  Shield,
  Sparkles,
  User,
  UserCheck,
  Users,
  Utensils,
  Volleyball,
  WashingMachine,
  Waves,
  WavesLadder,
  Wifi,
  Wind,
  Wine,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { PiScooter } from "react-icons/pi";

const optionsWithIcons = [
  { label: "Room Service", icon: ConciergeBellIcon },
  { label: "Restaurant", icon: Utensils },
  { label: "Airport Transfers", icon: Plane },
  { label: "Laundry Services", icon: WashingMachine },
  { label: "Free Public Parking", icon: ParkingCircle },
  { label: "VIP Airport Service", icon: UserCheck },
  { label: "Free Wifi", icon: Wifi },
  { label: "Babysitting", icon: Baby },
  { label: "Conclerge Services", icon: ConciergeBellIcon },
  { label: "24hr Front desk", icon: LoaderCircle },
  { label: "Boardroom", icon: Briefcase },
  { label: "Wedding Venue", icon: Gift },
  { label: "Spa Service", icon: BedIcon },
  { label: "Conferencing Facility", icon: Presentation },
  { label: "Mini bar", icon: Wine },
  { label: "Meeting Room", icon: Shield },
  { label: "Darts", icon: User },
  { label: "Board Games/Puzzles", icon: Puzzle },
  { label: "City Tour", icon: Map },
  { label: "Village Tour", icon: Bike },
  { label: "Indoor Games", icon: Gamepad },
  { label: "Mangunda Safari Cruise", icon: Sailboat },
  { label: "Fishing at shire lake", icon: FishIcon },
  { label: "Leisure time games", icon: Gamepad2 },
  { label: "Village cycle tours", icon: Bike },
  { label: "Kayaking", icon: Kayak },
  { label: "Swimming", icon: Waves },
  { label: "Tennis", icon: Volleyball },
  { label: "Bike Rides", icon: BikeIcon },
  { label: "Beach Soccer, netball and Volleyball", icon: Volleyball },
  { label: "Aerobics", icon: HeartPulse },
];

const serviceIconMap = {
  "Room Service": <ConciergeBellIcon strokeWidth={0.6} size={65} />,
  Restaurant: <Utensils strokeWidth={0.6} size={65} />,
  "Airport Transfers": <Plane strokeWidth={2} size={65} />,
  "Laundry Services": <WashingMachine strokeWidth={1} size={65} />,
  "Free Public Parking": <ParkingCircle strokeWidth={1} size={65} />,
  "VIP Airport Service": <UserCheck strokeWidth={1} size={65} />,
  "Free Wifi": <Wifi strokeWidth={1} size={65} />,
  Babysitting: <Baby strokeWidth={1} size={65} />,
  "Conclerge Services": <HandHelping strokeWidth={1} size={65} />,
  "24hr Front desk": <LoaderCircle strokeWidth={1} size={65} />,
  Boardroom: <Briefcase strokeWidth={1} size={65} />,
  "Wedding Venue": <Gift strokeWidth={1} size={65} />,
  "Spa Service": <Flower strokeWidth={1} size={65} />,
  "Conferencing Facility": <Presentation strokeWidth={1} size={65} />,
  "Mini bar": <Wine strokeWidth={1} size={65} />,
  "Meeting Room": <User strokeWidth={1} size={65} />,
  Darts: <User strokeWidth={1} size={65} />,
  "Board Games/Puzzles": <Puzzle strokeWidth={1} size={65} />,

  "City Tour": <Map strokeWidth={1} size={65} />,
  "Village Tour": <Bike strokeWidth={1} size={65} />,
  "Indoor Games": <Gamepad strokeWidth={1} size={65} />,
  "Mangunda Safari Cruise": <Sailboat strokeWidth={1} size={65} />,
  "Fishing at shire lake": <User strokeWidth={1} size={65} />,
  "Leisure time games": <Gamepad2 strokeWidth={1} size={65} />,
  "Village cycle tours": <Bike strokeWidth={1} size={65} />,
  Kayaking: <Kayak strokeWidth={1} size={65} />,
  Swimming: <Waves strokeWidth={1} size={65} />,
  Tennis: <Volleyball strokeWidth={1} size={65} />,
  "Bike Rides": <BikeIcon strokeWidth={1} size={65} />,
  "Beach Soccer, netball and Volleyball": (
    <Volleyball strokeWidth={1} size={65} />
  ),
  Aerobics: <HeartPulse strokeWidth={1} size={65} />,

  // fallback
  default: <CheckCircle size={16} />,
};
export default function ServiceSection({ hotelId }) {
  const [service, setService] = useState([]);
  const [form, setForm] = useState({
    service_type: [],
  });
  const [editingServiceId, setEditingServiceId] = useState(null);

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef();

  const toggleOption = (value) => {
    const newSelected = form.service_type.includes(value)
      ? form.service_type.filter((item) => item !== value)
      : [...form.service_type, value];

    setForm({ ...form, service_type: newSelected });
  };

  const fetchService =useCallback(async () => {
    const res = await fetch(`/api/services?hotelId=${hotelId}`);
    const data = await res.json();
    console.log("Fetched service:", data.data); // <- add this

    if (data.success) setService(data.data);
  },[hotelId])

  useEffect(() => {
    fetchService();
  }, [fetchService]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="p-6 max-w-xl mx-auto">
      {service.length === 0 && (
        <p className="text-gray-500 text-center">
          No services available for this hotel.
        </p>
      )}

      <h2 className="text-xl font-semibold mt-6">Submitted Service</h2>
      <div className="mt-4 space-y-4">
        {service.map((service) => (
          <div
            key={service._id}
            className="border-b pb-4 flex items-center gap-4"
          >
            <div>
              <h1 className="font-semibold text-gray-600">What's Inside</h1>
              <div className="grid grid-cols-2 pr-10 gap-2 pb-5 mt-2">
                {service?.service_type?.map((service, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center gap-2 2xl:gap-5 text-sm 2xl:text-md text-gray-700 2xl:mt-2 px-5 border-r-2"
                  >
                    {serviceIconMap[service] || serviceIconMap["default"]}
                    <span>{service}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1">
              <div className="space-x-2 mt-2">
                <button
                  onClick={() => handleEdit(service)}
                  className="bg-green-500 text-white px-3 py-1 rounded-md"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(service._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-md"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
