"use client";
import { UploadCloud } from "lucide-react";
import { useEffect, useState } from "react";

export default function AddExperience({ onClose, editingExperience }) {
  const [selectedType, setSelectedType] = useState("");

  const [experiences, setExperience] = useState([]);
  const [form, setForm] = useState({
    type: "",
    title: "",
    description: "",
    main_title: "",
    main_description: "",
    body_title: "",
    body_description: "",
    image: "",
    bg_image: "",
    image_slider: [],
    bulletPoints: [],
  });
  const [editingExperienceId, setEditingExperienceId] = useState(null);

  const fetchExperience = async () => {
    const res = await fetch("/api/experience");
    const data = await res.json();
    if (data.success) setExperience(data.data);
  };

  useEffect(() => {
    fetchExperience();
  }, []);

  useEffect(() => {
    if (editingExperience) {
      setForm({
        type: editingExperience.type || "",
        title: editingExperience.title || "",
        description: editingExperience.description || "",
        main_title: editingExperience.main_title || "",
        main_description: editingExperience.main_description || "",
        body_title: editingExperience.body_title || "",
        body_description: editingExperience.body_description || "",

        image: editingExperience.image || "",
        bg_image: editingExperience.bg_image || "",
        image_slider: editingExperience.image_slider || "",
        bulletPoints: editingExperience.bulletPoints || [""],
      });
      setEditingExperienceId(editingExperience._id);
    }
  }, [editingExperience]);

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

    const formData = new FormData();
    formData.append("type", form.type);
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("main_title", form.main_title);
    formData.append("main_description", form.main_description);
    formData.append("body_title", form.body_title);
    formData.append("body_description", form.body_description);

    if (form.image && typeof form.image !== "string") {
      formData.append("image", form.image);
    }
    if (form.bg_image && typeof form.bg_image !== "string") {
      formData.append("bg_image", form.bg_image);
    }
    if (form.image_slider && form.image_slider.length > 0) {
      form.image_slider.forEach((img) => {
        formData.append("image_slider", img);
      });
    }
    formData.append("bulletPoints", JSON.stringify(form.bulletPoints));

    let res;
    if (editingExperienceId) {
      res = await fetch(`/api/experience/${editingExperienceId}`, {
        method: "PUT",
        body: formData,
      });
    } else {
      res = await fetch("/api/experience", {
        method: "POST",
        body: formData,
      });
    }

    const result = await res.json();
    if (result.success) {
      setForm({
        type: "",
        title: "",
        description: "",
        main_title: "",
        main_description: "",
        body_title: "",
        body_description: "",
        image: "",
        bg_image: "",
        image_slider: [],
        bulletPoints: [""],
      });
      setEditingExperienceId(null);
      fetchExperience();
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
          {editingExperienceId ? "Edit Experience" : "Add New Experience"}
        </h2>
        <form onSubmit={handleSubmit} className="2xl:space-y-4">
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
                <option value="" disabled>
                  -- Select Type --
                </option>
                <option value="nature">Nature</option>
                <option value="city">City</option>
                <option value="sports">Sports</option>
                <option value="test">Test</option>

                <option value="culture">Cultural</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold">Title</label>
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full p-2 border rounded-md"
                required
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
                required
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
            <div className="flex flex-col w-full">
              <label className="block text-sm font-semibold mb-1">
                Thumbnail Image
              </label>

              <div className="relative flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md 2xl:h-15 cursor-pointer hover:border-blue-500 bg-blue-50 transition-colors">
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={(e) =>
                    setForm({ ...form, image: e.target.files[0] })
                  }
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                <div className="flex flex-col items-center justify-center pointer-events-none ">
                  <UploadCloud className="w-8 h-8 text-blue-500" />
                  <p className="text-blue-500 text-sm">
                    Click or drag image here
                  </p>
                  {form.image && (
                    <p className="text-green-600 text-xs ">
                      Selected: 01 Image
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col w-full">
              <label className="block text-sm font-semibold mb-1">
                Slider Image
              </label>

              <div className="relative flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md 2xl:h-15 cursor-pointer hover:border-blue-500 bg-blue-50 transition-colors">
                <input
                  type="file"
                  name="image_slider"
                  accept="image/*"
                  multiple
                  onChange={(e) =>
                    setForm({
                      ...form,
                      image_slider: Array.from(e.target.files), // ✅ convert FileList to array
                    })
                  }
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                <div className="flex flex-col items-center justify-center pointer-events-none">
                  <UploadCloud className="w-8 h-8 text-blue-500" />
                  <p className="text-blue-500 text-sm">
                    Click or drag images here
                  </p>

                  {form.image_slider?.length > 0 && (
                    <div className="mt-2 text-green-600 text-xs text-center">
                      {form.image_slider.map((file, index) => (
                        <p key={index}>Selected: {file.name}</p>
                      ))}
                    </div>
                  )}
                </div>
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
                  <p className="text-green-600 text-xs ">Selected: 01 Image</p>
                )}
              </div>
            </div>
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
              className="w-full p-2 border rounded-md"
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
              className="bg-blue-800 text-white px-4 py-2 rounded-md"
            >
              {editingExperienceId ? "Update" : "Submit"}
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
