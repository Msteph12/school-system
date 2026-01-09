"use client";

import { useState, useEffect } from "react";
import TopBar from "@/components/admin/TopBar";
import FeesStructureModal from "@/components/admin/finance/FeesStructureModal";
import FeesStructureTable from "@/components/admin/finance/FeesStructureTable";
import type { FeeStructureListItem } from "@/types/Fees";

const FeesStructure = () => { 
  const [showModal, setShowModal] = useState(false);

  // ✅ MISSING STATE
  const [fees] = useState<FeeStructureListItem[]>([]);

  // ✅ MISSING HANDLERS
  const handleView = (fee: FeeStructureListItem) => {
    console.log("View fee structure", fee);
  };

  const handleEdit = (fee: FeeStructureListItem) => {
    console.log("Edit fee structure", fee);
  };


  useEffect(() => {
  // placeholder – will be replaced with API call
}, []);

  return (
    <div className="space-y-6">
      <TopBar />

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Fees Structure</h1>
        <button
          onClick={() => window.history.back()}
          className="text-blue-600 mr-5 hover:underline"
        >
          ← Back
        </button>
      </div>

      {/* Finance quick navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-4 rounded shadow-md">
        <button className="bg-blue-100 hover:bg-blue-200 text-blue-800 p-4 rounded-lg text-left transition">
          <h3 className="font-semibold">Fees Structure</h3>
          <p className="text-sm">Manage fees per grade & term</p>
        </button>

        <button className="bg-blue-100 hover:bg-blue-200 text-blue-800 p-4 rounded-lg text-left transition">
          <h3 className="font-semibold">Student Invoicing</h3>
          <p className="text-sm">Generate student fee invoices</p>
        </button>

        <button className="bg-blue-100 hover:bg-blue-200 text-blue-800 p-4 rounded-lg text-left transition">
          <h3 className="font-semibold">Payments</h3>
          <p className="text-sm">Track and manage payments</p>
        </button>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 bg-white p-4 rounded shadow-md">
        <button
          onClick={() => setShowModal(true)}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          + Add Fees Structure
        </button>
      </div>

      {/* Fees Structure Table */}
      <FeesStructureTable
        fees={fees}
        onView={handleView}
        onEdit={handleEdit}
        />


      {/* Modal */}
      {showModal && (
        <FeesStructureModal onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};

export default FeesStructure;
