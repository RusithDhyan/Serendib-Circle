"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Antenna,
  Bath,
  Bed,
  BedDouble,
  BedSingle,
  Beer,
  Box,
  Briefcase,
  Brush,
  Clock,
  CloudSun,
  Coffee,
  CupSoda,
  DoorOpen,
  Flame,
  ForkKnife,
  LampDesk,
  Lock,
  Monitor,
  Phone,
  PillBottle,
  Refrigerator,
  Shell,
  Shield,
  ShowerHead,
  Snowflake,
  SoapDispenserDroplet,
  Sofa,
  Thermometer,
  Tv,
  Tv2,
  UploadCloud,
  Utensils,
  Wifi,
} from "lucide-react";
import Image from "next/image";

const optionsWithIcons = [
  { label: "Private Bathroom with Shower", icon: Bath },
  { label: "Kitchen Utensils", icon: Utensils },
  { label: "Flat-Screen TV", icon: Tv },
  { label: "Air Condition", icon: Snowflake },
  { label: "Hot Water", icon: Thermometer },
  { label: "Tea & Coffee", icon: Coffee },
  { label: "Mini Fridge", icon: Refrigerator },
  { label: "Complimentary Wi-Fi", icon: Wifi },
  { label: "Additional Twin-Bed Room", icon: Bed },
  { label: "Queen Bed", icon: Bed },
  { label: "King Size Bed", icon: BedDouble },
  {label: "1x Queen Size Bed", icon: BedDouble},
  {label: "2x Single Beds", icon: BedSingle},
  { label: "Double Bed", icon: Bed },
  { label: "Ensuite Bathroom", icon: Bath },
  { label: "Toiletries", icon: SoapDispenserDroplet },
   {
    label: "Bathrobe",
    icon: (props) => (
      <Image
        src="/all-images/icons/bathrobe.png"
        alt="Bathrobe"
        width={250}
        height={25}
        {...props}
      />
    ),
  },
  { label: "In-room Safe", icon: Shield },
  { label: "Mini Bar", icon: Beer },
  { label: "Bottled Water", icon: PillBottle },
  { label: "Telephone", icon: Phone },
  { label: "24/7 Front Desk", icon: Clock },
  { label: "Tv with Stand", icon: Tv2 },
  { label: "Sitting area & Lounge chair", icon: Sofa },
  { label: "Dining Set", icon: ForkKnife },
  { label: "Microwave", icon: Monitor },
  { label: "Cooker or mini Cooker", icon: Flame },
  { label: "Tea Station", icon: CupSoda },
  { label: "Luggage Rack", icon: Briefcase },
  { label: "Wardrobe", icon: Box },
  { label: "Dressing table with chair", icon: Brush },
  { label: "Hair Dryer", icon: CloudSun },
  { label: "Hand Driers", icon: CloudSun },
  { label: "Office desk & chair", icon: LampDesk },
  { label: "Safe Box", icon: Lock },
  { label: "Unlimited Internet Access", icon: Antenna },
  { label: "Private Balcony", icon: DoorOpen },
  { label: "Drawer & Writing Table", icon: LampDesk},
  { label: "Towels", icon: Shell},
  {label: "Shower Gel, Body Lotion, Guest Soap, Mirror", icon:ShowerHead}

];

