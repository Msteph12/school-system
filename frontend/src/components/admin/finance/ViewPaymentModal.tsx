"use client";

import type { PaymentListItem } from "@/types/payment";

interface Props {
  payment: PaymentListItem;
  onClose: () => void;
}

const ViewPaymentModal = ({ payment, onClose }: Props) => {
  const handlePrint = () => {
    window.open(
      `/api/fee-receipts/${payment.id}/pdf`,
      "_blank"
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg p-6 space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Payment Details</h2>
          <button onClick={onClose} className="text-gray-500">✕</button>
        </div>

        {/* Student Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Detail label="Student" value={payment.studentName} />
          <Detail label="Admission No" value={payment.admissionNo} />
          <Detail label="Grade" value={payment.grade} />
          <Detail label="Class" value={payment.class} />
        </div>

        {/* Academic Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Detail label="Academic Year" value={payment.academicYear} />
          <Detail label="Term" value={payment.term} />
        </div>

        {/* Payment Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Detail
            label="Amount Paid"
            value={payment.amountPaid.toLocaleString()}
          />
          <Detail label="Payment Date" value={payment.paymentDate} />
          <Detail label="Method" value={payment.paymentMethod} />
          <Detail label="Reference" value={payment.reference ?? "-"} />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Print Receipt
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

export default ViewPaymentModal;
