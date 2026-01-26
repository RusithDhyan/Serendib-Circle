"use client";
import { UploadCloud } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export default function AddOffer({ onClose, editingOffer, hotelId }) {
  const [offers, setOffers] = useState([]);

  const [form, setForm] = useState({
    offer_type: "",
    title: "",
    main_description: "",
    main_description: "",
    description: "",
    image: "",
    bg_image: "",
    cover_image: "",
    bulletPoints: [],
  });
  const [editingOfferId, setEditingOfferId] = useState(null);

  const fetchOffer =useCallback(async () => {
    const res = await fetch(`/api/offer?hotelId=${hotelId}`);
    const data = await res.json();
    if (data.success) setOffers(data.data);
  },[hotelId])

  useEffect(() => {
    fetchOffer();
  }, [fetchOffer]);

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
    formData.append("hotelId", hotelId);
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
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-4xl overflow-y-auto max-h-[90vh]">
        <h1 className="text-2xl text-center font-bold mb-4 text-blue-800">
          {editingOfferId ? "Edit Offer" : "Add New Offer"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-semibold">
                  Offer Type
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
                  <option value="">Select Offer Type</option>
                  <option value="Activities">Activities</option>
                  <option value="Accomodation Promo">Accomodation Promo</option>
                  <option value="Special Activities">Special Activities</option>
                  <option value="Journey Combo">Journey Combo Offer</option>
                  <option value="Mother's Day Promo">Mother's Day Promo</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold">Title</label>
                <input
                  type="text"
                  name="title"
                  placeholder="Title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full p-2 border rounded-md"
                  required
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
                  className="w-full p-2 h-10 border rounded-md"
                />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col w-full">
                <label className="block text-sm font-semibold">
                  Thumbnail Image
                </label>

                <div className="relative flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md h-10 cursor-pointer hover:border-blue-500 bg-blue-50 transition-colors">
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={(e) =>
                      setForm({ ...form, image: e.target.files[0] })
                    }
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />

                  <div className="flex items-center justify-center gap-2 pointer-events-none ">
                    <UploadCloud className="w-4 h-4 text-blue-500" />
                    <p className="text-gray-500 text-xs">
                      Click or drag image here
                    </p>
                    {form.image && (
                      <p className="text-green-600 text-xs">
                        Selected: 01 Image
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col w-full">
                <label className="block text-sm font-semibold">
                  Background Image
                </label>

                <div className="relative flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md h-10 cursor-pointer hover:border-blue-500 bg-blue-50 transition-colors">
                  <input
                    type="file"
                    name="bg_image"
                    accept="image/*"
                    onChange={(e) =>
                      setForm({ ...form, bg_image: e.target.files[0] })
                    }
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />

                  <div className="flex items-center justify-center gap-2 pointer-events-none ">
                    <UploadCloud className="w-4 h-4 text-blue-500" />
                    <p className="text-gray-500 text-xs">
                      Click or drag image here
                    </p>
                    {form.bg_image && (
                      <p className="text-green-600 text-xs">
                        Selected: 01 Image
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col w-full">
                <label className="block text-sm font-semibold">
                  Cover Image
                </label>

                <div className="relative flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md h-10 cursor-pointer hover:border-blue-500 bg-blue-50 transition-colors">
                  <input
                    type="file"
                    name="cover_image"
                    accept="image/*"
                    onChange={(e) =>
                      setForm({ ...form, cover_image: e.target.files[0] })
                    }
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />

                  <div className="flex items-center justify-center gap-2 pointer-events-none ">
                    <UploadCloud className="w-4 h-4 text-blue-500" />
                    <p className="text-gray-500 text-xs">
                      Click or drag image here
                    </p>
                    {form.cover_image && (
                      <p className="text-green-600 text-xs">
                        Selected: 01 Image
                      </p>
                    )}
                  </div>
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
              className="w-full border p-2 rounded-md"
              required
            />
          </div>

          {/* Bullet Points */}
          <div className="space-y-2 flex flex-col">
            <label className="font-semibold">Bullet Points</label>
            {form.bulletPoints.map((point, index) => (
              <div key={index} className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder={`Bullet Point ${index + 1}`}
                  value={point}
                  onChange={(e) => handleBulletChange(e.target.value, index)}
                  className="flex-1 p-2 border rounded"
                  // required
                />
                {form.bulletPoints.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeBullet(index)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    X
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addBullet}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-800 transition"
            >
              + Add Bullet
            </button>
          </div>

          {/* Submit / Cancel */}
          <div className="flex justify-center gap-10">
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
