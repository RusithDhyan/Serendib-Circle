"use client";
import { useCallback, useEffect, useState } from "react";

export default function AddOfferContent({
  onClose,
  editingOfferContent,
  offerId,
}) {
  const [contents, setOfferContent] = useState([]);

  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    description: "",
    bulletPoints: [""],
    price: "",
    validity: "",
    // image: "",
  });
  const [editingOfferContentId, setEditingOfferContentId] = useState(null);

  const fetchOfferContent = useCallback(async () => {
    const res = await fetch(`/api/offer-content?OfferId=${offerId}`);
    const data = await res.json();
    console.log("Fetched OfferContent:", data.data); // <- add this

    if (data.success) setOfferContent(data.data);
  }, [offerId]);

  useEffect(() => {
    fetchOfferContent();
  }, [fetchOfferContent]);

  useEffect(() => {
    if (editingOfferContent) {
      setForm({
        title: editingOfferContent.title || "",
        subtitle: editingOfferContent.subtitle || "",
        description: editingOfferContent.description || "",
        bulletPoints: editingOfferContent.bulletPoints || [""],
        price: editingOfferContent.price || "",
        validity: editingOfferContent.validity || "",

        // image: editingOfferContent.image || "",
      });
      setEditingOfferContentId(editingOfferContent._id);
    }
  }, [editingOfferContent]);

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
    formData.append("offerId", offerId);
    formData.append("title", form.title);
    formData.append("subtitle", form.subtitle);
    formData.append("description", form.description);
    formData.append("bulletPoints", JSON.stringify(form.bulletPoints));
    formData.append("price", form.price);
    formData.append("validity", form.validity);

    // if (form.image && typeof form.image !== "string") {
    //   formData.append("image", form.image);
    // }

    let res;
    if (editingOfferContentId) {
      res = await fetch(`/api/offer-content/${editingOfferContentId}`, {
        method: "PUT",
        body: formData,
      });
    } else {
      res = await fetch("/api/offer-content", {
        method: "POST",
        body: formData,
      });
    }

    const result = await res.json();
    if (result.success) {
      setForm({
        title: "",
        subtitle: "",
        description: "",
        bulletPoints: [""],
        price: "",
        validity: "",
        // image: "",
      });
      setEditingOfferContentId(null);
      fetchOfferContent();
      onClose();
    } else {
      alert("Error: " + result.error);
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-4xl">
        <h1 className="text-2xl text-center font-bold mb-4">
          {editingOfferContentId
            ? "Edit Offer Content"
            : "Add New Offer Content"}
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
                required
              />
            </div>
            <div>
              <label>Subtitle</label>
              <input
                type="text"
                name="subtitle"
                placeholder="Subtitle"
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label>Price</label>
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label>Validity</label>
              <input
                type="text"
                name="validity"
                placeholder="validity"
                value={form.validity}
                onChange={(e) => setForm({ ...form, validity: e.target.value })}
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
              required
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
              {editingOfferContentId ? "Update" : "Submit"}
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
