"use client";

import type { StudentFeeListItem } from "@/types/studentFee";

interface Props {
  studentFee: StudentFeeListItem;
  onClose: () => void;
}

const ViewStudentFeeModal = ({ studentFee, onClose }: Props) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-xl rounded-lg shadow-lg p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">
            Student Fee Breakdown
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Student Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Student</p>
            <p className="font-medium">{studentFee.studentName}</p>
          </div>

          <div>
            <p className="text-gray-500">Admission No</p>
            <p className="font-medium">{studentFee.admissionNumber}</p>
          </div>

          <div>
            <p className="text-gray-500">Grade</p>
            <p className="font-medium">{studentFee.grade}</p>
          </div>

          <div>
            <p className="text-gray-500">Class</p>
            <p className="font-medium">{studentFee.class}</p>
          </div>

          <div>
            <p className="text-gray-500">Academic Year</p>
            <p className="font-medium">{studentFee.academicYear}</p>
          </div>

          <div>
            <p className="text-gray-500">Term</p>
            <p className="font-medium">{studentFee.term}</p>
          </div>
        </div>

        {/* Fees */}
        <div className="border rounded-lg p-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span>Mandatory Fee</span>
            <span className="font-medium">
              KES {studentFee.mandatoryAmount.toLocaleString()}
            </span>
          </div>

          {studentFee.optionalFees.length > 0 && (
            <>
              <hr />
              <p className="text-sm font-semibold text-gray-700">
                Optional Fees
              </p>

              {studentFee.optionalFees.map((fee, index) => (
                <div
                  key={index}
                  className="flex justify-between text-sm"
                >
                  <span>{fee.name}</span>
                  <span>
                    KES {fee.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </>
          )}

          <hr />

          <div className="flex justify-between font-semibold">
            <span>Total Fee</span>
            <span>
              KES {studentFee.totalAmount.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Payments */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Amount Paid</p>
            <p className="font-medium">
              KES {studentFee.amountPaid.toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-gray-500">Balance</p>
            <p className="font-medium text-red-600">
              KES {studentFee.balance.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewStudentFeeModal;
