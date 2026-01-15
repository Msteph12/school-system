"use client";

import { useState, useEffect } from "react";
import TopBar from "@/components/admin/TopBar";
import StudentFeeModal from "@/components/admin/finance/StudentFeeModal";
import StudentFeesTable from "@/components/admin/finance/StudentFeesTable";
import ViewStudentFeeModal from "@/components/admin/finance/ViewStudentFeeModal";
import type { StudentFeeListItem } from "@/types/studentFee";

const StudentFeesPage = () => {
  const [showAddModal, setShowAddModal] = useState(false);
    const academicYearId = 1; // TODO: get current academic year ID
    const termId = 1; // TODO: get current term ID

  const [gradeId, setGradeId] = useState<number | "">("");
  const [classId, setClassId] = useState<number | "">("");

  const [studentFees] = useState<StudentFeeListItem[]>([]);

  const [selectedStudentFee, setSelectedStudentFee] =
    useState<StudentFeeListItem | null>(null);

  const handleView = (fee: StudentFeeListItem) => {
    setSelectedStudentFee(fee);
  };

  useEffect(() => {
    // TODO: fetch student fees from API
  }, []);

  return (
    <div className="space-y-6">
      <TopBar />

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Student Fees</h1>
        <button
          onClick={() => window.history.back()}
          className="text-blue-600 mr-5 hover:underline"
        >
          ← Back
        </button>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 bg-white p-4 rounded shadow-md">
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          + Add Student Fee
        </button>

        <select
          className="border rounded px-4 py-2"
          value={gradeId}
          onChange={(e) => setGradeId(Number(e.target.value))}
        >
          <option value="">All Grades</option>
        </select>

        <select
          className="border rounded px-4 py-2"
          value={classId}
          onChange={(e) => setClassId(Number(e.target.value))}
        >
          <option value="">All Classes</option>
        </select>
      </div>

      {/* Student Fees Table */}
      {studentFees.length === 0 ? (
        <div className="bg-white p-10 rounded shadow text-center text-gray-500">
          No student fees found.
        </div>
      ) : (
        <StudentFeesTable
          studentFees={studentFees}
          onView={handleView}
        />
      )}

      {/* Add Student Fee */}
      {showAddModal && (
        <StudentFeeModal onClose={() => setShowAddModal(false)} 
        academicYearId={academicYearId}
        termId={termId} 
        />
      )}

      {/* View Student Fee */}
      {selectedStudentFee && (
        <ViewStudentFeeModal
          studentFee={selectedStudentFee}
          onClose={() => setSelectedStudentFee(null)}
        />
      )}
    </div>
  );
};

export default StudentFeesPage;
