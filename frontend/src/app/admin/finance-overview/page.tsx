"use client";

import TopBar from "@/components/admin/TopBar";

const FinanceOverviewPage = () => {
  // 🔹 MOCK DATA (will be replaced with API later)
  const stats = [
    {
      title: "Total Fees Expected",
      value: "KES 4,250,000",
      subtitle: "Current term",
      gradient: "from-red-600/80 to-red-400/80",
    },
    {
      title: "Total Paid",
      value: "KES 2,980,000",
      subtitle: "Collected so far",
      gradient: "from-green-600/80 to-green-400/80",
    },
    {
      title: "Total Balance",
      value: "KES 1,270,000",
      subtitle: "Outstanding",
      gradient: "from-orange-600/80 to-orange-400/80",
    },
    {
      title: "Last Payment Date",
      value: "14 Jan 2026",
      subtitle: "Most recent transaction",
      gradient: "from-blue-600/80 to-blue-400/80",
    },
  ];

  return (
    <div className="space-y-6">
      <TopBar />

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Finance Overview</h1>
        <button
          onClick={() => window.history.back()}
          className="text-blue-600 mr-5 hover:underline"
        >
          ← Back
        </button>
      </div>
      <div className="text-gray-600">
        <p>High level financial summary</p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((card, index) => (
          <div
            key={index}
            className="relative h-48 rounded-2xl overflow-hidden shadow-lg"
          >
            {/* Background */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${card.gradient}`}
            />

            {/* Content */}
            <div className="relative h-full p-5 flex flex-col justify-end text-white">
              <p className="text-sm opacity-90">{card.title}</p>
              <h2 className="text-2xl font-bold mt-1">{card.value}</h2>
              <p className="text-xs opacity-80 mt-1">
                {card.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FinanceOverviewPage;