export default function AddAccommodation({
  onClose,
  editingAccommodation,
  hotelId,
}) {
  const [accommodation, setAccommodations] = useState([]);
  const [form, setForm] = useState({
    room_type: "",
    price: "",
    size: "",
    description: "",
    image: "",
    images: [],
    spec_type: [],
  });
  const [editingAccommodationId, setEditingAccommodationId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef();

  const toggleOption = (value) => {
    const newSelected = form.spec_type.includes(value)
      ? form.spec_type.filter((item) => item !== value)
      : [...form.spec_type, value];

    setForm({ ...form, spec_type: newSelected });
  };

  const fetchAccommodation = useCallback(async () => {
    const res = await fetch(`/api/accommodation?hotelId=${hotelId}`);
    const data = await res.json();
    console.log("Fetched accommodations:", data.data);

    if (data.success) setAccommodations(data.data);
  },[hotelId])

  useEffect(() => {
    fetchAccommodation();
  }, [fetchAccommodation]);

  useEffect(() => {
    if (editingAccommodation) {
      setForm({
        room_type: editingAccommodation.room_type || "",
        price: editingAccommodation.price || "",
        size: editingAccommodation.size || "",
        description: editingAccommodation.description || "",
        image: editingAccommodation.image || "",
        images: editingAccommodation.images || "",
        spec_type: editingAccommodation.spec_type || "",
      });
      setEditingAccommodationId(editingAccommodation._id);
    }
  }, [editingAccommodation]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("hotelId", hotelId);
    formData.append("room_type", form.room_type);
    formData.append("price", form.price);
    formData.append("size", form.size);
    formData.append("description", form.description);

    if (form.image && typeof form.image !== "string") {
      formData.append("image", form.image);
    }
    if (form.images && form.images.length > 0) {
      form.images.forEach((img) => {
        formData.append("images", img); // NOTE: "images" matches API handler
      });
    }
    if (form.spec_type && form.spec_type.length > 0) {
      form.spec_type.forEach((spec) => {
        formData.append("spec_type", spec); // NOTE: "images" matches API handler
      });
    }

    let res;
    if (editingAccommodationId) {
      res = await fetch(`/api/accommodation/${editingAccommodationId}`, {
        method: "PUT",
        body: formData,
      });
    } else {
      res = await fetch("/api/accommodation", {
        method: "POST",
        body: formData,
      });
    }

    const result = await res.json();
    if (result.success) {
      setForm({
        room_type: "",
        price: "",
        size: "",
        description: "",
        image: "",
        images: [],
        spec_type: "",
      });
      setEditingAccommodationId(null);
      fetchAccommodation();
      onClose();
    } else {
      alert("Error: " + result.error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-4xl">
        <h2 className="text-xl font-bold mb-4 text-center text-blue-800">
          {editingAccommodationId
            ? "Edit Accommodation"
            : "Add New Accommodation"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold">Room Type</label>
              <input
                type="text"
                name="room_type"
                placeholder="Room Type"
                value={form.room_type}
                onChange={(e) =>
                  setForm({ ...form, room_type: e.target.value })
                }
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">Price</label>
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">Room Size</label>
              <input
                type="number"
                name="size"
                placeholder="Size"
                value={form.size}
                onChange={(e) => setForm({ ...form, size: e.target.value })}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">Room Specs</label>
              <div className="relative w-full" ref={dropdownRef}>
                <div
                  onClick={() => setIsOpen(!isOpen)}
                  className="border p-2 rounded-md cursor-pointer bg-white"
                >
                  {form.spec_type.length > 0
                    ? form.spec_type.join(", ")
                    : "Select specifications"}
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
                          checked={form.spec_type.includes(label)}
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
            <div className="flex flex-col w-full">
              <label className="block text-sm font-semibold mb-1">
                Room Image
              </label>

              <div className="relative flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md h-30 cursor-pointer hover:border-blue-500 bg-blue-50 transition-colors">
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={(e) =>
                    setForm({ ...form, image: e.target.files[0] })
                  }
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                <div className="flex flex-col items-center justify-center pointer-events-none ">
                  <UploadCloud className="w-8 h-8 text-blue-500" />
                  <p className="text-blue-500 text-sm">
                    Click or drag image here
                  </p>
                  {form.image && (
                    <h1 className="text-green-600 text-xs">
                      <p>Selected: 1 image</p>
                    </h1>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col w-full">
              <label className="block text-sm font-semibold mb-1">
                Slider Images
              </label>

              <div className="relative flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md h-30 cursor-pointer hover:border-blue-500 bg-blue-50 transition-colors">
                <input
                  type="file"
                  name="images"
                  accept="image/*"
                  multiple
                  onChange={(e) =>
                    setForm({
                      ...form,
                      images: Array.from(e.target.files), // ✅ convert FileList to array
                    })
                  }
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                <div className="flex flex-col items-center justify-center pointer-events-none">
                  <UploadCloud className="w-8 h-8 text-blue-500" />
                  <p className="text-blue-500 text-sm">
                    Click or drag images here
                  </p>

                  {form.images?.length > 0 && (
                    <div className=" text-green-600 text-xs text-center">
                      <p>Selected: {form.images.length} Images</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold">Description</label>
            <textarea
              type="text"
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div className="flex justify-center gap-10">
            <button
              type="submit"
              className="bg-blue-800 text-white px-4 py-2 rounded-md"
            >
              {editingAccommodationId ? "Update" : "Submit"}
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
