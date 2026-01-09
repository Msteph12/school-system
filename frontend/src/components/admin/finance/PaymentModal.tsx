"use client";

import { useState } from "react";
import api from "@/services/api";

interface Props {
  onClose: () => void;
}

interface StudentLookup {
  id: number;
  name: string;
  grade: string;
  class: string;
}

const PaymentModal = ({ onClose }: Props) => {
  const [admissionNo, setAdmissionNo] = useState("");
  const [student, setStudent] = useState<StudentLookup | null>(null);

  const [academicYearId, setAcademicYearId] = useState<number | "">("");
  const [termId, setTermId] = useState<number | "">("");
  const [amount, setAmount] = useState<number | "">("");
  const [paymentDate, setPaymentDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [reference, setReference] = useState("");

  const [loadingStudent, setLoadingStudent] = useState(false);
  const [error, setError] = useState("");

  // 🔍 Lookup student by admission number
  const fetchStudent = async () => {
    if (!admissionNo) return;

    try {
      setLoadingStudent(true);
      setError("");

      const res = await api.get(`/students/by-admission/${admissionNo}`);
      setStudent(res.data);
    } catch {
      setStudent(null);
      setError("Student not found");
    } finally {
      setLoadingStudent(false);
    }
  };

  const handleSave = async () => {
  if (!student) return;

  await api.post("/payments", {
    student_id: student.id,
    academic_year_id: academicYearId,
    term_id: termId,
    amount_paid: amount,
    payment_date: paymentDate,
    payment_method: paymentMethod,
    reference,
  });

  onClose();
};


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg p-6 space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Add Payment</h2>
          <button onClick={onClose} className="text-gray-500">✕</button>
        </div>

        {/* Admission Number */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Admission Number
          </label>
          <div className="flex gap-2">
            <input
              className="w-full border rounded px-4 py-2"
              placeholder="Enter admission number"
              value={admissionNo}
              onChange={(e) => setAdmissionNo(e.target.value)}
            />
            <button
              onClick={fetchStudent}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Search
            </button>
          </div>
          {loadingStudent && (
            <p className="text-sm text-gray-500 mt-1">Searching…</p>
          )}
          {error && (
            <p className="text-sm text-red-600 mt-1">{error}</p>
          )}
        </div>

        {/* Student Info (auto-filled) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input
            className="border rounded px-4 py-2 bg-gray-100"
            placeholder="Student Name"
            value={student?.name ?? ""}
            disabled
          />
          <input
            className="border rounded px-4 py-2 bg-gray-100"
            placeholder="Grade"
            value={student?.grade ?? ""}
            disabled
          />
          <input
            className="border rounded px-4 py-2 bg-gray-100"
            placeholder="Class"
            value={student?.class ?? ""}
            disabled
          />
        </div>

        {/* Academic Year + Term */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <select
            className="border rounded px-4 py-2"
            value={academicYearId}
            onChange={(e) => setAcademicYearId(Number(e.target.value))}
          >
            <option value="">Academic Year</option>
            {/* populated from API */}
          </select>

          <select
            className="border rounded px-4 py-2"
            value={termId}
            onChange={(e) => setTermId(Number(e.target.value))}
          >
            <option value="">Term</option>
            {/* populated from API */}
          </select>
        </div>

        {/* Amount + Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="number"
            className="border rounded px-4 py-2"
            placeholder="Amount Paid"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />

          <input
            type="date"
            className="border rounded px-4 py-2"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
          />
        </div>

        {/* Method + Reference */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <select
            className="border rounded px-4 py-2"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="">Payment Method</option>
            <option value="cash">Cash</option>
            <option value="bank">Bank</option>
            <option value="mpesa">M-Pesa</option>
          </select>

          <input
            className="border rounded px-4 py-2"
            placeholder="Reference"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!student}
            className="px-4 py-2 bg-red-600 text-white rounded disabled:opacity-50"
          >
            Save Payment
          </button>
        </div>

      </div>
    </div>
  );
};

export default PaymentModal;
