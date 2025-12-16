"use client";
import { useCallback, useEffect, useState } from "react";

import {
  Baby,
  BedIcon,
  Bike,
  BikeIcon,
  BookUser,
  Briefcase,
  Building,
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
  Target,
  TicketsPlane,
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
import { useRef } from "react";

const optionsWithIcons = [
  { label: "Room Service", icon: ConciergeBellIcon },
  { label: "Restaurant", icon: Utensils },
  { label: "Airport Transfers", icon: Plane },
  { label: "Laundry Services", icon: WashingMachine },
  { label: "Free Public Parking", icon: ParkingCircle },
  { label: "VIP Airport Service", icon: TicketsPlane },
  { label: "Free Wifi", icon: Wifi },
  { label: "Babysitting", icon: Baby },
  { label: "Conclerge Services", icon: ConciergeBellIcon },
  { label: "24hr Front desk", icon: LoaderCircle },
  { label: "Boardroom", icon: Briefcase },
  { label: "Wedding Venue", icon: Gift },
  { label: "Spa Service", icon: BedIcon },
  { label: "Conferencing Facility", icon: Presentation },
  { label: "Mini bar", icon: Wine },
  { label: "Meeting Room", icon: Building },
  { label: "Darts", icon: Target },
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
  "Restaurant": <Utensils strokeWidth={0.6} size={65} />,
  "Airport Transfers": <Plane strokeWidth={2} size={65} />,
  "Laundry Services": <WashingMachine strokeWidth={1} size={65} />,
  "Free Public Parking": <ParkingCircle strokeWidth={1} size={65} />,
  "VIP Airport Service": <TicketsPlane strokeWidth={1} size={65} />,
  "Free Wifi": <Wifi strokeWidth={1} size={65} />,
  "Babysitting": <Baby strokeWidth={1} size={65} />,
  "Conclerge Services": <HandHelping strokeWidth={1} size={65} />,
  "24hr Front desk": <LoaderCircle strokeWidth={1} size={65} />,
  "Boardroom": <Briefcase strokeWidth={1} size={65} />,
  "Wedding Venue": <Gift strokeWidth={1} size={65} />,
  "Spa Service": <Flower strokeWidth={1} size={65} />,
  "Conferencing Facility": <Presentation strokeWidth={1} size={65} />,
  "Mini bar": <Wine strokeWidth={1} size={65} />,
  "Meeting Room": <Building strokeWidth={1} size={65} />,
  "Darts": <Target strokeWidth={1} size={65} />,
  "Board Games/Puzzles": <Puzzle strokeWidth={1} size={65} />,
  "City Tour": <Map strokeWidth={1} size={65} />,
  "Village Tour": <Bike strokeWidth={1} size={65} />,
  "Indoor Games": <Gamepad strokeWidth={1} size={65} />,
  "Mangunda Safari Cruise": <Sailboat strokeWidth={1} size={65} />,
  "Fishing at shire lake": <FishIcon strokeWidth={1} size={65} />,
  "Leisure time games": <Gamepad2 strokeWidth={1} size={65} />,
  "Village cycle tours": <Bike strokeWidth={1} size={65} />,
  "Kayaking": <Kayak strokeWidth={1} size={65} />,
  "Swimming": <Waves strokeWidth={1} size={65} />,
  "Tennis": <Volleyball strokeWidth={1} size={65} />,
  "Bike Rides": <BikeIcon strokeWidth={1} size={65} />,
  "Beach Soccer, netball and Volleyball": (
    <Volleyball strokeWidth={1} size={65} />
  ),
  Aerobics: <HeartPulse strokeWidth={1} size={65} />,

  // fallback
  default: <CheckCircle size={16} />,
};

export default function AddService({ onClose, editingService, hotelId }) {
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

  useEffect(() => {
    if (editingService) {
      setForm({
        service_type: editingService.service_type || [""],
      });
      setEditingServiceId(editingService._id);
    }
  }, [editingService]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Submitted:", form);

    const formData = new FormData();
    formData.append("hotelId", hotelId);

    if (form.service_type && form.service_type.length > 0) {
      form.service_type.forEach((service) => {
        formData.append("service_type", service);
      });
    }

    let res;
    if (editingServiceId) {
      // Update existing service
      res = await fetch(`/api/services/${editingServiceId}`, {
        method: "PUT",
        body: formData,
      });
    } else {
      // Create new service
      res = await fetch("/api/services", {
        method: "POST",
        body: formData,
      });
    }

    const result = await res.json();

    if (result.success) {
      setForm({ service_type: [] });
      fetchService();
      onClose();
    } else {
      alert("Error: " + result.message || result.error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-4xl overflow-y-auto max-h-[90vh]">
        <h1 className="text-2xl text-center font-bold mb-4 text-blue-800">
          {editingServiceId ? "Edit Service" : "Add New Service"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4 h-auto">
          <div>
            <label className="block text-sm font-semibold">Services</label>
            <div className="relative w-full py-2" ref={dropdownRef}>
              <div
                onClick={() => setIsOpen(!isOpen)}
                className="border p-2 rounded cursor-pointer bg-white"
              >
                {form.service_type.length > 0
                  ? form.service_type.join(", ")
                  : "Select Services"}
              </div>

              {isOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-md max-h-60 overflow-y-auto">
                  {optionsWithIcons.map(({ label, icon: Icon }) => (
                    <label
                      key={label}
                      className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={form.service_type.includes(label)}
                        onChange={() => toggleOption(label)}
                        className="mr-2"
                      />
                      <Icon className="w-4 h-4 text-red-300" />
                      {label}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-5">
            <button
              type="submit"
              className="bg-blue-800 text-white px-4 py-2 rounded-md"
            >
              {editingServiceId ? "Update" : "Submit"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
