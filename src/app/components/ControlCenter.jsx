"use client";
import { useState } from "react";
import { Settings, Save } from "lucide-react";

export default function ControlCenter({ user, onUpdate }) {
  const [dietaryPreferences, setDietaryPreferences] = useState(
    user.dietaryPreferences || []
  );
  const [roomPreferences, setRoomPreferences] = useState(
    user.roomPreferences || []
  );
  const [explorePreferences, setExplorePreferences] = useState(
    user.explorePreferences || []
  );
  const [isSaving, setIsSaving] = useState(false);
  const dietaryOptions = [
    "Vegetarian",
    "Vegan",
    "Gluten-Free",
    "Dairy-Free",
    "Halal",
    "Kosher",
    "No Seafood",
    "Nut Allergies",
  ];
  const roomOptions = [
    "Ocean View",
    "City View",
    "High Floor",
    "Low Floor",
    "King Bed",
    "Twin Beds",
    "Smoking",
    "Non-Smoking",
    "Quiet Location",
    "Near Elevator",
  ];
  const exploreOptions = ["Experience", "Location", "Dining"];

  const togglePreference = (list, setList, item) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dietaryPreferences,
          roomPreferences,
          explorePreferences,
        }),
      });
      if (response.ok) {
        alert("Preferences saved successfully!");
        onUpdate();
      } else {
        alert("Failed to save preferences");
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="text-serendib-primary" size={24} />
        <h2 className="text-xl font-semibold">Control Center</h2>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="text-sm font-semibold text-gray-900 mb-2">
          Stay History
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-gray-600">Total Stays</div>
            <div className="text-2xl font-bold text-serendib-primary">
              {user.totalStays}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-600">Member Since</div>
            <div className="text-sm font-semibold">
              {new Date(user.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Explore</h3>
          <div className="flex flex-wrap gap-2">
            {exploreOptions.map((option) => (
              <button
                key={option}
                onClick={() =>
                  togglePreference(
                    explorePreferences,
                    setExplorePreferences,
                    option
                  )
                }
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  explorePreferences.includes(option)
                    ? "bg-serendib-primary text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
        {/* <div>
          <h3 className="font-semibold text-gray-900 mb-3">Dietary Preferences</h3>
          <div className="flex flex-wrap gap-2">
            {dietaryOptions.map((option) => (
              <button key={option} onClick={() => togglePreference(dietaryPreferences, setDietaryPreferences, option)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${dietaryPreferences.includes(option) ? 'bg-serendib-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                {option}
              </button>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Room Preferences</h3>
          <div className="flex flex-wrap gap-2">
            {roomOptions.map((option) => (
              <button key={option} onClick={() => togglePreference(roomPreferences, setRoomPreferences, option)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${roomPreferences.includes(option) ? 'bg-serendib-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                {option}
              </button>
            ))}
          </div>
        </div> */}
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full btn-primary flex items-center justify-center gap-2"
        >
          <Save size={18} />
          {isSaving ? "Saving..." : "Save Preferences"}
        </button>
      </div>
    </div>
  );
}
