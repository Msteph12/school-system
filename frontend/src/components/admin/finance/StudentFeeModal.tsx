"use client";

import api from "@/services/api";
import { useEffect, useState } from "react";
import type { StudentFeeListItem } from "@/types/studentFee";

interface Props {
  onClose: () => void;
  academicYearId: number;
  termId: number;
  existingFee?: StudentFeeListItem | null;
}

interface Student {
  id: number;
  name: string;
  grade: string;
  class: string;
}

interface OptionalFee {
  id: number;
  name: string;
  amount: number;
}

interface FeeStructure {
  id: number;
  mandatory_amount: number;
  optional_fees: OptionalFee[];
}

const StudentFeeModal = ({
  onClose,
  academicYearId,
  termId,
  existingFee,
}: Props) => {
  const isEdit = !!existingFee;

  const [admissionNo, setAdmissionNo] = useState(
    existingFee?.admissionNumber ?? ""
  );
  const [student, setStudent] = useState<Student | null>(null);
  const [feeStructure, setFeeStructure] = useState<FeeStructure | null>(null);
  const [selectedOptionalFeeIds, setSelectedOptionalFeeIds] = useState<number[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔍 Fetch student
  const fetchStudent = async () => {
    if (!admissionNo) return;

    try {
      setLoading(true);
      setError(null);

      const res = await api.get(`/students/by-admission/${admissionNo}`);
      setStudent(res.data);
    } catch {
      setStudent(null);
      setFeeStructure(null);
      setError("Student not found");
    } finally {
      setLoading(false);
    }
  };

  // Auto-load student in edit mode
  useEffect(() => {
    if (isEdit) fetchStudent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 📦 Load fee structure (GRADE + YEAR + TERM)
  useEffect(() => {
    if (!student) return;

    const loadFeeStructure = async () => {
      try {
        const res = await api.get("/student-fees/preview/" + student.id, {
          params: {
            academic_year_id: academicYearId,
            term_id: termId,
          },
        });

        setFeeStructure({
          id: res.data.fee_structure_id,
          mandatory_amount: res.data.mandatory_amount,
          optional_fees: res.data.optional_fees,
        });

        setSelectedOptionalFeeIds([]);
      } catch {
        setFeeStructure(null);
        setError("Fee structure not found");
      }
    };

    loadFeeStructure();
  }, [student, academicYearId, termId]);

  const toggleOptionalFee = (feeId: number) => {
    setSelectedOptionalFeeIds((prev) =>
      prev.includes(feeId)
        ? prev.filter((id) => id !== feeId)
        : [...prev, feeId]
    );
  };

  const total =
    (feeStructure?.mandatory_amount ?? 0) +
    (feeStructure?.optional_fees
      .filter((f) => selectedOptionalFeeIds.includes(f.id))
      .reduce((sum, f) => sum + f.amount, 0) ?? 0);

  // 💾 Save / Recalculate
  const saveStudentFee = async () => {
    if (!student || !feeStructure) return;

    try {
      setLoading(true);
      setError(null);

      await api.post("/student-fees/recalculate", {
        student_id: student.id,
        fee_structure_id: feeStructure.id,
        academic_year_id: academicYearId,
        term_id: termId,
      });

      onClose();
    } catch {
      setError("Failed to save student fee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-xl rounded-lg p-6 space-y-5">
        <h2 className="text-lg font-semibold">
          {isEdit ? "Edit Student Fee" : "Add Student Fee"}
        </h2>

        {/* Admission */}
        <div>
          <label className="text-sm font-medium">Admission Number</label>
          <div className="flex gap-2">
            <input
              disabled={isEdit}
              value={admissionNo}
              onChange={(e) => setAdmissionNo(e.target.value)}
              className="border px-3 py-2 rounded w-full"
            />
            {!isEdit && (
              <button
                onClick={fetchStudent}
                className="bg-blue-600 text-white px-4 rounded"
              >
                Search
              </button>
            )}
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        {/* Student Info */}
        {student && (
          <div className="grid grid-cols-3 gap-3">
            <input disabled value={student.name} className="border px-3 py-2 bg-gray-100 rounded" />
            <input disabled value={student.grade} className="border px-3 py-2 bg-gray-100 rounded" />
            <input disabled value={student.class} className="border px-3 py-2 bg-gray-100 rounded" />
          </div>
        )}

        {/* Fees */}
        {feeStructure && (
          <>
            <div className="flex justify-between">
              <span>Tuition Fee</span>
              <span>KES {feeStructure.mandatory_amount}</span>
            </div>

            {feeStructure.optional_fees.length > 0 && (
              <div>
                <p className="font-medium">Optional Fees</p>
                {feeStructure.optional_fees.map((fee) => (
                  <label key={fee.id} className="flex justify-between text-sm">
                    <span>
                      <input
                        type="checkbox"
                        checked={selectedOptionalFeeIds.includes(fee.id)}
                        onChange={() => toggleOptionalFee(fee.id)}
                        className="mr-2"
                      />
                      {fee.name}
                    </span>
                    <span>KES {fee.amount}</span>
                  </label>
                ))}
              </div>
            )}
          </>
        )}

        {/* Total */}
        <div className="flex justify-between font-semibold border-t pt-3">
          <span>Total Payable</span>
          <span>KES {total}</span>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="border px-4 py-2 rounded">
            Cancel
          </button>
          <button
            onClick={saveStudentFee}
            disabled={loading}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            {isEdit ? "Recalculate" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentFeeModal;
