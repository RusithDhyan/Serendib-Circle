"use client";
import { generateChecksum } from "@/lib/fetchData";
import { UploadCloud } from "lucide-react";
import { useEffect, useState } from "react";

export default function AddHomeBottom({ onClose, editingHomeBottom }) {
  const [homeBottom, setHomeBottom] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    bg_image: "",
  });
  const [editingHomeBottomId, setEditingHomeBottomId] = useState(null);

  const fetchHomeBottom = async () => {
    const res = await fetch("/api/home-bottom");
    const data = await res.json();
    if (data.success) setHomeBottom(data.data);
  };

  useEffect(() => {
    fetchHomeBottom();
  }, []);

  useEffect(() => {
    if (editingHomeBottom) {
      setForm({
        title: editingHomeBottom.title || "",
        description: editingHomeBottom.description || "",
        bg_image: editingHomeBottom.bg_image || "",
      });
      setEditingHomeBottomId(editingHomeBottom._id);
    }
  }, [editingHomeBottom]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const t = Date.now().toString();
    const cs = await generateChecksum(t);
    
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    if (form.bg_image && typeof form.bg_image !== "string") {
      formData.append("bg_image", form.bg_image);
    }

    let res;
    if (editingHomeBottomId) {
      res = await fetch(
        `/api/site-admin/home-bottom/${editingHomeBottomId}?t=${t}&cs=${cs}`,
        {
          method: "PUT",
          body: formData,
        }
      );
    } else {
      res = await fetch(`/api/site-admin/home-bottom?t=${t}&cs=${cs}`, {
        method: "POST",
        body: formData,
      });
    }

    const result = await res.json();
    if (result.success) {
      setForm({
        title: "",
        description: "",
        bg_image: "",
      });
      setEditingHomeBottomId(null);
      fetchHomeBottom();
      onClose();
    } else {
      alert("Error: " + result.error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-4xl">
        <h2 className="text-xl text-center font-bold mb-4 text-blue-800">
          {editingHomeBottomId
            ? "Edit Home-Bottom Content"
            : "Add New Home-Bottom Content"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <label className="block text-sm font-semibold">Description</label>
              <textarea
                type="text"
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="w-full p-2 h-10 border rounded-md"
                // required
              />
            </div>
          </div>
          <div className="flex flex-col w-full">
            <label className="block text-sm font-semibold mb-1">Bg_Image</label>

            <div className="relative flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md h-30 cursor-pointer hover:border-blue-500 bg-blue-50 transition-colors">
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
              {editingHomeBottomId ? "Update" : "Submit"}
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
