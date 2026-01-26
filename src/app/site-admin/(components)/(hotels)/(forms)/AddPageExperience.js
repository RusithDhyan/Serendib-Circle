"use client";
import { UploadCloud } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export default function AddPageExperience({
  onClose,
  editingExperience,
  hotelId,
}) {
  const [experiences, setExperiences] = useState([]);

  const [form, setForm] = useState({
    image_right: "",
    description_right: "",
    image_left: "",
    description_left: "",
  });
  const [editingExpId, setEditingExpId] = useState(null);
  const [editingExperienceId, setEditingExperienceId] = useState(null);

  const fetchExperience =useCallback(async () => {
    const res = await fetch(`/api/page-exp?hotelId=${hotelId}`);
    const data = await res.json();
    console.log("Fetched experience:", data.data); // <- add this

    if (data.success) setExperiences(data.data);
  },[hotelId])

  useEffect(() => {
    fetchExperience();
  }, [fetchExperience]);

  useEffect(() => {
    if (editingExperience) {
      setForm({
        image_right: editingExperience.image_right || "",
        description_right: editingExperience.description_right || "",
        image_left: editingExperience.image_left || "",
        description_left: editingExperience.description_left || "",
      });
      setEditingExperienceId(editingExperience._id);
    }
  }, [editingExperience]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("hotelId", hotelId);
    if (form.image_right && typeof form.image_right !== "string") {
      formData.append("image_right", form.image_right);
    }
    formData.append("description_right", form.description_right);

    if (form.image_left && typeof form.image_left !== "string") {
      formData.append("image_left", form.image_left);
    }
    formData.append("description_left", form.description_left);

    let res;
    if (editingExperienceId) {
      res = await fetch(`/api/page-exp/${editingExperienceId}`, {
        method: "PUT",
        body: formData,
      });
    } else {
      res = await fetch("/api/page-exp", {
        method: "POST",
        body: formData,
      });
    }

    const result = await res.json();
    if (result.success) {
      setForm({
        image_right: "",
        description_right: "",
        image_left: "",
        description_left: "",
      });
      setEditingExperienceId(null);
      fetchExperience();
      onClose();
    } else {
      alert("Error: " + result.error);
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-4xl">
        <h1 className="text-2xl text-center font-bold mb-4 text-blue-800">
          {editingExperienceId ? "Edit Experience" : "Add New Experience"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold">
                Right-side Description
              </label>

              <textarea
                type="text"
                name="description_right"
                placeholder="Description Right"
                value={form.description_right}
                onChange={(e) =>
                  setForm({ ...form, description_right: e.target.value })
                }
                className="w-full h-20 p-2 border rounded"
                required
              />
            </div>
            <div className="flex flex-col w-full">
              <label className="block text-sm font-semibold mb-1">
                Right-Side Image
              </label>

              <div className="relative flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md h-20 cursor-pointer hover:border-blue-500 bg-blue-50 transition-colors">
                <input
                  type="file"
                  name="image_right"
                  accept="image/*"
                  onChange={(e) =>
                    setForm({ ...form, image_right: e.target.files[0] })
                  }
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                <div className="flex flex-col items-center justify-center pointer-events-none ">
                  <UploadCloud className="w-8 h-8 text-blue-500" />
                  <p className="text-blue-500 text-sm">
                    Click or drag image here
                  </p>
                  {form.image_right && (
                    <p className="text-green-600 text-xs">Selected: 01 Image</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col w-full">
              <label className="block text-sm font-semibold mb-1">
                Left-Side Image
              </label>

              <div className="relative flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md h-20 cursor-pointer hover:border-blue-500 bg-blue-50 transition-colors">
                <input
                  type="file"
                  name="left_image"
                  accept="image/*"
                  onChange={(e) =>
                    setForm({ ...form, image_left: e.target.files[0] })
                  }
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                <div className="flex flex-col items-center justify-center pointer-events-none ">
                  <UploadCloud className="w-8 h-8 text-blue-500" />
                  <p className="text-blue-500 text-sm">
                    Click or drag image here
                  </p>
                  {form.image_left && (
                    <p className="text-green-600 text-xs">Selected: 01 Image</p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold">
                Left-Side Description
              </label>
              <textarea
                type="text"
                name="description_left"
                placeholder="Description Left"
                value={form.description_left}
                onChange={(e) =>
                  setForm({ ...form, description_left: e.target.value })
                }
                className="w-full h-20 p-2 border rounded-md"
                required
              />
            </div>
          </div>

          <div className="flex justify-center gap-10">
            <button
              type="submit"
              className="bg-blue-800 text-white px-4 py-2 rounded-md"
            >
              {editingExperienceId ? "Update" : "Submit"}
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
