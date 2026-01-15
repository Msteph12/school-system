"use client";

import api from "@/services/api";
import { useEffect, useState } from "react";

interface Props {
  onClose: () => void;
  academicYearId: number;
  termId: number;
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

interface FeePreviewResponse {
  fee_structure_id: number;
  mandatory_amount: number;
  optional_fees: OptionalFee[];
}

const StudentFeeModal = ({ onClose, academicYearId, termId }: Props) => {
  const [admissionNo, setAdmissionNo] = useState("");
  const [student, setStudent] = useState<Student | null>(null);

  const [feeStructureId, setFeeStructureId] = useState<number | null>(null);
  const [mandatoryAmount, setMandatoryAmount] = useState(0);
  const [optionalFees, setOptionalFees] = useState<OptionalFee[]>([]);
  const [selectedOptionalFeeIds, setSelectedOptionalFeeIds] = useState<number[]>(
    []
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔍 Fetch student by admission number
  const fetchStudent = async () => {
    if (!admissionNo) return;

    try {
      setLoading(true);
      setError("");

      const res = await api.get(`/students/by-admission/${admissionNo}`);
      setStudent(res.data);
    } catch {
      setStudent(null);
      setError("Student not found");
    } finally {
      setLoading(false);
    }
  };

  // 📦 Load fee preview once student is found
  useEffect(() => {
    if (!student) return;

    const loadFeePreview = async () => {
      try {
        const res = await api.get<FeePreviewResponse>(
          `/student-fees/preview/${student.id}`,
          {
            params: {
              academic_year_id: academicYearId,
              term_id: termId,
            },
          }
        );

        setFeeStructureId(res.data.fee_structure_id);
        setMandatoryAmount(res.data.mandatory_amount);
        setOptionalFees(res.data.optional_fees);
        setSelectedOptionalFeeIds([]);
      } catch {
        setError("Fee structure not found for this student");
      }
    };

    loadFeePreview();
  }, [student, academicYearId, termId]);

  const toggleOptionalFee = (id: number) => {
    setSelectedOptionalFeeIds((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const total =
    mandatoryAmount +
    optionalFees
      .filter((f) => selectedOptionalFeeIds.includes(f.id))
      .reduce((sum, f) => sum + f.amount, 0);

  // 💾 Save student fee
  const saveStudentFee = async () => {
    if (!student || !feeStructureId) return;

    try {
      setLoading(true);
      setError("");

      // 1️⃣ Save optional fees
      await api.post(`/students/${student.id}/optional-fees`, {
        optional_fee_ids: selectedOptionalFeeIds,
        academic_year_id: academicYearId,
        term_id: termId,
        fee_structure_id: feeStructureId,
      });

      // 2️⃣ Recalculate & store student fee
      await api.post("/student-fees/recalculate", {
        student_id: student.id,
        fee_structure_id: feeStructureId,
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
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Add Student Fee</h2>
          <button onClick={onClose}>✕</button>
        </div>

        {/* Admission Number */}
        <div>
          <label className="text-sm font-medium">Admission Number</label>
          <div className="flex gap-2">
            <input
              className="border rounded px-3 py-2 w-full"
              placeholder="Enter admission number"
              value={admissionNo}
              onChange={(e) => setAdmissionNo(e.target.value)}
            />
            <button
              onClick={fetchStudent}
              className="bg-blue-600 text-white px-4 rounded"
            >
              Search
            </button>
          </div>
          {loading && <p className="text-sm">Loading…</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        {/* Student Info */}
        <div className="grid grid-cols-3 gap-3">
          <input disabled placeholder="Student Name" value={student?.name ?? ""} className="border px-3 py-2 bg-gray-100 rounded" />
          <input disabled placeholder="Grade" value={student?.grade ?? ""} className="border px-3 py-2 bg-gray-100 rounded" />
          <input disabled placeholder="Class" value={student?.class ?? ""} className="border px-3 py-2 bg-gray-100 rounded" />
        </div>

        {/* Fees */}
        {feeStructureId && (
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Tuition Fee</span>
              <span>KES {mandatoryAmount}</span>
            </div>

            {optionalFees.length > 0 && (
              <div>
                <p className="font-medium">Optional Fees</p>
                {optionalFees.map((fee) => (
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
          </div>
        )}

        {/* Total */}
        <div className="flex justify-between font-semibold border-t pt-3">
          <span>Total Payable</span>
          <span>KES {total}</span>
        </div>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="border px-4 py-2 rounded">
            Cancel
          </button>
          <button
            onClick={saveStudentFee}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Save Student Fee
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentFeeModal;
