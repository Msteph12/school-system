"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import TopBar from "@/components/admin/TopBar";
import type { StudentFeeListItem } from "@/types/studentFee";

import StudentFeesTable from "@/components/admin/finance/StudentFeesTable";
import ViewStudentFeeModal from "@/components/admin/finance/ViewStudentFeeModal";
import StudentFeeModal from "@/components/admin/finance/StudentFeeModal";

const StudentFeesPage = () => {
  const [studentFees, setStudentFees] = useState<StudentFeeListItem[]>([]);
  const [viewFee, setViewFee] = useState<StudentFeeListItem | null>(null);
  const [editFee, setEditFee] = useState<StudentFeeListItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // agreed placeholders
  const academicYearId = 1;
  const termId = 1;

  const loadFees = async () => {
    const res = await api.get("/student-fees");
    setStudentFees(res.data);
  };

  useEffect(() => {
  const loadFees = async () => {
    const res = await api.get("/student-fees");
    setStudentFees(res.data);
  };

  loadFees();
}, []);


  return (
    <div className="space-y-6">
      <TopBar />

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Student Fees</h1>
        <button
          onClick={() => window.history.back()}
          className="text-blue-600 hover:underline"
        >
          ← Back
        </button>
      </div>

      {/* Actions */}
      <div className="bg-white p-4 rounded shadow-md">
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          + Add Student Fee
        </button>
      </div>

      {/* Table */}
      <StudentFeesTable
        studentFees={studentFees}
        onView={setViewFee}
        onEdit={setEditFee}
      />

      {/* View */}
      {viewFee && (
        <ViewStudentFeeModal
          studentFee={viewFee}
          onClose={() => setViewFee(null)}
        />
      )}

      {/* Add */}
      {showAddModal && (
        <StudentFeeModal
          academicYearId={academicYearId}
          termId={termId}
          onClose={() => {
            setShowAddModal(false);
            loadFees();
          }}
        />
      )}

      {/* Edit */}
      {editFee && (
        <StudentFeeModal
          existingFee={editFee}
          academicYearId={academicYearId}
          termId={termId}
          onClose={() => {
            setEditFee(null);
            loadFees();
          }}
        />
      )}
    </div>
  );
};

export default StudentFeesPage;
