"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function PermissionAccordion({ permissions, handleToggle }) {
  const [openSection, setOpenSection] = useState(null);

  const modules = {
    Hotels: [
      "canCreateHotel",
      "canReadHotel",
      "canUpdateHotel",
      "canDeleteHotel",
      "canCreateAccommodation",
      "canReadAccommodation",
      "canUpdateAccommodation",
      "canDeleteAccommodation",
      "canCreatePageExp",
      "canReadPageExp",
      "canUpdatePageExp",
      "canDeletePageExp",
      "canCreateGallery",
      "canReadGallery",
      "canUpdateGallery",
      "canDeleteGallery",
      "canCreateService",
      "canReadService",
      "canUpdateService",
      "canDeleteService",
    ],
    Offers: [
      "canCreateOffer",
      "canReadOffer",
      "canUpdateOffer",
      "canDeleteOffer",
    ],
    Experiences: [
      "canCreateExperience",
      "canReadExperience",
      "canUpdateExperience",
      "canDeleteExperience",
    ],
    Blogs: [
      "canCreateBlog",
      "canReadBlog",
      "canUpdateBlog",
      "canDeleteBlog",
      "canCreateBlogContent",
      "canReadBlogContent",
      "canUpdateBlogContent",
      "canDeleteBlogContent",
    ],
    HomeContent: [
      "canCreateHomeSlider",
      "canReadHomeSlider",
      "canUpdateHomeSlider",
      "canDeleteHomeSlider",
      "canCreateHomeTop",
      "canReadHomeTop",
      "canUpdateHomeTop",
      "canDeleteHomeTop",
      "canCreateHomeMiddle",
      "canReadHomeMiddle",
      "canUpdateHomeMiddle",
      "canDeleteHomeMiddle",
      "canCreateHomeExp",
      "canReadHomeExp",
      "canUpdateHomeExp",
      "canDeleteHomeExp",
      "canCreateHomeBottom",
      "canReadHomeBottom",
      "canUpdateHomeBottom",
      "canDeleteHomeBottom",
    ],
    About: [
      "canCreateAboutTop",
      "canReadAboutTop",
      "canUpdateAboutTop",
      "canDeleteAboutTop",
      "canCreateAboutMiddle",
      "canReadAboutMiddle",
      "canUpdateAboutMiddle",
      "canDeleteAboutMiddle",
      "canCreateAboutBottom",
      "canReadAboutBottom",
      "canUpdateAboutBottom",
      "canDeleteAboutBottom",
    ],
    Contact: [
      "canCreateContactContent",
      "canReadContactContent",
      "canUpdateContactContent",
      "canDeleteContactContent",
    ],
    Users: [
      "canCreateUsers",
      "canReadUsers",
      "canUpdateUsers",
      "canDeleteUsers",
    ],
    Reports: ["canViewReports", "canPrintReports"],
    Permissions: ["canViewPermissions"],
  };

  const toggleSection = (key) => {
    setOpenSection(openSection === key ? null : key);
  };

  return (
    <div className="w-full border rounded-xl divide-y bg-white shadow-sm">
      {Object.entries(modules).map(([section, keys]) => (
        <div key={section}>
          {/* Accordion Header */}
          <button
            onClick={() => toggleSection(section)}
            className="w-full flex justify-between items-center px-5 py-3 text-left bg-gray-50 hover:bg-gray-100 transition"
          >
            <span className="font-semibold text-gray-800 capitalize">
              {section}
            </span>
            {openSection === section ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}
          </button>

          {/* Accordion Body */}
          {openSection === section && (
            <div className="px-6 py-3 grid grid-cols-1 sm:grid-cols-2 gap-y-5 rounded-b-xl">
              {keys.map((key) => (
                <div
                  key={key}
                  className="flex items-center justify-between border-b pb-2 px-2"
                >
                  <span className="capitalize text-sm">
                    {key
                      .replace(/can/, "")
                      .replace(/([A-Z])/g, " $1")
                      .trim()}
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={permissions[key] || false}
                      onChange={() => handleToggle(key)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-serendib-secondary transition"></div>
                    <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full peer-checked:translate-x-5 transition-transform"></div>
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
