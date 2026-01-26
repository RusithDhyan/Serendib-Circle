"use client";
import { generateChecksum } from "@/lib/fetchData";
import { useEffect, useState } from "react";

export default function AddAboutBottom({ onClose, editingAboutBottom }) {
  const [aboutContent, setAboutBottom] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    // logo_image: "",
  });
  const [editingAboutBottomId, setEditingAboutBottomId] = useState(null);

  const fetchAboutBottom = async () => {
    const res = await fetch("/api/about-bottom");
    const data = await res.json();
    if (data.success) setAboutBottom(data.data);
  };

  useEffect(() => {
    fetchAboutBottom();
  }, []);

  useEffect(() => {
    if (editingAboutBottom) {
      setForm({
        title: editingAboutBottom.title || "",
        description: editingAboutBottom.description || "",

        // logo_image: editingAboutBottom.logo_image || "",
      });
      setEditingAboutBottomId(editingAboutBottom._id);
    }
  }, [editingAboutBottom]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const t = Date.now().toString();
    const cs = await generateChecksum(t);

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);

    // if (form.logo_image && typeof form.logo_image !== "string") {
    //   formData.append("logo_image", form.logo_image);
    // }

    let res;
    if (editingAboutBottomId) {
      res = await fetch(
        `/api/site-admin/about-bottom/${editingAboutBottomId}?t=${t}&cs=${cs}`,
        {
          method: "PUT",
          body: formData,
        }
      );
    } else {
      res = await fetch(`/api/site-admin/about-bottom?t=${t}&cs=${cs}`, {
        method: "POST",
        body: formData,
      });
    }

    const result = await res.json();
    if (result.success) {
      setForm({
        title: "",
        description: "",
        // logo_image: "",
      });
      setEditingAboutBottomId(null);
      fetchAboutBottom();
      onClose();
    } else {
      alert("Error: " + result.error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-4xl">
        <h2 className="text-xl text-center font-bold mb-4 text-blue-800">
          {editingAboutBottomId
            ? "Edit About Content-Bottom"
            : "Add New About Content-Bottom"}
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
                className="w-full p-2 h-10 border rounded-md resize-none"
              />
            </div>
          </div>
          <div className="flex justify-center gap-10">
            <button
              type="submit"
              className="bg-blue-800 text-white px-4 py-2 rounded-md"
            >
              {editingAboutBottomId ? "Update" : "Submit"}
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
