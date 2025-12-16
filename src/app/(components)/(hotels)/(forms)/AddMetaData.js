"use client";
import { useEffect, useState } from "react";

export default function AddMetaData({ onClose, editingMetaData }) {
  const [offers, setOffer] = useState([]);
  const [form, setForm] = useState({
    meta_title: "",
    meta_description: "",
  });
  const [editingMetaDataId, setEditingMetaDataId] = useState(null);
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

  const fetchMetaData = async (hotelId) => {
    const res = await fetch(`/api/meta?hotelId=${hotelId}`);
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
    if (editingMetaData) {
      setForm({
        meta_title: editingMetaData.meta_title || "",
        meta_description: editingMetaData.meta_description || "",
      });
      setEditingMetaDataId(editingMetaData._id);
    }
  }, [editingMetaData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("hotelId", selectedHotelId);
    formData.append("meta_title", form.meta_title);
    formData.append("meta_description", form.meta_description);

    let res;
    if (editingMetaDataId) {
      res = await fetch(`/api/meta/${editingMetaDataId}`, {
        method: "PUT",
        body: formData,
      });
    } else {
      res = await fetch("/api/meta", {
        method: "POST",
        body: formData,
      });
    }

    const result = await res.json();
    if (result.success) {
      setForm({
        meta_title: "",
        meta_description: "",
      });
      setEditingMetaDataId(null);
      fetchMetaData(selectedHotelId);
      onClose();
    } else {
      alert("Error: " + result.error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-2xl">
        <h2 className="text-xl font-bold mb-4 text-center text-blue-800">
          {editingMetaDataId ? "Edit Meta Data" : "Add Hotel Meta Data"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
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
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-semibold">
                  Meta Title
                </label>
                <input
                  type="text"
                  name="meta_title"
                  placeholder="Meta Title"
                  value={form.meta_title}
                  onChange={(e) =>
                    setForm({ ...form, meta_title: e.target.value })
                  }
                  className="w-full p-2 border rounded-md"
                  // required
                />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold">
              Meta Description
            </label>
            <textarea
              type="text"
              name="meta_description"
              placeholder="Meta Description"
              value={form.meta_description}
              onChange={(e) =>
                setForm({ ...form, meta_description: e.target.value })
              }
              className="w-full p-2 border rounded-md resize-none"
              // required
            />
          </div>

          <div className="flex justify-center gap-10">
            <button
              type="submit"
              className="bg-blue-800 text-white px-4 py-2 rounded-md"
            >
              {editingMetaDataId ? "Update" : "Submit"}
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
