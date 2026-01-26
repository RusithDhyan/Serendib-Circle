"use client";
import React, { useState } from "react";
import DashboardCard from "../(components)/(dashboard)/DashboardCard";
import HotelTable from "../(components)/(dashboard)/HotelTable";
export default function Dashboard() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="flex">
     
      <div
        className={`
          flex-1 transition-all duration-300          
        `}
      >
        <DashboardCard />
        
        <HotelTable />
      </div>
    </div>
  );
}
