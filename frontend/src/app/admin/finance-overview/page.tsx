"use client";

import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";
import TopBar from "@/components/admin/TopBar";
import { AuthContext } from "@/context/AuthContext";

interface FinanceOverview {
  total_fees: number;
  total_paid: number;
  total_balance: number;
  last_payment_date: string | null;
}

const ACADEMIC_YEAR_ID = 1;
const TERM_ID = 1;

const FinanceOverviewPage = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const [data, setData] = useState<FinanceOverview>({
    total_fees: 0,
    total_paid: 0,
    total_balance: 0,
    last_payment_date: null,
  });

  const [loading, setLoading] = useState(true);

  /* 🔐 ADMIN GUARD */
  useEffect(() => {
    if (!auth?.isAdmin) {
      navigate("/unauthorized", { replace: true });
    }
  }, [auth, navigate]);

  /* 📊 LOAD FINANCE OVERVIEW */
  useEffect(() => {
    const loadOverview = async () => {
      try {
        const res = await api.get("/finance-overview", {
          params: {
            academic_year_id: ACADEMIC_YEAR_ID,
            term_id: TERM_ID,
          },
        });

        setData(res.data);
      } finally {
        setLoading(false);
      }
    };

    if (auth?.isAdmin) {
      loadOverview();
    }
  }, [auth]);

  const cards = [
    {
      title: "Total Fees Expected",
      value: `KES ${data.total_fees.toLocaleString()}`,
      subtitle: "Current term",
      gradient: "from-red-600/80 to-red-400/80",
    },
    {
      title: "Total Paid",
      value: `KES ${data.total_paid.toLocaleString()}`,
      subtitle: "Collected so far",
      gradient: "from-green-600/80 to-green-400/80",
    },
    {
      title: "Total Balance",
      value: `KES ${data.total_balance.toLocaleString()}`,
      subtitle: "Outstanding",
      gradient: "from-orange-600/80 to-orange-400/80",
    },
    {
      title: "Last Payment Date",
      value: data.last_payment_date
        ? new Date(data.last_payment_date).toLocaleDateString()
        : "—",
      subtitle: "Most recent transaction",
      gradient: "from-blue-600/80 to-blue-400/80",
    },
  ];

  return (
    <div className="space-y-6">
      <TopBar />

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">
          Finance Overview
        </h1>
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 mr-5 hover:underline"
        >
          ← Back
        </button>
      </div>

      <p className="text-gray-600">High level financial summary</p>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className="relative h-48 rounded-2xl overflow-hidden shadow-lg"
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${card.gradient}`}
            />

            <div className="relative h-full p-5 flex flex-col justify-end text-white">
              <p className="text-sm opacity-90">{card.title}</p>
              <h2 className="text-2xl font-bold mt-1">{card.value}</h2>
              <p className="text-xs opacity-80 mt-1">
                {loading ? "Loading..." : card.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FinanceOverviewPage;
