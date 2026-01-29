"use client";
import { useCallback, useEffect, useState } from "react";
import AddBlogContent from "./(forms)/AddBlogContent";
import Image from "next/image";
import { Goal } from "lucide-react";
import { useData } from "@/app/context/DataContext";
import { getBlogContentByBlog } from "@/lib/fetchData";
import { useSession } from "next-auth/react";

export default function BlogContent({ blogId }) {
  const { data: session } = useSession();
  const [showPopup, setShowPopup] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [blogContent, setBlogContent] = useState([]);

  const fetchContent = useCallback(async () => {
    

    const blogContent = await getBlogContentByBlog(blogId);
    console.log("Fetched BlogContent:", blogContent);

    if (blogContent) setBlogContent(blogContent);
  }, [blogId]); // ✅ stable function, only changes when blogId changes

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this Experience?")) return;

    const res = await fetch(`/api/site-admin/blog-content/${id}`, { method: "DELETE" });
    const result = await res.json();
    if (result.success || result.message === "Experience deleted") {
      fetchContent();
    } else {
      alert("Delete failed.");
    }
  };

  return (
    <div className="mt-4 space-y-4 shadow-md py-10 px-4">
      {blogContent.length === 0 && (
        <p className="text-gray-500 text-center">
          No blog content available for this site.
        </p>
      )}

      {!session?.user?.permissions?.canReadBlogContent ? (
        <div className="p-6 text-center text-gray-500">
          You do not have permission to view  blog contents.
        </div>
      ) : (
        <div>
      {blogContent?.map((content) => (
        <div key={content._id} className=" pb-4">
          <p className="text-lg font-semibold mt-2">{content.title}</p>
          <div className="flex gap-4">
            <Image
              src={content.image}
              alt="image-right"
              width={1000}
              height={10}
              className="w-60 h-20 object-cover rounded-md mt-2"
            />
            <div>
              <p className="text-sm mt-2 text-gray-500">
                {content.description}
              </p>
              <h1 className="text-lg mt-1 underline">{content.bullet_title}</h1>
              {content?.bulletPoints && content?.bulletPoints.length > 0 && (
                <>
                  <div>
                    {content?.bulletPoints.map((point, index) => (
                      <div key={index} className="flex items-start gap-3 my-2">
                        <div>
                          <Goal size={15} strokeWidth={1.5} />
                        </div>
                        <p className="text-xs font-light">{point}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="space-x-2 mt-2 flex items-center justify-end gap-2">
            {session?.user?.permissions?.canUpdateBlogContent && (
            <button
              onClick={() => {
                setEditingContent(content);
                setShowPopup(true);
              }}
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              Edit
            </button>
            )}
            {session?.user?.permissions?.canDeleteBlogContent && (
            <button
              onClick={() => handleDelete(content._id)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
            )}
          </div>
        </div>
      ))}
      </div>
    )}
      {showPopup && (
        <AddBlogContent
          onClose={() => {
            setShowPopup(false);
            setEditingContent(null);
          }}
          editingBlogContent={editingContent}
          blogId={blogId}
        />
      )}
    </div>
  );
}
