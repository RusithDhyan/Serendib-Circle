"use client";
import { createContext, useContext, useState } from "react";

const DataContext = createContext({});

export const DataProvider = ({ children, initialData = {} }) => {
  const [hotels] = useState(initialData.hotels || []);
  const [homeSlider] = useState(initialData.homeSlider || []);
  const [homeExp] = useState(initialData.homeExp || []);
  const [homeTop] = useState(initialData.homeTop || []);
  const [homeMiddle] = useState(initialData.homeMiddle || []);
  const [homeBottom] = useState(initialData.homeBottom || []);
  const [offers] = useState(initialData.offers || []);
  const [experiences] = useState(initialData.experiences || []);
  const [blogs] = useState(initialData.blogs || []);
  const [aboutMiddle] = useState(initialData.aboutMiddle || []);
  const [aboutContent] = useState(initialData.aboutContent || []);
  const [aboutBottom] = useState(initialData.aboutBottom || []);
  const [contactContent] = useState(initialData.contactContent || []);
  const [users] = useState(initialData.users || []);
  const [hotelInquiry] = useState(initialData.hotelInquiry || []);
  const [expInquiry] = useState(initialData.expInquiry || []);
  const [contactInquiry] = useState(initialData.contactInquiry || []);
  const [newsLetter] = useState(initialData.newsLetter || []);

  return (
    <DataContext.Provider
      value={{
        hotels,
        homeSlider,
        homeTop,
        homeMiddle,
        homeBottom,
        homeExp,
        offers,
        experiences,
        blogs,
        aboutMiddle,
        aboutContent,
        aboutBottom,
        contactContent,
        users,
        hotelInquiry,
        expInquiry,
        contactInquiry,
        newsLetter,
      }}
    >
      {/* <DataContext.Provider value={initialData}> */}
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
