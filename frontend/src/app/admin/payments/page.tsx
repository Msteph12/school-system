"use client";

import { useState, useEffect } from "react";
import TopBar from "@/components/admin/TopBar";
import PaymentModal from "@/components/admin/finance/PaymentModal";
import PaymentsTable from "@/components/admin/finance/PaymentsTable";
import ViewPaymentModal from "@/components/admin/finance/ViewPaymentModal";
import type { PaymentListItem } from "@/types/payment";

const PaymentsPage = () => {
  const [showAddModal, setShowAddModal] = useState(false);

  const [academicYearId, setAcademicYearId] = useState<number | "">("");
  const [termId, setTermId] = useState<number | "">("");

  const [payments] = useState<PaymentListItem[]>([]);

  const [selectedPayment, setSelectedPayment] =
    useState<PaymentListItem | null>(null);

  const handleView = (payment: PaymentListItem) => {
    setSelectedPayment(payment);
  };

  useEffect(() => {
    // TODO: fetch payments from API
  }, []);

  return (
    <div className="space-y-6">
      <TopBar />

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Payments</h1>
        <button
          onClick={() => window.history.back()}
          className="text-blue-600 mr-5 hover:underline"
        >
          ← Back
        </button>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 bg-white p-4 rounded shadow-md">
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          + Add Payment
        </button>

        <select
          className="border rounded px-4 py-2"
          value={academicYearId}
          onChange={(e) => setAcademicYearId(Number(e.target.value))}
        >
          <option value="">All Academic Years</option>
        </select>

        <select
          className="border rounded px-4 py-2"
          value={termId}
          onChange={(e) => setTermId(Number(e.target.value))}
        >
          <option value="">All Terms</option>
        </select>
      </div>

      {/* Payments Table */}
      {payments.length === 0 ? (
        <div className="bg-white p-10 rounded shadow text-center text-gray-500">
          No payments found.
        </div>
      ) : (
        <PaymentsTable
          payments={payments}
          onView={handleView}
        />
      )}

      {/* Add Payment */}
      {showAddModal && (
        <PaymentModal onClose={() => setShowAddModal(false)} />
      )}

      {/* View Payment */}
      {selectedPayment && (
        <ViewPaymentModal
          payment={selectedPayment}
          onClose={() => setSelectedPayment(null)}
        />
      )}
    </div>
  );
};

export default PaymentsPage;
