"use client";

import { UploadCloud } from "lucide-react";
import { useEffect, useState } from "react";

export default function AddAnyOffer({ onClose, editingOffer }) {
  const [offers, setOffer] = useState([]);
  const [form, setForm] = useState({
    offer_type: "",
    title: "",
    main_description: "",
    description: "",
    image: "",
    bg_image: "",
    cover_image: "",
    bulletPoints: [],
  });
  const [editingOfferId, setEditingOfferId] = useState(null);
  const [hotels, setHotels] = useState([]);
  const [selectedHotelId, setSelectedHotelId] = useState(null);
  const [selectedHotel, setSelectedHotel] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    fetch("/api/hotels")
      .then((res) => res.json())
      .then((data) => {
        setHotels(data.data);
        setVisible(true);
      });
  }, []);

  const fetchOffer = async (hotelId) => {
    const res = await fetch(`/api/offer?hotelId=${hotelId}`);
    const data = await res.json();
    console.log("Fetched Offer:", data.data);
    if (data.success) setOffer(data.data);
  };

  const handleSelectChange = (e) => {
    const id = e.target.value;
    setSelectedHotelId(id);
    const hotelObj = hotels.find((hotel) => hotel._id === id);
    setSelectedHotel(hotelObj ? hotelObj.hotel_name : "");
  };

  useEffect(() => {
    if (editingOffer) {
      setForm({
        offer_type: editingOffer.offer_type || "",
        title: editingOffer.title || "",
        main_description: editingOffer.main_description || "",
        description: editingOffer.description || "",
        image: editingOffer.image || "",
        bg_image: editingOffer.bg_image || "",
        cover_image: editingOffer.cover_image || "",
        bulletPoints: editingOffer.bulletPoints || [""],
      });
      setEditingOfferId(editingOffer._id);
    }
  }, [editingOffer]);

  const handleBulletChange = (value, index) => {
    const newBullets = [...form.bulletPoints];
    newBullets[index] = value;
    setForm({ ...form, bulletPoints: newBullets });
  };

  const addBullet = () => {
    setForm({ ...form, bulletPoints: [...form.bulletPoints, ""] });
  };

  const removeBullet = (index) => {
    const newBullets = form.bulletPoints.filter((_, i) => i !== index);
    setForm({ ...form, bulletPoints: newBullets });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("hotelId", selectedHotelId);
    formData.append("offer_type", form.offer_type);
    formData.append("title", form.title);
    formData.append("main_description", form.main_description);
    formData.append("description", form.description);

    if (form.image && typeof form.image !== "string") {
      formData.append("image", form.image);
    }
    if (form.bg_image && typeof form.bg_image !== "string") {
      formData.append("bg_image", form.bg_image);
    }
    if (form.cover_image && typeof form.cover_image !== "string") {
      formData.append("cover_image", form.cover_image);
    }

    // Append bullet points as JSON string
    formData.append("bulletPoints", JSON.stringify(form.bulletPoints));

    let res;
    if (editingOfferId) {
      res = await fetch(`/api/offer/${editingOfferId}`, {
        method: "PUT",
        body: formData,
      });
    } else {
      res = await fetch("/api/offer", {
        method: "POST",
        body: formData,
      });
    }

    const result = await res.json();
    if (result.success) {
      setForm({
        offer_type: "",
        title: "",
        main_description: "",
        description: "",
        image: "",
        bg_image: "",
        cover_image: "",
        bulletPoints: [""],
      });
      setEditingOfferId(null);
      fetchOffer();
      onClose();
    } else {
      alert("Error: " + result.error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-4xl">
        <h2 className="text-xl font-bold mb-4 text-center text-blue-800">
          {editingOfferId ? "Edit Offer" : "Add New Offer"}
        </h2>

        <form onSubmit={handleSubmit} className="sm:space-y-0 2xl:space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-semibold">
                  Select Hotel
                </label>
                <select
                  onChange={handleSelectChange}
                  value={selectedHotelId || ""}
                  required
                  className="w-full p-2.5 rounded-md border"
                >
                  <option value="" disabled>
                    -- Choose Hotel --
                  </option>
                  {hotels.map((hotel) => (
                    <option key={hotel._id} value={hotel._id}>
                      {hotel.hotel_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold">
                  Select Type
                </label>
                <select
                  name="offer_type"
                  value={form.offer_type}
                  onChange={(e) =>
                    setForm({ ...form, offer_type: e.target.value })
                  }
                  className="w-full p-2.5 border rounded-md"
                  required
                >
                  <option value="" disabled>-- Select Offer Type --</option>
                  <option value="Activities">Activities</option>
                  <option value="Accomodation Promo">Accomodation Promo</option>
                  <option value="Special Activities">Special Activities</option>
                  <option value="Journey Combo">Journey Combo Offer</option>
                  <option value="Mother's Day Promo">Mother's Day Promo</option>
                </select>
              </div>
              
            </div>
            <div className="flex flex-col gap-4">
              
              <div>
                <label className="block text-sm font-semibold">Title</label>
                <input
                  type="text"
                  name="title"
                  placeholder="Title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full p-2 border rounded-md"
                  // required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold">
                  Main Description
                </label>
                <textarea
                  type="text"
                  name="main_description"
                  placeholder="Main Description"
                  value={form.main_description}
                  onChange={(e) =>
                    setForm({ ...form, main_description: e.target.value })
                  }
                  className="w-full h-10 p-2 border rounded-md"
                />
              </div>
            </div>
            
            <div className="flex flex-col w-full">
              <label className="block text-sm font-semibold mb-1">
                Thumbnail Image
              </label>

              <div className="relative flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md 2xl:h-20 cursor-pointer hover:border-blue-500 bg-blue-50 transition-colors">
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
                    <p className="text-green-600 text-xs ">
                      Selected: 01 Image
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col w-full">
              <label className="block text-sm font-semibold mb-1">
                Background Image
              </label>

              <div className="relative flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md 2xl:h-20 cursor-pointer hover:border-blue-500 bg-blue-50 transition-colors">
                <input
                  type="file"
                  name="bg_image"
                  accept="image/*"
                  onChange={(e) =>
                    setForm({ ...form, bg_image: e.target.files[0] })
                  }
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                <div className="flex flex-col items-center justify-center pointer-events-none ">
                  <UploadCloud className="w-8 h-8 text-blue-500" />
                  <p className="text-blue-500 text-sm">
                    Click or drag image here
                  </p>
                  {form.bg_image && (
                    <p className="text-green-600 text-xs ">
                      Selected: 01 Image
                    </p>
                  )}
                </div>
              </div>
            </div>
            
          </div>
          <div className="flex flex-col w-full">
              <label className="block text-sm font-semibold mb-1">
                Cover Image
              </label>

              <div className="relative flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md 2xl:h-30 cursor-pointer hover:border-blue-500 bg-blue-50 transition-colors">
                <input
                  type="file"
                  name="cover_image"
                  accept="image/*"
                  onChange={(e) =>
                    setForm({ ...form, cover_image: e.target.files[0] })
                  }
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                <div className="flex flex-col items-center justify-center pointer-events-none ">
                  <UploadCloud className="w-8 h-8 text-blue-500" />
                  <p className="text-blue-500 text-sm">
                    Click or drag image here
                  </p>
                  {form.cover_image && (
                    <p className="text-green-600 text-xs ">
                      Selected: 01 Image
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div>
                <label className="block text-sm font-semibold">
                  Description
                </label>
                <textarea
                  type="text"
                  name="description"
                  placeholder="Description"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="w-full p-2 border rounded-md"
                  // required
                />
              </div>

          <div className="space-y-2 flex flex-col">
            <label className="">Bullet Points (Inclusions)</label>
            {form.bulletPoints.map((point, index) => (
              <div key={index} className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder={`Bullet Point ${index + 1}`}
                  value={point}
                  onChange={(e) => handleBulletChange(e.target.value, index)}
                  className="flex-1 p-2 border rounded-md"
                  // required
                />
                {form.bulletPoints.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeBullet(index)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md"
                  >
                    X
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addBullet}
              className="bg-blue-800 text-white px-4 py-2 rounded-md hover:bg-blue-900 transition"
            >
              + Add Bullet
            </button>
          </div>

          <div className="flex justify-center gap-10 mt-2">
            <button
              type="submit"
              className="bg-blue-800 text-white px-4 py-2 rounded-md"
            >
              {editingOfferId ? "Update" : "Submit"}
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
