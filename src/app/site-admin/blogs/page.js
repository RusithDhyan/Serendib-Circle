"use client";
import { BadgePlus, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useData } from "@/app/context/DataContext";
import AddBlog from "../(components)/(hotels)/(forms)/AddBlog";
import Breadcrumbs from "../(components)/Breadcrumbs";
import { useSession } from "next-auth/react";

export default function BlogPage() {
  const { data: session } = useSession();
  const { blogs} = useData();
  const [showPopup, setShowPopup] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [search, setSearch] = useState("");

  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(search.toLowerCase())
  );

  const currentBlogs = filteredBlogs.slice();

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this Blog?")) return;

    const res = await fetch(`/api/site-admin/blogs/${id}`, { method: "DELETE" });
    const result = await res.json();
    if (result.success || result.message === "Blog deleted") {
      // fetchBlog();
    } else {
      alert("Delete failed.");
    }
  };

  return (
    <div className="flex">
    
      <div
        className={`
          flex-1 transition-all duration-300          
        `}
      >
        <Breadcrumbs />
        <div className="flex items-center justify-between px-6 py-2 my-5 border-b border-gray-300 mx-4">
          <h1 className="sm:text-xl 2xl:text-2xl font-bold">All-Site Blogs</h1>
          <div className="flex justify-center items-center">
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            className="border border-gray-300 px-3 py-1 hover:bg-blue-50 rounded-md text-sm"
          />
        </div>
        {session?.user?.permissions?.canCreateBlog && (
          <button
            onClick={() => setShowPopup(true)}
            className="group flex items-center gap-2 px-3 py-1 text-sm border text-serendib-primary border-serendib-primary rounded-md hover:bg-serendib-secondary hover:text-white font-bold transition"
          >
            <BadgePlus
              size={18}
              strokeWidth={1.4}
              className="text-serendib-primary group-hover:text-white"
            />
            Add Blog
          </button>
        )}
        </div>
        
        {currentBlogs.length === 0 && (
          <div className="flex h-full items-center justify-center px-6 mx-4 shadow-md rounded-md">
            <p className="text-gray-500 text-center">
              No blogs available for this site.
            </p>
          </div>
        )}

        {!session?.user?.permissions?.canReadBlog ? (
        <div className="p-6 text-center text-gray-500">
          You do not have permission to view all blogs.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 px-6 mt-10 pb-5">
          {currentBlogs.map((blog) => (
            <div key={blog._id} className="bg-white rounded-md shadow-md overflow-hidden hover:shadow-lg transition duration-300">
              <div className="w-full sm:h-50 2xl:h-60 relative">
                <Link href={`/site-admin/blogs/${blog._id}`}>
                  <Image
                    src={blog.thumbnail}
                    alt={blog.title}
                    fill
                    className="w-full h-full object-cover"
                  />
                </Link>
              </div>
              {/* Title & Description */}
              <div className="p-4 flex flex-col gap-2">
                <h2 className="text-lg font-semibold text-gray-800">
                  {blog.title}
                </h2>
                <p className="text-sm text-gray-600">{blog.description}</p>
                <div className="flex gap-3 mt-2">
                  {session?.user?.permissions?.canUpdateBlog && (
                  <button
                    onClick={() => {
                      setEditingBlog(blog);
                      setShowPopup(true);
                    }}
                    className="flex items-center gap-1 px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    <Pencil size={16} strokeWidth={1.7}/> Edit
                  </button>
                  )}

                  {session?.user?.permissions?.canDeleteBlog && (
                  <button
                    onClick={() => handleDelete(blog._id)}
                    className="group flex items-center gap-1 px-3 py-1 text-sm border border-red text-red-500 rounded-md hover:bg-red-500 hover:text-white font-bold"
                  >
                    <Trash2
                      size={16}
                      strokeWidth={1.4}
                      className="text-red-500 group-hover:text-white"
                    />
                    Delete
                  </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
       )}
        {showPopup && (
          <AddBlog
            onClose={() => {
              setShowPopup(false);
              setEditingBlog(null);
            }}
            editingBlog={editingBlog}
          />
        )}
      </div>
    </div>
  );
}
