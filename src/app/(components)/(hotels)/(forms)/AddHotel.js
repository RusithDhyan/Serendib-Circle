"use client";
import { UploadCloud } from "lucide-react";
import { useEffect, useState } from "react";

export default function AddHotel({ onClose, editingHotel }) {
  const [hotels, setHotel] = useState([]);
  const [form, setForm] = useState({
    hotel_name: "",
    title: "",
    location: "",
    description: "",
    thumbnail: "",
    image: "",
    cover_image: "",
  });
  const [editingHotelId, setEditingHotelId] = useState(null);

  const fetchHotel = async () => {
    const res = await fetch("/api/hotels");
    const data = await res.json();
    if (data.success) setHotel(data.data);
  };

  useEffect(() => {
    fetchHotel();
  }, []);

  useEffect(() => {
    if (editingHotel) {
      setForm({
        hotel_name: editingHotel.hotel_name || "",
        title: editingHotel.title || "",
        location: editingHotel.location || "",
        description: editingHotel.description || "",
        thumbnail: editingHotel.thumbnail || "",
        image: editingHotel.image || "",
        cover_image: editingHotel.cover_image || "",
      });
      setEditingHotelId(editingHotel._id);
    }
  }, [editingHotel]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("hotel_name", form.hotel_name);
    formData.append("title", form.title);
    formData.append("location", form.location);
    formData.append("description", form.description);

    if (form.thumbnail && typeof form.thumbnail !== "string") {
      formData.append("thumbnail", form.thumbnail);
    }
    if (form.image && typeof form.image !== "string") {
      formData.append("image", form.image);
    }
    if (form.cover_image && typeof form.cover_image !== "string") {
      formData.append("cover_image", form.cover_image);
    }

    let res;
    if (editingHotelId) {
      res = await fetch(`/api/hotels/${editingHotelId}`, {
        method: "PUT",
        body: formData,
      });
    } else {
      res = await fetch("/api/hotels", {
        method: "POST",
        body: formData,
      });
    }

    const result = await res.json();
    if (result.success) {
      setForm({
        hotel_name: "",
        title: "",
        location: "",
        description: "",
        thumbnail: "",
        image: "",
        cover_image: "",
      });
      setEditingHotelId(null);
      fetchHotel();
      onClose();
    } else {
      alert("Error: " + result.error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-4xl">
        <h2 className="text-xl font-bold mb-4 text-center text-blue-800">
          {editingHotelId ? "Edit Hotel" : "Add New Hotel"}
        </h2>

        <form onSubmit={handleSubmit} className="2xl:space-y-4 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left side (Text Inputs) */}
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Hotel Name
                </label>
                <input
                  type="text"
                  name="hotel_name"
                  placeholder="Hotel Name"
                  value={form.hotel_name}
                  onChange={(e) =>
                    setForm({ ...form, hotel_name: e.target.value })
                  }
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  placeholder="Location"
                  value={form.location}
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
                  }
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
            </div>

            {/* Right side (Image Uploads) */}
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Title
                </label>
                <textarea
                  type="text"
                  name="title"
                  placeholder="Title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full h-10 p-2 border rounded-md resize-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  placeholder="Description"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="w-full h-10 p-2 border rounded-md"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col w-full">
            <label className="block text-sm font-semibold mb-1">
              Thumbnail Image
            </label>

            <div className="relative flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md h-20 cursor-pointer hover:border-blue-500 bg-blue-50 transition-colors">
              <input
                type="file"
                name="thumbnail"
                accept="image/*"
                onChange={(e) =>
                  setForm({ ...form, thumbnail: e.target.files[0] })
                }
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />

              <div className="flex flex-col items-center justify-center pointer-events-none ">
                <UploadCloud className="w-8 h-8 text-blue-500" />
                <p className="text-blue-500 text-sm">
                  Click or drag image here
                </p>
                {form.thumbnail && (
                  <p className="text-green-600 text-xs ">
                    Selected: 01 Image
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col w-full">
            <label className="block text-sm font-semibold mb-1">
              Content Image
            </label>

            <div className="relative flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md h-20 cursor-pointer hover:border-blue-500 bg-blue-50 transition-colors">
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />

              <div className="flex flex-col items-center justify-center pointer-events-none">
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
              Cover Image
            </label>

            {/* Dropzone-like wrapper */}
            <div className="relative flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md h-20 cursor-pointer hover:border-blue-500 bg-blue-50 transition-colors">
              <input
                type="file"
                name="cover_image"
                accept="image/*"
                onChange={(e) =>
                  setForm({ ...form, cover_image: e.target.files[0] })
                }
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />

              <div className="flex flex-col items-center justify-center pointer-events-none">
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

          {/* Action Buttons */}
          <div className="flex justify-center gap-10 mt-4">
            <button
              type="submit"
              className="bg-blue-800 text-white px-4 py-2 rounded-md"
            >
              {editingHotelId ? "Update" : "Submit"}
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
