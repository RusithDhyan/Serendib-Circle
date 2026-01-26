"use client";
import { UploadCloud } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export default function AddBlogContent({
  onClose,
  editingBlogContent,
  blogId,
}) {
  const [contents, setBlogContent] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    image: "",
    bullet_title: "",
    bulletPoints: [],

  });
  const [editingBlogContentId, setEditingBlogContentId] = useState(null);

 
  const fetchBlogContent = useCallback(async () => {
    const t = Date.now().toString();
    const cs = await generateChecksum(t);
    
  const res = await fetch(`/api/blog-content?blogId=${blogId}`);
  const data = await res.json();
  console.log("Fetched BlogContent:", data.data);

  if (data.success) setBlogContent(data.data);
}, [blogId]); // ✅ stable function, only changes when blogId changes

useEffect(() => {
  fetchBlogContent();
}, [fetchBlogContent]); 

  useEffect(() => {
    if (editingBlogContent) {
      setForm({
        title: editingBlogContent.title || "",
        description: editingBlogContent.description || "",
        image: editingBlogContent.image || "",
        bullet_title: editingBlogContent.bullet_title || "",
        bulletPoints: editingBlogContent.bulletPoints || [""],

      });
      setEditingBlogContentId(editingBlogContent._id);
    }
  }, [editingBlogContent]);

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

   async function generateChecksum(timestamp) {
  const API_KEY = process.env.NEXT_PUBLIC_KEY;
  const text = timestamp + API_KEY;

  const encoder = new TextEncoder();
  const data = encoder.encode(text);

  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

  const handleSubmit = async (e) => {
    e.preventDefault();
    const timestamp = Date.now().toString();
    const checksum = await generateChecksum(timestamp);

    const formData = new FormData();
    console.log("bullet data",formData);
    formData.append("blogId", blogId);
    formData.append("title", form.title);
    formData.append("description", form.description);
    if (form.image && typeof form.image !== "string") {
      formData.append("image", form.image);
    }

    formData.append("bullet_title", form.bullet_title);
    formData.append("bulletPoints", JSON.stringify(form.bulletPoints));

    formData.append("t", timestamp);
  formData.append("cs", checksum);

    let res;
    if (editingBlogContentId) {
      res = await fetch(`/api/blog-content?t=${timestamp}&cs=${checksum}/${editingBlogContentId}`, {
        method: "PUT",
        body: formData,
      });
    } else {
      res = await fetch(`/api/blog-content?t=${timestamp}&cs=${checksum}`, {
        method: "POST",
        body: formData,
      });
    }

    const result = await res.json();
    if (result.success) {
      setForm({
        title: "",
        description: "",
        image: "",
        bullet_title: "",
        bulletPoints: [""],
      });
      setEditingBlogContentId(null);
      fetchBlogContent();
      onClose();
    } else {
      alert("Error: " + result.error);
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-4xl">
        <h1 className="text-2xl text-center font-bold mb-4">
          {editingBlogContentId ? "Edit Blog Content" : "Add New Blog Content"}
        </h1>

        <form onSubmit={handleSubmit} className="2xl:space-y-4">
          <div>
            <label>Title</label>
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label>Description</label>
            <textarea
              type="text"
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label>Bullet Title</label>
            <input
              type="text"
              name="bullet_title"
              placeholder="Bullet Title"
              value={form.bullet_title}
              onChange={(e) => setForm({ ...form, bullet_title: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex flex-col w-full">
            <label className="block text-sm font-semibold">Cover Image</label>

            <div className="relative flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md h-30 cursor-pointer hover:border-blue-500 bg-blue-50 transition-colors">
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={(e) =>
                  setForm({ ...form, image: e.target.files[0] })
                }
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />

              <div className="flex flex-col items-center justify-center pointer-events-none">
                <UploadCloud className="w-8 h-8 text-blue-500"/>
                <p className="text-blue-500 text-sm">
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
          <div className="flex justify-center gap-10 mt-2">
            <button
              type="submit"
              className="bg-blue-800 text-white px-4 py-2 rounded"
            >
              {editingBlogContentId ? "Update" : "Submit"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
