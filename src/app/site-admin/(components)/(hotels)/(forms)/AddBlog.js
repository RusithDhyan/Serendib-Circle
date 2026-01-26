"use client";
import { generateChecksum } from "@/lib/fetchData";
import { UploadCloud } from "lucide-react";
import { useEffect, useState } from "react";

export default function AddBlog({ onClose, editingBlog }) {
  const [blogs, setBlogs] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    main_title: "",
    main_description: "",
    body_title: "",
    body_description: "",
    thumbnail: "",
    bg_image: "",
    cover_image: "",
    bottom_title: "",
    bottom_description: ""
  });
  const [editingBlogId, setEditingBlogId] = useState(null);

  const fetchBlogs = async () => {
    const res = await fetch("/api/blogs");
    const data = await res.json();
    if (data.success) setBlogs(data.data);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    if (editingBlog) {
      setForm({
        title: editingBlog.title || "",
        description: editingBlog.description || "",
        main_title: editingBlog.main_title || "",
        main_description: editingBlog.main_description || "",
        body_title: editingBlog.body_title || "",
        body_description: editingBlog.body_description || "",
        bottom_title: editingBlog.bottom_title || "",
        bottom_description: editingBlog.bottom_description || "",
        thumbnail: editingBlog.thumbnail || "",
        bg_image: editingBlog.bg_image || "",
        cover_image: editingBlog.cover_image || "",
      });
      setEditingBlogId(editingBlog._id);
    }
  }, [editingBlog]);

 

  const handleSubmit = async (e) => {
    e.preventDefault();

    const t = Date.now().toString();
    const cs = await generateChecksum(t);

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("main_title", form.main_title);
    formData.append("main_description", form.main_description);
    formData.append("body_title", form.body_title);
    formData.append("body_description", form.body_description);
    formData.append("body_title", form.body_title);
    formData.append("body_description", form.body_description);
    formData.append("bottom_title", form.bottom_title);
    formData.append("bottom_description", form.bottom_description);

    if (form.thumbnail && typeof form.thumbnail !== "string") {
      formData.append("thumbnail", form.thumbnail);
    }
    if (form.bg_image && typeof form.bg_image !== "string") {
      formData.append("bg_image", form.bg_image);
    }
    if (form.cover_image && typeof form.cover_image !== "string") {
      formData.append("cover_image", form.cover_image);
    }


    let res;
    if (editingBlogId) {
      res = await fetch(`/api/site-admin/blogs/${editingBlogId}?t=${t}&cs=${cs}`, {
        method: "PUT",
        body: formData,
      });
    } else {
      res = await fetch(`/api/site-admin/blogs?t=${t}&cs=${cs}`, {
        method: "POST",
        body: formData,
      });
    }

    const result = await res.json();
    if (result.success) {
      setForm({
        title: "",
        description: "",
        main_title: "",
        main_description: "",
        body_title: "",
        body_description: "",
        thumbnail: "",
        bg_image: "",
        cover_image: "",
        bottom_title: "",
        bottom_description: ""
      });
      setEditingBlogId(null);
      fetchBlogs();
      onClose();
    } else {
      alert("Error: " + result.error);
    }
  };

  const handleSelectChange = (e) => {
    const type = e.target.value;
    setSelectedType(type);
    setForm((prev) => ({ ...prev, type }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-4xl">
        <h2 className="text-xl text-center font-bold mb-4 text-blue-800">
          {editingBlogId ? "Edit Blog" : "Add New Blog"}
        </h2>
        <form onSubmit={handleSubmit} className="2xl:space-y-4">
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
                className="w-full p-2 h-10 border rounded-md resize-none"
                // required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">Main Title</label>
              <input
                type="text"
                name="main_title"
                placeholder="Main Title"
                value={form.main_title}
                onChange={(e) =>
                  setForm({ ...form, main_title: e.target.value })
                }
                className="w-full p-2 border rounded-md"
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
            <div>
              <label className="block text-sm font-semibold">Body Title</label>
              <input
                type="text"
                name="body_title"
                placeholder="Body Title"
                value={form.body_title}
                onChange={(e) =>
                  setForm({ ...form, body_title: e.target.value })
                }
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">
                Body Description
              </label>
              <textarea
                type="text"
                name="body_description"
                placeholder="Body Description"
                value={form.body_description}
                onChange={(e) =>
                  setForm({ ...form, body_description: e.target.value })
                }
                className="w-full p-2 h-10 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">Bottom Title</label>
              <input
                type="text"
                name="bottom_title"
                placeholder="Bottom Title"
                value={form.bottom_title}
                onChange={(e) => setForm({ ...form, bottom_title: e.target.value })}
                className="w-full p-2 border rounded-md"
                // required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">
                Bottom Description
              </label>
              <textarea
                type="text"
                name="bottom_description"
                placeholder="Bottom Description"
                value={form.bottom_description}
                onChange={(e) =>
                  setForm({ ...form, bottom_description: e.target.value })
                }
                className="w-full p-2 h-10 border rounded-md"
              />
            </div>

            {/* {!editingExpId && ( */}
            <div className="flex flex-col w-full">
              <label className="block text-sm font-semibold mb-1">
                Thumbnail Image
              </label>

              <div className="relative flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md 2xl:h-20 cursor-pointer hover:border-blue-500 bg-blue-50 transition-colors">
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
                Background Image
              </label>

              <div className="relative flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md 2xl:h-20 cursor-pointer hover:border-blue-500 bg-blue-50 transition-colors">
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
                    <p className="text-green-600 text-xs ">
                      Selected: 01 Image
                    </p>
                  )}
                </div>
              </div>
            </div>
            
          </div>
          <div className="flex flex-col w-full">
              <label className="block text-sm font-semibold mb-1">
                Cover Image
              </label>

              <div className="relative flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md 2xl:h-20 cursor-pointer hover:border-blue-500 bg-blue-50 transition-colors">
                <input
                  type="file"
                  name="cover_image"
                  accept="image/*"
                  onChange={(e) =>
                    setForm({ ...form, cover_image: e.target.files[0] })
                  }
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                <div className="flex flex-col items-center justify-center pointer-events-none ">
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

          <div className="flex justify-center gap-10 mt-2">
            <button
              type="submit"
              className="bg-blue-800 text-white px-4 py-2 rounded-md"
            >
              {editingBlogId ? "Update" : "Submit"}
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
