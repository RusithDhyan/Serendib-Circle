"use client";
import { createContext, useContext, useEffect } from "react";
import crypto from "crypto";

const DataContext = createContext({}); // default empty object

export const DataProvider = ({ children, initialData = {} }) => {

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
    <DataContext.Provider value={initialData}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
