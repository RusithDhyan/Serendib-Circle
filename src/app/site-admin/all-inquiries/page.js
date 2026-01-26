"use client";

import { Suspense } from "react";
import InquiriesClient from "../(components)/(formTable)/InquiriesClient";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6 text-gray-500">Loading inquiries...</div>}>
      <InquiriesClient />
    </Suspense>
  );
}
