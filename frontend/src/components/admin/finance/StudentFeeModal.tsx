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

interface FeeStructure {
  id: number;
  mandatory_amount: number;
  optional_fees: OptionalFee[];
}

const StudentFeeModal = ({ onClose, academicYearId, termId }: Props) => {
  const [admissionNo, setAdmissionNo] = useState("");
  const [student, setStudent] = useState<Student | null>(null);
  const [feeStructure, setFeeStructure] = useState<FeeStructure | null>(null);
  const [selectedOptionalFees, setSelectedOptionalFees] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔍 Fetch student
  const fetchStudent = async () => {
    if (!admissionNo) return;

    try {
      setLoading(true);
      setError("");

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

  // 📦 Load fee structure once student is found
  useEffect(() => {
    if (!student) return;

    api
      .get(`/students/${student.id}/fee-structure`, {
        params: {
          academic_year_id: academicYearId,
          term_id: termId,
        },
      })
      .then((res) => {
        setFeeStructure(res.data);
        setSelectedOptionalFees([]);
      });
  }, [student, academicYearId, termId]);

  const toggleOptionalFee = (id: number) => {
    setSelectedOptionalFees((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const total =
    (feeStructure?.mandatory_amount ?? 0) +
    (feeStructure?.optional_fees
      ?.filter((f) => selectedOptionalFees.includes(f.id))
      .reduce((sum, f) => sum + f.amount, 0) ?? 0);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-xl rounded-lg p-6 space-y-5">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Add Student Fee</h2>
          <button onClick={onClose}>✕</button>
        </div>

        {/* Admission No */}
        <div>
          <label className="text-sm font-medium">Admission Number</label>
          <div className="flex gap-2">
            <input
              className="border rounded px-3 py-2 w-full"
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
          {loading && <p className="text-sm">Searching…</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        {/* Student Info */}
        <div className="grid grid-cols-3 gap-3">
          <input disabled value={student?.name ?? ""} className="input" />
          <input disabled value={student?.grade ?? ""} className="input" />
          <input disabled value={student?.class ?? ""} className="input" />
        </div>

        {/* Fees */}
        {feeStructure && (
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Tuition Fee</span>
              <span>KES {feeStructure.mandatory_amount}</span>
            </div>

            <div>
              <p className="font-medium">Optional Fees</p>
              {feeStructure.optional_fees.map((fee) => (
                <label key={fee.id} className="flex justify-between text-sm">
                  <span>
                    <input
                      type="checkbox"
                      checked={selectedOptionalFees.includes(fee.id)}
                      onChange={() => toggleOptionalFee(fee.id)}
                      className="mr-2"
                    />
                    {fee.name}
                  </span>
                  <span>KES {fee.amount}</span>
                </label>
              ))}
            </div>
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
          <button className="bg-red-600 text-white px-4 py-2 rounded">
            Save Student Fee
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentFeeModal;
