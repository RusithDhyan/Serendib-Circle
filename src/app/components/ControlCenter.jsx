"use client";
import { Settings } from "lucide-react";
import Link from "next/link";

export default function ControlCenter({ user }) {
  const exploreOptions = [
    {
      label: "Experience",
      url: "https://serendibhotels.mw/experiences",
    },
    {
      label: "Location",
      url: "https://serendibhotels.mw/our-collection",
    },
  ];

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
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Explore</h3>
          <div className="flex  gap-2">
            {exploreOptions.map((option, idx) => (
              <Link
                href={option.url}
                key={idx}
                className="px-3 py-2 rounded-lg text-sm font-medium transition-all bg-serendib-primary hover:bg-serendib-secondary text-white"
              >
                {option.label}
              </Link>
            ))}
          </div>
        </div>
    </div>
  );
}
