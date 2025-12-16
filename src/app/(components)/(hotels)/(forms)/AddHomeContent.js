"use client";
import { Plus, UploadCloud } from "lucide-react";
import { useEffect, useState } from "react";

export default function AddHomeSlider({ onClose, editingHomeSlider }) {
  const [homeSlider, setHomeSlider] = useState([]);
  const [form, setForm] = useState({
    title: "",
    home_slider_image: [],
  });
  const [editingHomeSliderId, setEditingHomeSliderId] = useState(null);

  const fetchHomeSlider = async () => {
    const res = await fetch("/api/home-slider");
    const data = await res.json();
    if (data.success) setHomeSlider(data.data);
  };

  useEffect(() => {
    fetchHomeSlider();
  }, []);

  useEffect(() => {
    if (editingHomeSlider) {
      setForm({
        title: editingHomeSlider.title || "",
        home_slider_image: editingHomeSlider.home_slider_image || "",
      });
      setEditingHomeSliderId(editingHomeSlider._id);
    }
  }, [editingHomeSlider]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", form.title);

    if (form.home_slider_image && form.home_slider_image.length > 0) {
      form.home_slider_image.forEach((img) => {
        formData.append("home_slider_image", img);
      });
    }

    let res;
    if (editingHomeSliderId) {
      res = await fetch(`/api/home-slider/${editingHomeSliderId}`, {
        method: "PUT",
        body: formData,
      });
    } else {
      res = await fetch("/api/home-slider", {
        method: "POST",
        body: formData,
      });
    }

    const result = await res.json();
    if (result.success) {
      setForm({
        home_slider_image: [],
      });
      setEditingHomeSliderId(null);
      fetchHomeSlider();
      onClose();
    } else {
      alert("Error: " + result.error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-4xl">
        <h2 className="text-xl text-center font-bold mb-4 text-blue-800">
          {editingHomeSliderId
            ? "Edit Home-Slider Images"
            : "Add New Home-Slider Images"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
           <div>
              <label className="block text-sm font-semibold">Home Slider Title</label>
              <input
                type="text"
                name="title"
                placeholder="Slider Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full p-2 border rounded-md"
                // required
              />
            </div>
          
          <div className="flex flex-col w-full">
            <label className="block text-sm font-semibold mb-1">
              Home Slider Images
            </label>

            <div className="relative flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md h-50 cursor-pointer hover:border-blue-500 bg-blue-50 transition-colors">
              <input
                  type="file"
                  name="home_slider_image"
                  accept="image/*"
                  multiple
                  onChange={(e) =>
                    setForm({
                      ...form,
                      home_slider_image: Array.from(e.target.files), // ✅ convert FileList to array
                    })
                  }
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

              <div className="flex flex-col items-center justify-center pointer-events-none ">
                <UploadCloud className="w-8 h-8 text-blue-500" />
                <div className="flex items-center text-blue-500 gap-2">
                  <Plus size={15}/> 
                <p className="text-blue-500 text-sm flex">
                   Add one or more images here
                </p>
                </div>
                {form.home_slider_image?.length > 0 && (
                    <div className=" text-green-600 text-xs text-center">
                      <p>Selected: {form.home_slider_image.length} Images</p>
                    </div>
                  )}
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-10">
            <button
              type="submit"
              className="bg-blue-800 text-white px-4 py-2 rounded-md"
            >
              {editingHomeSliderId ? "Update" : "Submit"}
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
