import { useEffect, useState } from "react";
import TopBar from "@/components/admin/TopBar";
import PromotionTable from "@/components/admin/PromotionTable";
import type { Student } from "@/types/student";
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
    });
    setSelected([]);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="space-y-6">
      <TopBar />

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Student Promotion</h1>
        <button
            onClick={handlePromote}
            disabled={selected.length === 0 || loading}
            className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 disabled:opacity-50"
        >
            Promote Selected
        </button>
        <button
          onClick={() => window.history.back()}
          className="text-blue-600 ml-2 mr-5 hover:underline"
        >
          ← Back
        </button>
        </div>

        <PromotionTable
        students={students}
        selected={selected}
        setSelected={setSelected}
        />
    </div>
  );
};

export default StudentsPromotionPage;
