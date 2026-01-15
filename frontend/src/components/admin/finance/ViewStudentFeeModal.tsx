"use client";

import type { StudentFeeListItem } from "@/types/studentFee";

interface Props {
  studentFee: StudentFeeListItem;
  onClose: () => void;
}

const ViewStudentFeeModal = ({ studentFee, onClose }: Props) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg p-6 space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Student Fee Details</h2>
          <button onClick={onClose} className="text-gray-500">✕</button>
        </div>

        {/* Student Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Detail label="Student Name" value={studentFee.studentName} />
          <Detail label="Admission No" value={studentFee.admissionNumber} />
          <Detail label="Grade" value={studentFee.grade} />
          <Detail label="Class" value={studentFee.class} />
        </div>

        {/* Academic Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Detail label="Academic Year" value={studentFee.academicYear} />
          <Detail label="Term" value={studentFee.term} />
        </div>

        {/* Fee Breakdown */}
        <div className="space-y-3">
          <h3 className="font-semibold">Fee Breakdown</h3>

          <Detail
            label="Tuition Fee"
            value={`KES ${studentFee.mandatoryAmount.toLocaleString()}`}
          />

          {studentFee.optionalFees.length> 0 && (
            <div>
              <p className="text-xs text-gray-500 mb-1">Optional Fees</p>
              <ul className="list-disc pl-5 text-sm">
                {studentFee.optionalFees.map((fee, idx) => (
                  <li key={idx}>
                    {fee.name} — KES {fee.amount.toLocaleString()}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Detail
            label="Total Fee"
            value={`KES ${studentFee.totalAmount.toLocaleString()}`}
          />
        </div>

        {/* Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Detail
            label="Amount Paid"
            value={`KES ${studentFee.amountPaid.toLocaleString()}`}
          />
          <Detail
            label="Balance"
            value={`KES ${studentFee.balance.toLocaleString()}`}
          />
        </div>

        {/* Footer */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

const Detail = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-xs text-gray-500">{label}</p>
    <p className="font-medium">{value}</p>
  </div>
);

export default ViewStudentFeeModal;
