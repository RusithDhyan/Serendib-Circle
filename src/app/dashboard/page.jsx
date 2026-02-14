"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import Navbar from "../components/Navbar";
import TierTracker from "../components/TierTracker";
import RecentTransactions from "../components/RecentTransactions";
import RedemptionCenter from "../components/RedemptionCenter";
import ControlCenter from "../components/ControlCenter";
import BalanceCard from "../components/BalanceCard";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/auth/signin");
    }
  }, [status]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchUserData();
      fetchTransactions();
    }
  }, [status]);

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/user");
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await fetch("/api/transactions");
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const refreshData = () => {
    fetchUserData();
    fetchTransactions();
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-serendib-primary"></div>
      </div>
    );
  }

  if (!userData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={userData} />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {userData.name}!
          </h1>
          <p className="text-gray-600">
            Manage your rewards and track your progress
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <BalanceCard user={userData} />
          </div>
          <div>
            <TierTracker user={userData} />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <RedemptionCenter user={userData} onRedeem={refreshData} />
          <ControlCenter user={userData} onUpdate={refreshData} />
        </div>

        <div>
          <RecentTransactions transactions={transactions} />
        </div>
      </div>
    </div>
  );
}
