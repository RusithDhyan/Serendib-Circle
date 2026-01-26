"use client";
import { BadgePlus } from "lucide-react";
import { useState } from "react";
import AddAnyUsers from "../(components)/(users)/AddAnyUsers";
import Breadcrumbs from "../(components)/Breadcrumbs";

export default function ContactPage() {
  
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="flex">
      <div
        className={`
          flex-1 transition-all duration-300
          
        `}
      >
        <Breadcrumbs />
        <AddAnyUsers/>
        
      </div>
    </div>
  );
}
