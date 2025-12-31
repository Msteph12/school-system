import { useState } from "react";
import TopBar from "@/components/admin/TopBar";
import PromotionTable from "@/components/admin/PromotionTable";
import ConfirmModal from "@/components/common/ConfirmModal";
import { promoteStudents } from "@/services/students";
import { getStudents } from "@/services/students";
import { useEffect } from "react";
import toast from "react-hot-toast";


interface StudentApiResponse {
  id: number;
  first_name: string;
  last_name: string;
  grade_id: number;
  grade_name: string;
  class_id: number;
  class_name: string;
}

interface Student {
  id: number;
  name: string;
  grade_id: number;
  grade_name: string;
  class_id: number;
  class_name: string;
}


const StudentsPromotionPage = () => {
  const [students, setStudents] = useState<Student[]>([]);

  // filters
  const [gradeFilter, setGradeFilter] = useState<number | "">("");
  const [classFilter, setClassFilter] = useState<number | "">("");

  // selected = PROMOTED
  const [selected, setSelected] = useState<number[]>([]);

  // UI
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  // unique dropdown values
  const grades = Array.from(
    new Map(students.map(s => [s.grade_id, s.grade_name])).entries()
  );

  const classes = Array.from(
    new Map(
      students
        .filter(s => gradeFilter === "" || s.grade_id === gradeFilter)
        .map(s => [s.class_id, s.class_name])
    ).entries()
  );

  // filtered students
  const filteredStudents = students.filter(
    s =>
      (gradeFilter === "" || s.grade_id === gradeFilter) &&
      (classFilter === "" || s.class_id === classFilter)
  );

  const handlePromote = async () => {
  try {
    setLoading(true);
    await promoteStudents({ student_ids: selected });
    setSelected([]);
    setShowConfirm(false);
    toast.success("Students promoted successfully");
    } finally {
        setLoading(false);
    }
    };

  useEffect(() => {
  getStudents().then(res => {
    const mapped: Student[] = res.data.map((s: StudentApiResponse) => ({
      id: s.id,
      name: `${s.first_name} ${s.last_name}`,
      grade_id: s.grade_id,
      grade_name: s.grade_name,
      class_id: s.class_id,
      class_name: s.class_name,
    }));

    setStudents(mapped);
    setSelected([]);
  });
}, [gradeFilter, classFilter]);


  return (
    <div className="space-y-6">
      <TopBar />

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Students Promotion</h1>
        <button
          onClick={() => window.history.back()}
          className="text-blue-600 mr-5 hover:underline"
        >
          ← Back
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 bg-white p-4 rounded shadow">
        <select
          value={gradeFilter}
          onChange={e => {
            setGradeFilter(Number(e.target.value) || "");
            setClassFilter("");
          }}
          className="border p-2 rounded"
        >
          <option value="">All Grades</option>
          {grades.map(([id, name]) => (
            <option key={id} value={id}>{name}</option>
          ))}
        </select>

        <select
          value={classFilter}
          onChange={e => setClassFilter(Number(e.target.value) || "")}
          className="border p-2 rounded"
        >
          <option value="">All Classes</option>
          {classes.map(([id, name]) => (
            <option key={id} value={id}>{name}</option>
          ))}
        </select>

        <button
          onClick={() => setShowConfirm(true)}
          disabled={selected.length === 0 || loading}
          className="ml-auto bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
        >
          Promote Selected
        </button>
      </div>

      {/* Students */}
      <PromotionTable
        students={filteredStudents}
        selected={selected}
        setSelected={setSelected}
      />

      {/* Confirm */}
      <ConfirmModal
        open={showConfirm}
        title="Confirm Promotion"
        message="Promote all selected students to the next class?"
        loading={loading}
        onClose={() => setShowConfirm(false)}
        onConfirm={handlePromote}
      />
    </div>
  );
};

export default StudentsPromotionPage;
