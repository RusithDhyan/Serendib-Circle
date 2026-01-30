"use client";
export const dynamic = "force-dynamic";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import CommonInquiryReport from "../(components)/(report)/CommonInquiryReport";

function ReportPageContent() {
  const searchParams = useSearchParams();
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    const raw = searchParams.get("data");
    if (raw) {
      try {
        const parsed = JSON.parse(decodeURIComponent(raw));
        setReportData(parsed);
      } catch (err) {
        console.error("Invalid report data");
      }
    }
  }, [searchParams]);

  const getReportType = () => {
    if (reportData.length === 0) return null;

    const sample = reportData[0];
    if ("hotel" in sample) return "Hotel Inquiry";
    if ("title" in sample) return "Experience Inquiry";
    if (
      "inquiry_type" in sample &&
      !("hotel" in sample) &&
      !("title" in sample)
    )
      return "Contact";
    if ("createdAt" in sample && "email" in sample) return "Newsletter";

    return null;
  };

  const reportType = getReportType();

  const renderTable = () => {
    switch (reportType) {
      case "Hotel Inquiry":
        return (
          <CommonInquiryReport
            data={reportData}
            type={reportType}
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
      case "Experience Inquiry":
        return (
          <CommonInquiryReport
            data={reportData}
            type={reportType}
            columns={[
              { header: "Name", accessor: "name" },
              { header: "Email", accessor: "email" },
              { header: "Phone", accessor: "phone" },
              { header: "Guests", accessor: "guests" },
              { header: "Experience Type", accessor: "exp_type" },
              { header: "Title", accessor: "title" },
              { header: "Message", accessor: "message" },
              { header: "IP Address", accessor: "ip_address" },
            ]}
          />
        );
      case "Contact":
        return (
          <CommonInquiryReport
            data={reportData}
            type={reportType}
            columns={[
              { header: "Name", accessor: "name" },
              { header: "Email", accessor: "email" },
              { header: "Phone", accessor: "phone" },
              { header: "Inquiry Type", accessor: "inquiry_type" },
              { header: "Message", accessor: "message" },
              { header: "IP Address", accessor: "ip_address" },
            ]}
          />
        );
      case "Newsletter":
        return (
          <CommonInquiryReport
            data={reportData}
            type={reportType}
            columns={[
              { header: "Email", accessor: "email" },
              { header: "Date", accessor: "createdAt" },
              { header: "IP Address", accessor: "ip_address" },
            ]}
          />
        );
      default:
        return null;
    }
  };

  return <div className="p-6 flex">{renderTable()}</div>;
}

export default function ReportPage() {
  return (
    <Suspense fallback={<div>Loading report...</div>}>
      <ReportPageContent />
    </Suspense>
  );
}
