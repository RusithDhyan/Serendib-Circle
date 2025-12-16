"use client";

import Link from "next/link";
import {
  User,
  Tag,
  MountainSnow,
  FileText,
  Building2,
  Logs,
  Lightbulb,
  MessageCircle,
  HomeIcon,
  Grid,
  User2,
  UserPlus,
} from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Sidebar({ isHovered }) {
  const pathname = usePathname();
  const isActive = (path) => pathname === path;

  return (
    <div
      className="
        group
        w-20 sm:hover:w-52 2xl:hover:w-64
        min-h-screen bg-gray-100 shadow-md transition-all duration-300 
        fixed top-0 left-0 z-50
      "
    >
      {/* Header */}
      <div className="flex items-center justify-center px-4 py-3">
        {isHovered ? (
          <Image
            src="/all-images/logo/Serendib.png"
            width={200}
            height={40}
            alt="Logo"
            className="object-cover w-50 h-20 transition-opacity duration-300"
          />
        ) : (
          <Logs size={30} color="orange" />
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 flex-col items-center justify-center mt-2 sm:space-y-2 2xl:space-y-4 px-3 ml-2">
        <SidebarLink
          href="/dashboard"
          icon={<Grid size={20} strokeWidth={1}/>}
          label="Dashboard"
          isActive={isActive("/dashboard")}
        />
        <SidebarLink
          href="/hotels"
          icon={<Building2 size={20} strokeWidth={1}/>}
          label="Our Collection"
          isActive={isActive("/hotels")}
        />
        <SidebarLink
          href="/offers"
          icon={<Tag size={20} strokeWidth={1}/>}
          label="Offers"
          isActive={isActive("/offers")}
        />
        <SidebarLink
          href="/experiences"
          icon={<MountainSnow size={20} strokeWidth={1}/>}
          label="Experiences"
          isActive={isActive("/experiences")}
        />
        <SidebarLink
          href="/blogs"
          icon={<FileText size={20} strokeWidth={1}/>}
          label="Blogs"
          isActive={isActive("/blogs")}
        />
        <SidebarLink
          href="/homeContent"
          icon={<HomeIcon size={20} strokeWidth={1}/>}
          label="Home Page"
          isActive={isActive("/homeContent")}
        />
        <SidebarLink
          href="/about"
          icon={<Lightbulb size={20} strokeWidth={1}/>}
          label="About Page"
          isActive={isActive("/about")}
        />
        <SidebarLink
          href="/contact"
          icon={<MessageCircle size={20} strokeWidth={1}/>}
          label="Contact Page"
          isActive={isActive("/contact")}
        />
        <SidebarLink
        href="/addUsers"
        icon={<UserPlus size={20} strokeWidth={1}/>}
        label="Add Users"
        isActive={isActive("/addUsers")}
        />
        <SidebarLink
          href="/profile"
          icon={<User size={20} strokeWidth={1}/>}
          label="Profile"
          isActive={isActive("/profile")}
        />
      </nav>
    </div>
  );
}

function SidebarLink({ href, icon, label, isActive }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-4 p-3 rounded-full shadow-sm transition-all duration-200 hover:text-white
        ${isActive ? "bg-[#dfb98d] text-white" : "hover:bg-[#D9C6B1]"}
      `}
    >
      <span>{icon}</span>
      <span className="hidden group-hover:inline transition-opacity duration-200 sm:text-sm 2xl:text-lg ">
        {label}
      </span>
    </Link>
  );
}
