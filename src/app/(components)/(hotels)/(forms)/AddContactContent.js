"use client";
import { UploadCloud } from "lucide-react";
import { useEffect, useState } from "react";
import { countries } from "../../(contact)/CountryCodes";

export default function AddContactContent({ onClose, editingContactContent }) {
  const [contactContent, setContactContent] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    email: "",
    phone: "",
    bg_image: "",
  });
  
  const [editingContactContentId, setEditingContactContentId] = useState(null);

  const fetchContactContent = async () => {
    const res = await fetch("/api/contact");
    const data = await res.json();
    if (data.success) setContactContent(data.data);
  };

  useEffect(() => {
    fetchContactContent();
  }, []);

  useEffect(() => {
    if (editingContactContent) {
      setForm({
        title: editingContactContent.title || "",
        description: editingContactContent.description || "",
        email: editingContactContent.email || "",
        phone: editingContactContent.phone || "",
        bg_image: editingContactContent.bg_image || "",
      });
      setEditingContactContentId(editingContactContent._id);
    }
  }, [editingContactContent]);

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
  formData.append("title", form.title);
  formData.append("vision_title", form.vision_title);
  formData.append("description", form.description);
  formData.append("email", form.email);
  formData.append("phone", `${form.countryCode}${form.phone}`);

  if (form.bg_image && typeof form.bg_image !== "string") {
    formData.append("bg_image", form.bg_image);
  }

  // Add security params
  formData.append("t", timestamp);
  formData.append("cs", checksum);

  let res;
  if (editingContactContentId) {
    res = await fetch(`/api/contact?t=${timestamp}&cs=${checksum}/${editingContactContentId}`, {
      method: "PUT",
      body: formData,
    });
  } else {
    res = await fetch(`/api/contact?t=${timestamp}&cs=${checksum}`, {
      method: "POST",
      body: formData,
    });
  }

  const result = await res.json();
  if (result.success) {
    setForm({
      title: "",
      description: "",
      email: "",
      phone: "",
      bg_image: "",
    });
    setEditingContactContentId(null);
    fetchContactContent();
    onClose();
  } else {
    alert("Error: " + result.error);
  }
};


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-4xl">
        <h2 className="text-xl text-center font-bold mb-4 text-blue-800">
          {editingContactContentId
            ? "Edit Contact Content"
            : "Add New Contact Content"}
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
                className="w-full p-2 h-10 border rounded-md resize-none"
                // required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">Phone</label>
              <div className="flex flex-col sm:flex-row gap-4">
                <select
                  name="countryCode"
                  value={form.countryCode}
                  onChange={(e) => setForm({ ...form, countryCode: e.target.value })}
                  className="border-b px-4 py-2 bg-white w-full sm:w-1/1"
                  required
                >
                  <option value="" disabled>
                    Select Country
                  </option>
                  {countries.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name} ({c.code})
                    </option>
                  ))}
                </select>

                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="Phone Number"
                  required
                  disabled={!form.countryCode}
                  className={`border-b px-4 py-2 w-full ${
                    !form.countryCode ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col w-full">
            <label className="block text-sm font-semibold mb-1">
              Background Image
            </label>

            <div className="relative flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md h-50 cursor-pointer hover:border-blue-500 bg-blue-50 transition-colors">
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
              {editingContactContentId ? "Update" : "Submit"}
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
