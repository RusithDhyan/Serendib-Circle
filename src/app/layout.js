// src/app/layout.js
export const revalidate = 0;

import "./globals.css";
import Navbar from "./site-admin/(components)/Navbar";
import { DataProvider } from "./context/DataContext";
import { fetchAllData } from "@/lib/fetchData";
import SessionProvider from "./components/SessionProvider";

export const metadata = {
  title: "HMS_Serendib",
  description: "Hotel Management System",
};

export default async function RootLayout({ children }) {
  // const initialData = await fetchAllData();

  return (
    <html lang="en" className="">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="transition-colors duration-300 bg-white text-black">
        {/* <DataProvider initialData={initialData}>
          <div className="flex flex-col">
            <Navbar />
            <main className="flex-grow">{children}</main>
          </div>
        </DataProvider> */}
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
