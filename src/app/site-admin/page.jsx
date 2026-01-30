"use client";
import React, { useState } from "react";
import DashboardCard from "../site-admin/(components)/(dashboard)/DashboardCard";
import HotelTable from "../site-admin/(components)/(dashboard)/HotelTable";
import ProtectedRoute from "../site-admin/(components)/ProtectedRoute";
export default function Dashboard() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="flex-1 mt-10 ml-64">
      <div>
        <DashboardCard />

        <HotelTable />
      </div>
    </div>
  );
}
