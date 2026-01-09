"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import { createFeeStructure } from "@/services/fees";

interface Props {
  onClose: () => void;
}

type Grade = {
  id: number;
  name: string;
};

type OptionalFee = {
  name: string;
  amount: number | "";
};

const FeesStructureModal = ({ onClose }: Props) => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [gradeId, setGradeId] = useState<number | "">("");
  const [mandatoryAmount, setMandatoryAmount] = useState<number | "">("");
  const [optionalFees, setOptionalFees] = useState<OptionalFee[]>([]);

  const [academicYearId, setAcademicYearId] = useState<number | null>(null);
  const [termId, setTermId] = useState<number | null>(null);

  // NEW
  const [bankName, setBankName] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    api.get("/grades").then(res => setGrades(res.data));
  }, []);

  useEffect(() => {
  api.get("/current-academic-context").then(res => {
    setAcademicYearId(res.data.academic_year_id);
    setTermId(res.data.term_id);
  });
}, []);


  const addOptionalFee = () => {
    setOptionalFees(prev => [...prev, { name: "", amount: "" }]);
  };

  const updateOptionalFee = (
    index: number,
    field: keyof OptionalFee,
    value: string
  ) => {
    const updated = [...optionalFees];
    updated[index] = {
      ...updated[index],
      [field]: field === "amount" ? Number(value) || "" : value,
    };
    setOptionalFees(updated);
  };

  const mandatoryTotal = Number(mandatoryAmount) || 0;
  const optionalTotal = optionalFees.reduce(
    (sum, f) => sum + (Number(f.amount) || 0),
    0
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-3xl rounded-lg shadow-lg p-6 space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Create Fees Structure</h2>
          <button onClick={onClose} className="text-gray-500">✕</button>
        </div>

        {/* Grade */}
        <div>
          <label className="block text-sm font-medium mb-1">Grade</label>
          <select
            className="w-full border rounded px-4 py-2"
            value={gradeId}
            onChange={(e) => setGradeId(Number(e.target.value))}
          >
            <option value="">Select grade</option>
            {grades.map(g => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>
        </div>

        {/* Mandatory Fees */}
        <div>
          <h3 className="font-medium mb-2">Mandatory Fees</h3>
          <input
            type="number"
            className="w-full border rounded px-4 py-2"
            placeholder="Total mandatory amount"
            value={mandatoryAmount}
            onChange={(e) => setMandatoryAmount(Number(e.target.value))}
          />
        </div>

        {/* Optional Fees */}
        <div>
          <h3 className="font-medium mb-2">Optional Fees</h3>

          {optionalFees.map((fee, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                className="flex-1 border rounded px-3 py-2"
                placeholder="Fee name"
                value={fee.name}
                onChange={(e) =>
                  updateOptionalFee(index, "name", e.target.value)
                }
              />
              <input
                type="number"
                className="w-32 border rounded px-3 py-2"
                placeholder="Amount"
                value={fee.amount}
                onChange={(e) =>
                  updateOptionalFee(index, "amount", e.target.value)
                }
              />
            </div>
          ))}

          <button
            onClick={addOptionalFee}
            className="text-sm text-blue-600 hover:underline"
          >
            + Add Optional Fee
          </button>
        </div>

        {/* Payment Info — NEW */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input
            className="border rounded px-4 py-2"
            placeholder="Bank Name"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
          />
          <input
            className="border rounded px-4 py-2"
            placeholder="Account Name"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
          />
          <input
            className="border rounded px-4 py-2"
            placeholder="Account Number"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
          />
        </div>

        {/* Remarks — NEW */}
        <div>
          <label className="block text-sm font-medium mb-1">Remarks / Notes</label>
          <textarea
            className="w-full border rounded px-4 py-2"
            rows={3}
            placeholder="Additional payment instructions or notes"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
        </div>

        {/* Summary */}
        <div className="border-t pt-4 text-sm space-y-1">
          <p>Mandatory Total: <strong>{mandatoryTotal}</strong></p>
          <p>Optional Total: <strong>{optionalTotal}</strong></p>
          <p>Maximum Payable: <strong>{mandatoryTotal + optionalTotal}</strong></p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Cancel
          </button>
          <button
            onClick={async () => {
                await createFeeStructure({
                grade_id: Number(gradeId),
                academic_year_id: academicYearId!,
                term_id: termId!,
                mandatory_amount: mandatoryTotal,
                optional_fees: optionalFees.map(f => ({
                    name: f.name,
                    amount: Number(f.amount),
                })),
                payment_details: {
                    bankName,
                    accountName,
                    accountNumber,
                },
                remarks,
                });

                onClose();
            }}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
            Save Fees Structure
            </button>
        </div>
      </div>
    </div>
  );
};

export default FeesStructureModal;
