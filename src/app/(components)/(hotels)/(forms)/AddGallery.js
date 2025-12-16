"use client";
import { UploadCloud } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export default function AddGallery({ onClose, editingGallery, hotelId }) {
  const [galleries, setGallery] = useState([]);

  const [form, setForm] = useState({
    image_slider: [],
  });
  const [editingGalId, setEditingGalId] = useState(null);
  const [editingGalleryId, setEditingGalleryId] = useState(null);

  const fetchGallery = useCallback(async () => {
    const res = await fetch(`/api/gallery?hotelId=${hotelId}`);
    const data = await res.json();
    console.log("fetched galleries..", data);
    if (data.success) setGallery(data.data);
  },[hotelId])

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  useEffect(() => {
    if (editingGallery) {
      setForm({
        image_slider: editingGallery.image_slider || "",
      });
      setEditingGalleryId(editingGallery._id);
    }
  }, [editingGallery]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("hotelId", hotelId);
    if (form.image_slider && form.image_slider.length > 0) {
      form.image_slider.forEach((img) => {
        formData.append("image_slider", img); // NOTE: "images" matches API handler
      });
    }

    let res;
    if (editingGalleryId) {
      res = await fetch(`/api/gallery/${editingGalleryId}`, {
        method: "PUT",
        body: formData,
      });
    } else {
      res = await fetch("/api/gallery", {
        method: "POST",
        body: formData,
      });
    }

    const result = await res.json();
    if (result.success) {
      setForm({
        image_slider: "",
      });
      setEditingGalleryId(null);
      fetchGallery();
      onClose();
    } else {
      alert("Error: " + result.error);
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-4xl">
        <h1 className="text-2xl text-center font-bold mb-4 text-blue-800">
          {editingGalleryId ? "Edit Gallery" : "Add New Gallery"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col w-full">
            <label className="block text-sm font-semibold mb-1">
              Gallery Images
            </label>

            <div className="relative flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md h-40 cursor-pointer hover:border-blue-500 bg-blue-50 transition-colors">
              <input
                type="file"
                name="image_slider"
                accept="image/*"
                multiple
                onChange={(e) =>
                  setForm({
                    ...form,
                    image_slider: Array.from(e.target.files),
                  })
                }
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />

              <div className="flex flex-col items-center justify-center pointer-events-none">
                <UploadCloud className="w-10 h-10 text-blue-500" />
                <p className="text-blue-500 text-sm">
                  Click or drag images here
                </p>

                {form.image_slider?.length > 0 && (
                  <div className="grid grid-col-3 gap-2 mt-2 text-green-600 text-xs text-center">
                      <p>Selected: {form.image_slider.length}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-10">
            <button
              type="submit"
              className="bg-blue-800 text-white px-4 py-2 rounded-md"
            >
              {editingGalleryId ? "Update" : "Submit"}
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
