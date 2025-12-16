"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/signup"); // redirect to signup if no token
    } else {
      setIsAuthChecked(true); // token exists, allow render
    }
  }, [router]);

  if (!isAuthChecked) return null; // or show a loader

  return <>{children}</>;
}
