"use client";
import { Plus, UploadCloud } from "lucide-react";
import { useEffect, useState } from "react";

export default function AddHomeTop({ onClose, editingHomeTop }) {
  const [homeTop, setHomeTop] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    main_image: "",
    content_images: [],
  });
  const [editingHomeTopId, setEditingHomeTopId] = useState(null);

  const fetchHomeTop = async () => {
    const res = await fetch("/api/home-top");
    const data = await res.json();
    if (data.success) setHomeTop(data.data);
  };
  useEffect(() => {
    fetchHomeTop();
  }, []);

  useEffect(() => {
    if (editingHomeTop) {
      setForm({
        title: editingHomeTop.title || "",
        description: editingHomeTop.description || "",
        main_image: editingHomeTop.main_image || "",
        content_images: editingHomeTop.content_images || "",
      });
      setEditingHomeTopId(editingHomeTop._id);
    }
  }, [editingHomeTop]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    if (form.main_image && typeof form.main_image !== "string") {
      formData.append("main_image", form.main_image);
    }
    if (form.content_images && form.content_images.length > 0) {
      form.content_images.forEach((img) => {
        formData.append("content_images", img);
      });
    }

    let res;
    if (editingHomeTopId) {
      res = await fetch(`/api/home-top/${editingHomeTopId}`, {
        method: "PUT",
        body: formData,
      });
    } else {
      res = await fetch("/api/home-top", {
        method: "POST",
        body: formData,
      });
    }

    const result = await res.json();
    if (result.success) { 
      setForm({
        title: "",
        description: "",
        main_image: "",
        content_images: [],
      });
      setEditingHomeTopId(null);
      fetchHomeTop();
      onClose();
    } else {
      alert("Error: " + result.error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-4xl">
        <h2 className="text-xl text-center font-bold mb-4 text-blue-800">
          {editingHomeTopId
            ? "Edit Home-Top Content"
            : "Add New Home-Top Content"}
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

            <div className="flex flex-col w-full">
              <label className="block text-sm font-semibold mb-1">
                Main Image
              </label>

              <div className="relative flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md h-20 cursor-pointer hover:border-blue-500 bg-blue-50 transition-colors">
                <input
                  type="file"
                  name="main_image"
                  accept="image/*"
                  onChange={(e) =>
                    setForm({ ...form, main_image: e.target.files[0] })
                  }
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                <div className="flex flex-col items-center justify-center pointer-events-none ">
                  <UploadCloud className="w-8 h-8 text-blue-500" />
                  <p className="text-blue-500 text-sm">
                    Click or drag image here
                  </p>
                  {form.main_image && (
                    <p className="text-green-600 text-xs ">
                      Selected: 01 Image
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col w-full">
              <label className="block text-sm font-semibold mb-1">
                Content Images
              </label>

              <div className="relative flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md h-20 cursor-pointer hover:border-blue-500 bg-blue-50 transition-colors">
                <input
                  type="file"
                  name="content_images"
                  accept="image/*"
                  multiple
                  onChange={(e) =>
                    setForm({
                      ...form,
                      content_images: Array.from(e.target.files),
                    })
                  }
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                <div className="flex flex-col items-center justify-center pointer-events-none">
                  <UploadCloud className="w-8 h-8 text-blue-500" />
                  <div className="flex items-center text-blue-500 gap-2">
                    <Plus size={15} />
                    <p className="text-blue-500 text-sm flex">
                      Add one or more images here
                    </p>
                  </div>
                  {form.content_images && (
                    <p className="text-green-600 text-xs ">
                      Selected: {form.content_images.length} Images
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-10">
            <button
              type="submit"
              className="bg-blue-800 text-white px-4 py-2 rounded-md"
            >
              {editingHomeTopId ? "Update" : "Submit"}
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
