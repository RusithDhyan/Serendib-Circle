"use client";
import { generateChecksum } from "@/lib/fetchData";
import { UploadCloud } from "lucide-react";
import { useEffect, useState } from "react";

export default function AddHomeExp({ onClose, editingHomeExp }) {
  const [selectedType, setSelectedType] = useState("");

  const [homeExp, setHomeExp] = useState([]);
  const [form, setForm] = useState({
    type: "",
    card_title: "",
    card_description: "",
    card_image: "",
  });
  const [editingHomeExpId, setEditingHomeExpId] = useState(null);

  const fetchHomeExp = async () => {
    const res = await fetch("/api/home-exp");
    const data = await res.json();
    if (data.success) setHomeExp(data.data);
  };

  useEffect(() => {
    fetchHomeExp();
  }, []);

  useEffect(() => {
    if (editingHomeExp) {
      setForm({
        type: editingHomeExp.type || "",
        card_title: editingHomeExp.card_title || "",
        card_description: editingHomeExp.card_description || "",
        card_image: editingHomeExp.card_image || "",
      });
      setEditingHomeExpId(editingHomeExp._id);
    }
  }, [editingHomeExp]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const t = Date.now().toString();
    const cs = await generateChecksum(t);

    const formData = new FormData();
    formData.append("type", form.type);
    formData.append("card_title", form.card_title);
    formData.append("card_description", form.card_description);

    if (form.card_image && typeof form.card_image !== "string") {
      formData.append("card_image", form.card_image);
    }

    let res;
    if (editingHomeExpId) {
      res = await fetch(
        `/api/site-admin/home-exp/${editingHomeExpId}?t=${t}&cs=${cs}`,
        {
          method: "PUT",
          body: formData,
        }
      );
    } else {
      res = await fetch(`/api/site-admin/home-exp?t=${t}&cs=${cs}`, {
        method: "POST",
        body: formData,
      });
    }

    const result = await res.json();
    if (result.success) {
      setForm({
        type: "",
        card_title: "",
        card_description: "",
        card_images: "",
      });
      setEditingHomeExpId(null);
      fetchHomeExp();
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
          {editingHomeExpId
            ? "Edit Home-Exp Content"
            : "Add New Home-Exp Content"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold">
                Experience type
              </label>
              <select
                id="type"
                value={selectedType}
                onChange={handleSelectChange}
                className="w-full border p-2.5 rounded-md"
              >
                <option value="">-- Select Type --</option>
                <option value="nature">Nature</option>
                <option value="city">City</option>
                <option value="sports">Sports</option>
                <option value="culture">Cultural</option>
                <option value="test">Test</option>
              </select>
            </div>
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
                // required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold">
              Card Description
            </label>
            <input
              type="text"
              name="card_description"
              placeholder="Card Description"
              value={form.card_description}
              onChange={(e) =>
                setForm({ ...form, card_description: e.target.value })
              }
              className="w-full p-2 border rounded-md"
              // required
            />
          </div>
          <div className="flex flex-col w-full">
            <label className="block text-sm font-semibold mb-1">
              Card Image
            </label>

            <div className="relative flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md h-30 cursor-pointer hover:border-blue-500 bg-blue-50 transition-colors">
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
                  <p className="text-green-600 text-xs ">
                    Selected: 01 Image-{form.card_title}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-10">
            <button
              type="submit"
              className="bg-blue-800 text-white px-4 py-2 rounded-md"
            >
              {editingHomeExpId ? "Update" : "Submit"}
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
