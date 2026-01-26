"use client";
import { generateChecksum } from "@/lib/fetchData";
import { useCallback, useEffect, useState } from "react";

export default function AddExpContent({
  onClose,
  editingExpContent,
  expId,
}) {
  const [contents, setExpContent] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    bulletPoints: [""],
  });
  const [editingExpContentId, setEditingExpContentId] = useState(null);

  // const fetchExpContent =useCallback(async () => {
  //   const t = Date.now().toString();
  //   const cs = await generateChecksum(t);
  //   const res = await fetch(`/api/site-admin/exp-content?expId=${expId}&t=${t}&cs=${cs}`);
  //   const data = await res.json();
  //   console.log("Fetched ExpContent:", data.data);

  //   if (data.success) setExpContent(data.data);
  // },[expId])

  // useEffect(() => {
  //   fetchExpContent();
  // }, [fetchExpContent]);

  useEffect(() => {
    if (editingExpContent) {
      setForm({
        title: editingExpContent.title || "",
        description: editingExpContent.description || "",
        bulletPoints: editingExpContent.bulletPoints || [""],
      });
      setEditingExpContentId(editingExpContent._id);
    }
  }, [editingExpContent]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const t = Date.now().toString();
    const cs = await generateChecksum(t);

    const formData = new FormData();
    formData.append("expId", expId);
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("bulletPoints", JSON.stringify(form.bulletPoints));

    let res;
    if (editingExpContentId) {
      res = await fetch(`/api/site-admin/exp-content/${editingExpContentId}?t=${t}&cs=${cs}`, {
        method: "PUT",
        body: formData,
      });
    } else {
      res = await fetch(`/api/site-admin/exp-content?t=${t}&cs=${cs}`, {
        method: "POST",
        body: formData,
      });
    }

    const result = await res.json();
    if (result.success) {
      setForm({
        title: "",
        description: "",
        bulletPoints: [""],
      });
      setEditingExpContentId(null);
      // fetchExpContent();
      onClose();
    } else {
      alert("Error: " + result.error);
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-4xl">
        <h1 className="text-2xl text-center font-bold mb-4">
          {editingExpContentId
            ? "Edit Exp Content"
            : "Add New Exp Content"}
        </h1>

        <form onSubmit={handleSubmit} className="2xl:space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label>Title</label>
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
              className="w-full p-2 border rounded-md"
              // required
            />
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
                {form.bulletPoints.length > 0 && (
                  <button
                    type="button"
                    onClick={() => removeBullet(index)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md"
                  >
                    X
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addBullet}
              className="bg-blue-800 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            >
              + Add Bullet
            </button>
          </div>
          <div className="flex justify-center gap-10 mt-2">
            <button
              type="submit"
              className="bg-blue-800 text-white px-4 py-2 rounded-md"
            >
              {editingExpContentId ? "Update" : "Submit"}
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
