"use client";
import { BadgePlus } from "lucide-react";
import Sidebar from "../(components)/Sidebar";
import { useState } from "react";
import Breadcrumbs from "../(components)/Breadcrumbs";
import ProtectedRoute from "../(components)/ProtectedRoute";
import AddAnyUsers from "../(components)/(users)/AddAnyUsers";

export default function ContactPage() {
  
  const [isHovered, setIsHovered] = useState(false);

  return (
    <ProtectedRoute>
    <div className="flex">
      <div
        className={`
          bg-gray-100 shadow-md transition-all duration-300
          ${isHovered ? "sm:w-50 2xl:w-64" : "w-20"}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Sidebar isHovered={isHovered} />
      </div>
      <div
        className={`
          flex-1 transition-all duration-300
          ${isHovered ? "ml-1" : "ml-1"}
          
        `}
      >
        <Breadcrumbs />
        <AddAnyUsers/>
        
      </div>
    </div>
    </ProtectedRoute>
  );
}
