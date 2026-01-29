import { useEffect, useState } from "react";
import TopBar from "@/components/admin/TopBar";
import PromotionHistoryTable from "@/components/admin/PromotionHistoryTable";
import QuickNavCards from "@/components/common/QuickNavCards";
import { getPromotionHistory } from "@/services/promotionHistory";
import type { QuickNavCard } from "@/types/result";

interface PromotionHistory {
  id: number;
  student_name: string;
  from_grade: string;
  from_class: string;
  to_grade: string;
  to_class: string;
  academic_year: string;
  promoted_at: string;
}

const PromotionHistoryPage = () => {
  const [history, setHistory] = useState<PromotionHistory[]>([]);
  const [yearFilter, setYearFilter] = useState("");

  useEffect(() => {
    getPromotionHistory().then(res => setHistory(res));
  }, []);

  const years = Array.from(
    new Set(history.map(h => h.academic_year))
  );

  const filtered = yearFilter
    ? history.filter(h => h.academic_year === yearFilter)
    : history;

  // Quick navigation cards data
  const quickNavCards: QuickNavCard[] = [
    {
      title: "Student Promotion",
      description: "Promote students to next class",
      onClick: () => (window.location.href = "/admin/students-promotion"),
      gradient: "from-blue-500 to-blue-700",
    },
    {
      title: "Promotion History",
      description: "View past promotions",
      onClick: () =>
        (window.location.href = "/admin/students-promotion/history"),
      gradient: "from-green-500 to-green-700",
    },
    {
      title: "Student Attendance",
      description: "View & record attendance",
      onClick: () => (window.location.href = "/admin/student-attendance"),
      gradient: "from-purple-500 to-purple-700",
    },
  ];

  return (
    <div className="space-y-6">
      <TopBar />

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">
          Students Promotion History
        </h1>
        <button
          onClick={() => window.history.back()}
          className="text-blue-600 mr-5 hover:underline"
        >
          ← Back
        </button>
      </div>

      {/* Quick navigation cards */}
      <QuickNavCards cards={quickNavCards} />

      {/* Filters */}
      <div className="bg-white p-4 rounded shadow flex gap-4">
        <select
          value={yearFilter}
          onChange={e => setYearFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Academic Years</option>
          {years.map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <PromotionHistoryTable history={filtered} />
    </div>
  );
};

export default PromotionHistoryPage;