"use client";
import AddBlogContent from "@/app/site-admin/(components)/(blog)/(forms)/AddBlogContent";
import BlogContent from "@/app/site-admin/(components)/(blog)/BlogContent";
import { useData } from "@/app/context/DataContext";
import { BadgePlus, CircleChevronLeft, CircleChevronRight, Sidebar } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getBlog } from "@/lib/fetchData";

export default function BlogInnerPage() {
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [showBlogContentPopup, setShowBlogContentPopup] = useState(false);
  const [editingBlogContent, setEditingBlogContent] = useState(null);
  const { data: session } = useSession();

  const [blog, setBlogs] = useState({});
  console.log(blog)
  const { id } = useParams();

  useEffect(() => {
    const images = blog?.image_slider || [];

    if (images.length > 0) {
      const interval = setInterval(() => {
        setIndex((prev) => (prev + 1) % images.length);
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [blog]);

  useEffect(() => {
    const fetchBlog = async () => {
      const blogs = await getBlog();
      const blog = blogs.find((b) => b._id === id);
      setBlogs(blog);
    };
    if (id) fetchBlog();
  }, [id]);

  if (!blog) return <div>Loading...</div>;

  return (
    <div className="flex">
      
      <div
        className={`
          flex-1 transition-all duration-300 `}
      >
        <h1 className="sm:text-2xl 2xl:text-4xl text-center font-bold mt-10">
          {blog.title}
        </h1>
        <div className="flex flex-col md:flex-row gap-6 bg-white  rounded-lg shadow-md pt-5">
          {/* Left Side: Text Info */}
          <div className="md:w-1/2 space-y-2 p-4">
          <h2 className="sm:text-lg 2xl:text-xl font-bold">
            Title : <span className="text-md text-gray-700">{blog.main_title}</span>
          </h2>
          <p className="sm:text-lg 2xl:text-xl font-bold">
            Description : <span className="text-sm text-gray-700">{blog.main_description}</span>
          </p>
           <p className="sm:text-lg 2xl:text-xl font-bold">
            Body Title : <span className="text-sm text-gray-700">{blog.body_title}</span>
          </p>
          <p className="sm:text-lg 2xl:text-xl font-bold">
            Body Description : <span className="text-sm text-gray-700">{blog.body_description}</span>
          </p>
          </div>

          {/* Right Side: 3 Images in a row */}
          <div className="flex justify-between w-1/2">
            <div className="relative group md:w-1/2">
              <Image
                src={blog.thumbnail}
                alt="Room 1"
                width={1000}
                height={100}
                className="w-auto h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white opacity-0 group-hover:opacity-100 transition-all duration-700">
                <h1 className="sm:text-lg sm:text-2xl font-bold mb-4">
                  Thumbnail Image
                </h1>
              </div>
            </div>
            <div className="relative group md:w-1/2">
              <Image
                src={blog.bg_image}
                alt="Room 2"
                width={1000}
                height={100}
                className="w-auto h-full object-cover rounded-r"
              />
              <div className="absolute inset-0 bg-black/40 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white opacity-0 group-hover:opacity-100 transition-all duration-700">
                <h1 className="sm:text-lg sm:text-2xl font-bold mb-4">
                  Background Image
                </h1>
              </div>
            </div>
            <div className="relative group md:w-1/2">
              <Image
                src={blog.cover_image}
                alt="Room 3"
                width={1000}
                height={100}
                className="w-auto h-full object-cover rounded-r"
              />
              <div className="absolute inset-0 bg-black/40 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white opacity-0 group-hover:opacity-100 transition-all duration-700">
                <h1 className="sm:text-lg sm:text-2xl font-bold mb-4">
                  Cover Image
                </h1>
              </div>
            </div>
          </div>
        </div>

          {session?.user?.permissions?.canCreateBlogContent && (
        <div className="flex items-center justify-center gap-3 px-3 mt-10  border-b sm:w-61 2xl:w-70">
          <h1 className="sm:text-xl 2xl:text-2xl font-bold">Add Blog Content</h1>
          <button
            onClick={() => setShowBlogContentPopup(true)}
            className="text-sm text-blue-500 rounded-md transition"
          >
            <BadgePlus size={25} className="text-green-500" />
          </button>
        </div>
          )}
        <BlogContent blogId={blog._id} />
        {showBlogContentPopup && (
          <AddBlogContent
            onClose={() => {
              setShowBlogContentPopup(false);
              setEditingBlogContent(null);
            }}
            editingBlogContent={editingBlogContent}
            blogId={blog._id}
          />
        )}
      </div>
    </div>
  );
}
