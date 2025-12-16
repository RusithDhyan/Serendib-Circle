"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Sidebar from "../Sidebar";
import { useData } from "@/app/context/DataContext";
import CommonTable from "./CommonTable";

export default function InquiriesClient() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("hotel"); 
  const { hotelInquiries, expInquiries, contactInquiries, newsLetter } = useData();
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const tabFromQuery = searchParams.get("tab") || "hotel";
    setActiveTab(tabFromQuery);
  }, [searchParams]);

  const renderTable = () => {
    switch (activeTab) {
      case "hotel":
        return (
          <CommonTable
            data={hotelInquiries}
            searchField="hotel"
            columns={[
              { header: "Name", accessor: "name" },
              { header: "Email", accessor: "email" },
              { header: "Phone", accessor: "phone" },
              { header: "Guests", accessor: "guests" },
              { header: "Inquiry Type", accessor: "inquiry_type" },
              { header: "Hotel Name", accessor: "hotel" },
              { header: "Message", accessor: "message" },
              { header: "IP Address", accessor: "ip_address" },
            ]}
          />
        );
      case "experience":
        return (
          <CommonTable
            data={expInquiries}
            searchField="title"
            columns={[
              { header: "Name", accessor: "name" },
              { header: "Email", accessor: "email" },
              { header: "Phone", accessor: "phone" },
              { header: "Experience Type", accessor: "exp_type" },
              { header: "Title", accessor: "title" },
              { header: "Message", accessor: "message" },
              { header: "IP Address", accessor: "ip_address" },
            ]}
          />
        );
      case "contact":
        return (
          <CommonTable
            data={contactInquiries}
            searchField="name"
            columns={[
              { header: "Name", accessor: "name" },
              { header: "Email", accessor: "email" },
              { header: "Phone", accessor: "phone" },
              { header: "Inquiry Type", accessor: "inquiry_type" },
              { header: "Hotel Name", accessor: "hotel_name" },
              { header: "Message", accessor: "message" },
              { header: "IP Address", accessor: "ip_address" },
            ]}
          />
        );
      case "newsletter":
        return (
          <CommonTable
            data={newsLetter}
            searchField="email"
            columns={[
              { header: "Email", accessor: "email" },
              {
                header: "Date",
                render: (item) => new Date(item.createdAt).toLocaleString(),
              },
              { header: "IP Address", accessor: "ip_address" },
            ]}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`
          bg-gray-100 shadow-md min-h-screen transition-all duration-300
          ${isHovered ? "w-64" : "w-20"}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Sidebar isHovered={isHovered} />
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 ${
          isHovered ? "ml-1" : "ml-1"
        }`}
      >
        {/* Tabs */}
        <div className="flex items-center justify-center gap-4 my-6">
          {["hotel", "experience", "contact", "newsletter"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 px-4 font-semibold text-xl ${
                activeTab === tab
                  ? "border-b-2 border-[#dfb98d] text-[#dfb98d] "
                  : "text-gray-500 hover:text-[#dfb98d]"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}{" "}
              {tab !== "newsletter" && "Inquiries"}
            </button>
          ))}
        </div>

        {/* Table */}
        {renderTable()}
      </div>
    </div>
  );
}
