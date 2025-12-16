"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Home,
  MountainSnow,
  ChevronRight,
  Building2,
  FileText,
  Tag,
  User,
  Lightbulb,
  Grid,
  MessageCircle,
  UserPlus,
} from "lucide-react";
import React from "react";

const breadcrumbMap = {
  dashboard: { label: "", icon: Grid},
  hotels: { label: "Our Collection", icon: Building2 },
  experiences: { label: "Experiences", icon: MountainSnow },
  blogs: { label: "Blogs", icon: FileText },
  about: { label: "About Us", icon: Lightbulb },
  offers: { label: "Offers", icon: Tag },
  homeContent: { label: "Home Content", icon: Home},
  contact: { label: "Contact", icon: MessageCircle},
  addUsers: {label: "Add User", icon: UserPlus},
  profile: { label: "Profile", icon: User },
};

const Breadcrumbs = () => {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const paths = segments.map(
    (_, i) => "/" + segments.slice(0, i + 1).join("/")
  );

  return (
    <nav className="flex items-center text-sm flex-wrap p-2">
      <Link
        href="/dashboard"
        className="flex items-center hover:text-[#dfb98d]"
      >
        {React.createElement(breadcrumbMap["dashboard"]?.icon, {
          size: 20,
          strokeWidth: 1,
          className: "",
        })}
        {breadcrumbMap[""]?.label || ""}
      </Link>

      {paths.map((path, index) => {
        const segment = segments[index];
        const { label, icon } = breadcrumbMap[segment] || {
          label: segment.charAt(0).toUpperCase() + segment.slice(1),
        };

        return (
          <span key={path} className="flex items-center">
            <span className="mx-1 flex items-center justify-center">
              <ChevronRight size={15} />
            </span>
            <Link
              href={path}
              className="flex items-center justify-center hover:text-[#dfb98d] transition duration-200"
            >
              {icon &&
                React.createElement(icon, { size: 18,strokeWidth: 2, className: "mr-1 items-center text-[#dfb98d]" })}
              {label && <span className="text-[#dfb98d] font-bold">{label}</span>}
            </Link>
          </span>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
