// src/app/layout.js
import "./globals.css";
import Navbar from "./(components)/Navbar";
import { DataProvider } from "./context/DataContext";
import { fetchAllData } from "@/lib/fetchData";

export const metadata = {
  title: "HMS_Serendib",
  description: "Hotel Management System",
};

export default async function RootLayout({ children }) {
  // ✅ Fetch all data server-side
  const initialData = await fetchAllData();

  return (
    <html lang="en" className="">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="transition-colors duration-300 bg-white text-black">
        {/* Pass the preloaded data to client context */}
        <DataProvider initialData={initialData}>
          <div className="flex flex-col">
            <Navbar />
            <main className="flex-grow">{children}</main>
          </div>
        </DataProvider>
      </body>
    </html>
  );
}
