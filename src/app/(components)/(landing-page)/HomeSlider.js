"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function HomeSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const homeSlider = [
    { url: "/all-images/images/cover-image1-new.jpg" },
    { url: "/all-images/images/cover-image2.jpg" },
    { url: "/all-images/images/cover-image3.jpg" },
    { url: "/all-images/images/cover-img4.jpg"}
  ];

  // Auto change image every 5s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % homeSlider.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [homeSlider.length]);


  return (
    <div className="home-slider relative w-full h-screen">
      {/* Overlay content */}
      <div className="absolute inset-0 z-10 flex justify-left items-center sm:px-10 pointer-events-none">
        <div className="flex flex-col">
          <h1 className="text-2xl md:text-3xl lg:text-6xl 2xl:text-8xl text-white font-bold px-2 text-left drop-shadow-md">
            Serendib Hotel <br />
            Management System
          </h1>
          <p className="px-2 text-white">
            Situated along the N265 in Liwonde, Waters Edge Hotel offers a
            peaceful retreat with scenic surroundings <br /> and sweeping views
            of the natural landscape...
          </p>
        </div>
      </div>

      {/* Slideshow images */}
      <div className="absolute inset-0">
        {homeSlider.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={slide.url}
              alt={`slide-${index}`}
              fill
              className="object-cover"
              priority={index === 0}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
