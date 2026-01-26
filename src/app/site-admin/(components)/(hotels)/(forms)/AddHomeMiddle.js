"use client";
import { generateChecksum } from "@/lib/fetchData";
import { UploadCloud } from "lucide-react";
import { useEffect, useState } from "react";

export default function AddHomeMiddle({ onClose, editingHomeMiddle }) {
  const [homeMiddle, setHomeMiddle] = useState([]);
  const [form, setForm] = useState({
    map_title: "",
    map_description: "",
    blog_title: "",
    blog_description: "",
    blog_image: "",
  });
  const [editingHomeMiddleId, setEditingHomeMiddleId] = useState(null);

  const fetchHomeMiddle = async () => {
    const res = await fetch("/api/home-middle");
    const data = await res.json();
    if (data.success) setHomeMiddle(data.data);
  };

  useEffect(() => {
    fetchHomeMiddle();
  }, []);

  useEffect(() => {
    if (editingHomeMiddle) {
      setForm({
        map_title: editingHomeMiddle.map_title || "",
        map_description: editingHomeMiddle.map_description || "",
        blog_title: editingHomeMiddle.blog_title || "",
        blog_description: editingHomeMiddle.blog_description || "",
        blog_image: editingHomeMiddle.blog_image || "",
      });
      setEditingHomeMiddleId(editingHomeMiddle._id);
    }
  }, [editingHomeMiddle]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const t = Date.now().toString();
    const cs = await generateChecksum(t);

    const formData = new FormData();
    formData.append("map_title", form.map_title);
    formData.append("map_description", form.map_description);
    formData.append("blog_title", form.blog_title);
    formData.append("blog_description", form.blog_description);

    if (form.blog_image && typeof form.blog_image !== "string") {
      formData.append("blog_image", form.blog_image);
    }

    let res;
    if (editingHomeMiddleId) {
      res = await fetch(
        `/api/site-admin/home-middle/${editingHomeMiddleId}?t=${t}&cs=${cs}`,
        {
          method: "PUT",
          body: formData,
        }
      );
    } else {
      res = await fetch(`/api/site-admin/home-middle?t=${t}&cs=${cs}`, {
        method: "POST",
        body: formData,
      });
    }

    const result = await res.json();
    if (result.success) {
      setForm({
        map_title: "",
        map_description: "",
        blog_title: "",
        blog_description: "",
        blog_image: "",
      });
      setEditingHomeMiddleId(null);
      fetchHomeMiddle();
      onClose();
    } else {
      alert("Error: " + result.error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-4xl">
        <h2 className="text-xl text-center font-bold mb-4 text-blue-800">
          {editingHomeMiddleId
            ? "Edit Home-Middle Content"
            : "Add New Home-Middle Content"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold">Map Title</label>
              <input
                type="text"
                name="map_title"
                placeholder="Map Title"
                value={form.map_title}
                onChange={(e) =>
                  setForm({ ...form, map_title: e.target.value })
                }
                className="w-full p-2 border rounded-md"
                // required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold">
                Map Description
              </label>
              <textarea
                type="text"
                name="map_description"
                placeholder="Map Description"
                value={form.map_description}
                onChange={(e) =>
                  setForm({ ...form, map_description: e.target.value })
                }
                className="w-full p-2 h-10 border rounded-md"
                // required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">Blog Title</label>
              <input
                type="text"
                name="blog_title"
                placeholder="Blog Title"
                value={form.blog_title}
                onChange={(e) =>
                  setForm({ ...form, blog_title: e.target.value })
                }
                className="w-full p-2 border rounded-md"
                // required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">
                Blog Description
              </label>
              <textarea
                type="text"
                name="blog_description"
                placeholder="Blog Description"
                value={form.blog_description}
                onChange={(e) =>
                  setForm({ ...form, blog_description: e.target.value })
                }
                className="w-full p-2 border h-10 rounded-md"
                // required
              />
            </div>
          </div>
          <div className="flex flex-col w-full">
            <label className="block text-sm font-semibold mb-1">
              Blog Image
            </label>

            <div className="relative flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md h-30 cursor-pointer hover:border-blue-500 bg-blue-50 transition-colors">
              <input
                type="file"
                name="blog_image"
                accept="image/*"
                onChange={(e) =>
                  setForm({ ...form, blog_image: e.target.files[0] })
                }
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />

              <div className="flex flex-col items-center justify-center pointer-events-none ">
                <UploadCloud className="w-8 h-8 text-blue-500" />
                <p className="text-blue-500 text-sm">
                  Click or drag image here
                </p>
                {form.blog_image && (
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
              {editingHomeMiddleId ? "Update" : "Submit"}
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
