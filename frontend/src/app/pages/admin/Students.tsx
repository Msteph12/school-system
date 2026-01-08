"use client";

import { useCallback, useEffect, useState } from "react";
import TopBar from "@/components/admin/TopBar";
import StudentsTable from "@/components/admin/StudentsTable";
import StudentModal from "@/components/admin/StudentModal";
import { getStudents } from "@/services/students";
import api from "@/services/api";
import type { StudentFull, StudentListItem } from "@/types/student";

const Students = () => {
  const [students, setStudents] = useState<StudentListItem[]>([]);
  const [modalMode, setModalMode] =
    useState<"add" | "edit" | "view" | null>(null);
  const [selectedStudent, setSelectedStudent] =
    useState<StudentFull | null>(null);

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

      {/* Student quick navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-4 rounded shadow-md">
        <button
          onClick={() => window.location.href = "/admin/students-promotion"} 
          className="bg-blue-100 hover:bg-blue-200 text-blue-800 p-4 rounded-lg text-left transition"
        >
          <h3 className="font-semibold">Student Promotion</h3>
          <p className="text-sm">Promote students to next class</p>
        </button>

        <button
          onClick={() => window.location.href = "/admin/students-promotion/history"}
          className="bg-blue-100 hover:bg-blue-200 text-blue-800 p-4 rounded-lg text-left transition"
        >
          <h3 className="font-semibold">Promotion History</h3>
          <p className="text-sm">View past promotions</p>
        </button>

        <button
          onClick={() => window.location.href = "/admin/student-attendance"}
          className="bg-blue-100 hover:bg-blue-200 text-blue-800 p-4 rounded-lg text-left transition"
        >
          <h3 className="font-semibold">Student Attendance</h3>
          <p className="text-sm">View & record attendance</p>
        </button>
      </div>


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
