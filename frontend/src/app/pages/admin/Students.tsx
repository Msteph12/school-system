"use client";

import { useCallback, useEffect, useState } from "react";
import TopBar from "@/components/admin/TopBar";
import StudentsTable from "@/components/admin/StudentsTable";
import StudentModal from "@/components/admin/StudentModal";
import QuickNavCards from "@/components/common/QuickNavCards";
import { getStudents } from "@/services/students";
import api from "@/services/api";
import type { StudentFull, StudentListItem } from "@/types/student";
import type { QuickNavCard } from "@/types/result";

const Students = () => {
  const [students, setStudents] = useState<StudentListItem[]>([]);
  const [modalMode, setModalMode] = useState<"add" | "edit" | "view" | null>(
    null
  );
  const [selectedStudent, setSelectedStudent] = useState<StudentFull | null>(
    null
  );

  const [grade, setGrade] = useState("");
  const [className, setClassName] = useState(""); // ✅ renamed

  // LOAD STUDENTS
  const loadStudents = useCallback(async () => {
    const res = await getStudents();
    setStudents(res.data);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadStudents();
  }, [loadStudents]);

  // VIEW
  const handleView = async (row: StudentListItem) => {
    const res = await api.get(`/students/${row.id}`);
    setSelectedStudent(res.data);
    setModalMode("view");
  };

  // EDIT
  const handleEdit = async (row: StudentListItem) => {
    const res = await api.get(`/students/${row.id}`);
    setSelectedStudent(res.data);
    setModalMode("edit");
  };

  // FILTER
  const filteredStudents = students.filter(
    (s) =>
      (grade === "" || s.grade === grade) &&
      (className === "" || s.class === className)
  );

  // RELOAD STUDENTS AFTER MODAL CLOSE
  useEffect(() => {
    const loadStudents = async () => {
      const res = await getStudents();
      setStudents(res.data);
    };

    loadStudents();
  }, []);

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
        <h1 className="text-2xl font-semibold text-gray-800">Students</h1>
        <button
          onClick={() => window.history.back()}
          className="text-blue-600 mr-5 hover:underline"
        >
          ← Back
        </button>
      </div>

      {/* Student quick navigation using QuickNavCards */}
      <QuickNavCards cards={quickNavCards} />

      {/* Filters / Actions */}
      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded shadow-md shadow-red-200">
        <button
          onClick={() => {
            setModalMode("add");
            setSelectedStudent(null);
          }}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          + Add Student
        </button>

        <select
          className="border rounded px-4 py-2 text-sm"
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
        >
          <option value="">All Grades</option>
        </select>

        <select
          className="border rounded px-4 py-2 text-sm"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
        >
          <option value="">All Classes</option>
        </select>
      </div>

      {/* Table */}
      <StudentsTable
        students={filteredStudents}
        onView={handleView}
        onEdit={handleEdit}
      />

      {/* Modal */}
      {modalMode && (
        <StudentModal
          mode={modalMode}
          student={selectedStudent}
          onClose={() => {
            setModalMode(null);
            setSelectedStudent(null);
          }}
          onSuccess={loadStudents}
        />
      )}
    </div>
  );
};

export default Students;