"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import type { StudentFeeListItem } from "@/types/studentFee";

import StudentFeesTable from "@/components/admin/finance/StudentFeesTable";
import ViewStudentFeeModal from "@/components/admin/finance/ViewStudentFeeModal";
import StudentFeeModal from "@/components/admin/finance/StudentFeeModal";

const StudentFeesPage = () => {
  const [studentFees, setStudentFees] = useState<StudentFeeListItem[]>([]);
  const [viewFee, setViewFee] = useState<StudentFeeListItem | null>(null);
  const [editFee, setEditFee] = useState<StudentFeeListItem | null>(null);

  const academicYearId = 1; // current (already agreed placeholder)
  const termId = 1;         // current (already agreed placeholder)

  const loadFees = () => {
    api.get("/student-fees").then((res) => {
      setStudentFees(res.data);
    });
  };

  useEffect(() => {
    loadFees();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Student Fees</h1>

      <StudentFeesTable
        studentFees={studentFees}
        onView={(fee) => setViewFee(fee)}
        onEdit={(fee) => setEditFee(fee)}
      />

      {viewFee && (
        <ViewStudentFeeModal
          studentFee={viewFee}
          onClose={() => setViewFee(null)}
        />
      )}

      {editFee && (
        <StudentFeeModal
          existingFee={editFee}
          academicYearId={academicYearId}
          termId={termId}
          onClose={() => {
            setEditFee(null);
            loadFees(); // refresh after recalculation
          }}
        />
      )}
    </div>
  );
};

export default StudentFeesPage;
