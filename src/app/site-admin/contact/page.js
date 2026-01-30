"use client";
import { useData } from "@/app/context/DataContext";
import { BadgePlus } from "lucide-react";
import { useState } from "react";
import Breadcrumbs from "../(components)/Breadcrumbs";
import ContactContent from "../(components)/(contact)/ContactContent";
import AddContactContent from "../(components)/(hotels)/(forms)/AddContactContent";
import { useSession } from "next-auth/react";

export default function ContactPage() {
  const { data: session } = useSession();
  const [showContactContentPopup, setShowContactContentPopup] = useState(false);
  const [editingContactContent, setEditingContactContent] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="flex-1 mt-12 ml-64">
      <div>
        <Breadcrumbs />
        <h1 className="sm:text-2xl 2xl:text-4xl font-bold text-center">
          Contact Page
        </h1>
        {session?.user?.permissions?.canCreateContactContent && (
          <div className="flex items-center justify-between px-3 mt-10 border-b sm:w-70 2xl:w-80 mx-3">
            <h1 className="sm:text-xl 2xl:text-2xl font-bold">
              Add Contact Content
            </h1>
            <button
              onClick={() => setShowContactContentPopup(true)}
              className="text-sm text-blue-500 rounded-md transition"
            >
              <BadgePlus
                size={25}
                strokeWidth={1.4}
                className="text-green-500"
              />
            </button>
          </div>
        )}

        <ContactContent />

        {showContactContentPopup && (
          <AddContactContent
            onClose={() => {
              setShowContactContentPopup(false);
              setEditingContactContent(null);
            }}
            editingContactContent={editingContactContent}
          />
        )}
      </div>
    </div>
  );
}
