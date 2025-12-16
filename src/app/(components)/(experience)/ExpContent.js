"use client";
import { useCallback, useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";
import AddExpContent from "./AddExpContent";

export default function ExpContent({ expId }) {
  const [showPopup, setShowPopup] = useState(false);
  const [editingExpContent, setEditingContent] = useState(null);

  const [contents, setContent] = useState([]);

  const fetchContent =useCallback(async () => {
    const res = await fetch(`/api/exp-content?expId=${expId}`);
    const data = await res.json();
    if (data.success) setContent(data.data);
  },[expId])

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this Experience?")) return;

    const res = await fetch(`/api/exp-content/${id}`, { method: "DELETE" });
    const result = await res.json();
    if (result.success || result.message === "Experience deleted") {
      fetchContent();
    } else {
      alert("Delete failed.");
    }
  };

  return (
    <div className="mt-4 space-y-4 shadow-md py-10 px-4">
      {contents.length === 0 && (
        <p className="text-gray-500 text-center">
          No Exp content available for this site.
        </p>
      )}
      {contents?.map((content) => (
        <div
          key={content._id}
          className="pb-4"
        >
          <p className="text-lg font-semibold mt-2">{content.title}</p>
          <div className="flex gap-4">      
              
             <p className="text-sm mt-2 text-gray-500">{content.description}</p>
          </div>
          <div className="space-y-2 mt-2">
            {content.bulletPoints.map((point, index) => (
              <div key={index} className="flex items-start gap-2">
                <CheckCircle size={18} strokeWidth={1.4} className="text-green-600 mt-1" />
                <span className="text-gray-700">{point}</span>
              </div>
            ))}
          </div>
          <div className="space-x-2 mt-2 flex items-center justify-end gap-2">
            <button
              onClick={() => {
                setEditingContent(content);
                setShowPopup(true);
              }}
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(content._id)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
      {showPopup && (
        <AddExpContent
          onClose={() => {
            setShowPopup(false);
            setEditingContent(null);
          }}
          editingExpContent={editingExpContent}
          ExpId={expId}
        />
      )}
    </div>
  );
}
