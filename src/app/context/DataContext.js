"use client";
import { createContext, useContext, useState, useEffect } from "react";
import crypto from "crypto";

const DataContext = createContext({}); // default empty object

export const DataProvider = ({ children, initialData = {} }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [hotels, setHotels] = useState(initialData.hotels || []);
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchUser = async () => {
      try {
        const t = Date.now().toString();
        const cs = crypto
          .createHash("sha256")
          .update(t + process.env.API_KEY)
          .digest("hex");

        const ApiURL =
          process.env.NODE_ENV === "development"
            ? `http://localhost:3001/api/current-user?t=${t}&cs=${cs}`
            : `https://serendib.serendibhotels.mw/api/current-user?t=${t}&cs=${cs}`;

        const res = await fetch(ApiURL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) setCurrentUser(data.data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };

    fetchUser();
  }, []);

  return (
    <DataContext.Provider
      value={{
        currentUser,
        hotels,
        setHotels,
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
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
