"use client";
import { useData } from "@/app/context/DataContext";
import Image from "next/image";
import Link from "next/link";

export default function DashboardCard() {
  const { hotelInquiryCount } = useData();
  const { expInquiryCount } = useData();
  const { contactCount } = useData();
  const { newsLetterCount } = useData();

  const cards = [
    {
      title: "Hotels Inquiries",
      count: hotelInquiryCount,
      desc: "Hotel booking requests.",
      tab: "hotel",
      image: "/all-images/icons/hotel.png",
    },
    {
      title: "Experience Inquiries",
      count: expInquiryCount,
      desc: "Experience-related queries.",
      tab: "experience",
      image: "/all-images/icons/exp.png",
    },
    {
      title: "Contacts",
      count: contactCount,
      desc: "General contact form messages.",
      tab: "contact",
      image: "/all-images/icons/contact.png",
    },
    {
      title: "Newsletters",
      count: newsLetterCount,
      desc: "Subscribed emails.",
      tab: "newsletter",
      image: "/all-images/icons/newsletter.png",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 sm:p-3 2xl:p-6 sm:mt-5 2xl:mt-10">
      {cards.map((card, index) => (
        <Link
          href={`/all-inquiries?tab=${card.tab}`}
          key={index}
          className="bg-white rounded-xl shadow-md sm:p-2 2xl:p-6 flex flex-col items-center text-center hover:shadow-lg transition hover:bg-orange-200"
        >
          <div className="w-20 h-15 2xl:mb-4 flex items-center justify-center">
            <Image
              src={card.image}
              width={48}
              height={48}
              alt={card.title}
              className="object-contain"
            />
          </div>
          <h3 className="text-lg font-semibold">{card.title}</h3>
          <p className="text-3xl font-bold text-orange-600">
            {card.count ?? 0}
          </p>
          <p className="text-sm text-gray-600 mt-2">{card.desc}</p>
        </Link>
      ))}
    </div>
  );
}
