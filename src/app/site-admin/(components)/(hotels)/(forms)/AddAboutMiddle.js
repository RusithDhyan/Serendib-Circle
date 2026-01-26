"use client";
import { generateChecksum } from "@/lib/fetchData";
import { UploadCloud } from "lucide-react";
import { useEffect, useState } from "react";

export default function AddAboutMiddle({ onClose, editingAboutMiddle }) {
  const [aboutContent, setAboutMiddle] = useState([]);
  const [form, setForm] = useState({
    card_title: "",
    card_description: "",
    card_image: "",
  });
  const [editingAboutMiddleId, setEditingAboutMiddleId] = useState(null);

  const fetchAboutMiddle = async () => {
    const res = await fetch("/api/about-middle");
    const data = await res.json();
    if (data.success) setAboutMiddle(data.data);
  };

  useEffect(() => {
    fetchAboutMiddle();
  }, []);

  useEffect(() => {
    if (editingAboutMiddle) {
      setForm({
        card_title: editingAboutMiddle.card_title || "",
        card_description: editingAboutMiddle.card_description || "",

        card_image: editingAboutMiddle.card_image || "",
      });
      setEditingAboutMiddleId(editingAboutMiddle._id);
    }
  }, [editingAboutMiddle]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const t = Date.now().toString();
    const cs = await generateChecksum(t);

    const formData = new FormData();
    formData.append("card_title", form.card_title);
    formData.append("card_description", form.card_description);

    if (form.card_image && typeof form.card_image !== "string") {
      formData.append("card_image", form.card_image);
    }

    let res;
    if (editingAboutMiddleId) {
      res = await fetch(
        `/api/site-admin/about-middle/${editingAboutMiddleId}?t=${t}&cs=${cs}`,
        {
          method: "PUT",
          body: formData,
        }
      );
    } else {
      res = await fetch(`/api/site-admin/about-middle?t=${t}&cs=${cs}`, {
        method: "POST",
        body: formData,
      });
    }

    const result = await res.json();
    if (result.success) {
      setForm({
        card_title: "",
        card_description: "",
        card_image: "",
      });
      setEditingAboutMiddleId(null);
      fetchAboutMiddle();
      onClose();
    } else {
      alert("Error: " + result.error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-4xl">
        <h2 className="text-xl text-center font-bold mb-4 text-blue-800">
          {editingAboutMiddleId
            ? "Edit About Content-Middle"
            : "Add New About Content-Middle"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold">Card Title</label>
              <input
                type="text"
                name="card_title"
                placeholder="Card Title"
                value={form.card_title}
                onChange={(e) =>
                  setForm({ ...form, card_title: e.target.value })
                }
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">
                Card Description
              </label>
              <textarea
                type="text"
                name="card_description"
                placeholder="Card Description"
                value={form.card_description}
                onChange={(e) =>
                  setForm({ ...form, card_description: e.target.value })
                }
                className="w-full p-2 h-10 border rounded-md resize-none"
              />
            </div>
          </div>
          <div className="flex flex-col w-full">
            <label className="block text-sm font-semibold mb-1">
              Card Image
            </label>

            <div className="relative flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md h-40 cursor-pointer hover:border-blue-500 bg-blue-50 transition-colors">
              <input
                type="file"
                name="card_image"
                accept="image/*"
                onChange={(e) =>
                  setForm({ ...form, card_image: e.target.files[0] })
                }
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />

              <div className="flex flex-col items-center justify-center pointer-events-none ">
                <UploadCloud className="w-8 h-8 text-blue-500" />
                <p className="text-blue-500 text-sm">
                  Click or drag image here
                </p>
                {form.card_image && (
                  <p className="text-green-600 text-xs ">Selected: 01 Image</p>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-10">
            <button
              type="submit"
              className="bg-blue-800 text-white px-4 py-2 rounded-md"
            >
              {editingAboutMiddleId ? "Update" : "Submit"}
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
