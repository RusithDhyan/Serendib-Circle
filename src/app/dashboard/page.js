"use client";
import React, { useState } from "react";
import Sidebar from "../(components)/Sidebar";
import DashboardCard from "../(components)/(dashboard)/DashboardCard";
import HotelTable from "../(components)/(dashboard)/HotelTable";
import ProtectedRoute from "../(components)/ProtectedRoute";
export default function Dashboard() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <ProtectedRoute>
    <div className="flex">
      <div
        className={`
          bg-gray-100 shadow-md transition-all duration-300
          ${isHovered ? "w-64" : "w-20"}
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
        <DashboardCard />
        
        <HotelTable />
      </div>
    </div>
    </ProtectedRoute>
  );
}
