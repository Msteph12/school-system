import { useEffect, useState } from "react";
import TopBar from "@/components/admin/TopBar";
import PromotionTable from "@/components/admin/PromotionTable";
import QuickNavCards from "@/components/common/QuickNavCards";
import type { Student } from "@/types/student";
import type { QuickNavCard } from "@/types/result";
import { promoteStudents } from "@/services/students";
import { getStudents } from "@/services/students";

const StudentsPromotionPage = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getStudents().then(res => setStudents(res.data));
  }, []);

  const handlePromote = async () => {
    try {
      setLoading(true);
      const allStudentIds = students.map(s => s.id);
      const promotedIds = selected;
      const repeatedIds = allStudentIds.filter(id => 
        !selected.includes(id) && 
        !students.find(s => s.id === id)?.is_promoted
      );
      
      await promoteStudents({
        promoted_ids: promotedIds,
        repeated_ids: repeatedIds,
        from_academic_year_id: 1, // TODO: Get from current academic year
        to_academic_year_id: 2,   // TODO: Get from next academic year
      });
      
      // Refresh students list to show updated is_promoted status
      const res = await getStudents();
      setStudents(res.data);
      setSelected([]);
    } finally {
      setLoading(false);
    }
  };

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

      {/* Header with Student Promotion and Back button */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Student Promotion</h1>
        <button
          onClick={() => window.history.back()}
          className="text-blue-600 mr-5 hover:underline"
        >
          ← Back
        </button>
      </div>

      {/* Quick navigation cards */}
      <QuickNavCards cards={quickNavCards} />

      {/* Promote Selected button above the table */}
      <div className="flex items-center bg-white p-4 rounded shadow-md">
        <button
          onClick={handlePromote}
          disabled={selected.length === 0 || loading}
          className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 disabled:opacity-50"
        >
          {loading ? "Promoting..." : "Promote Selected"}
        </button>
      </div>

      {/* Promotion Table */}
      <PromotionTable
        students={students}
        selected={selected}
        setSelected={setSelected}
      />
    </div>
  );
};

export default StudentsPromotionPage;