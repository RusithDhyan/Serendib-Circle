"use client";
import { BadgePlus } from "lucide-react";
import { useState } from "react";
import AddAnyUsers from "../(components)/(users)/AddAnyUsers";
import Breadcrumbs from "../(components)/Breadcrumbs";

export default function ContactPage() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="flex-1 mt-12 ml-64">
      <div>
        <Breadcrumbs />
        <AddAnyUsers />
      </div>
    </div>
  );
}
