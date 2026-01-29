"use client";

import { useState, useEffect } from "react";
import TopBar from "@/components/admin/TopBar";
import FeesStructureModal from "@/components/admin/finance/FeesStructureModal";
import FeesStructureTable from "@/components/admin/finance/FeesStructureTable";
import QuickNavCards from "@/components/common/QuickNavCards";
import type { FeeStructureListItem } from "@/types/Fees";
import type { QuickNavCard } from "@/types/result";

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

  // Quick navigation cards data
  const quickNavCards: QuickNavCard[] = [
    {
      title: "Payments",
      description: "Manage payments in the school",
      onClick: () => (window.location.href = "/admin/payments"),
      gradient: "from-blue-500 to-blue-700",
    },
    {
      title: "Student Fees",
      description: "Manages fees per student",
      onClick: () => (window.location.href = "/admin/finance/student-fees"),
      gradient: "from-green-500 to-green-700",
    },
    {
      title: "Student Balances",
      description: "List of student with balances",
      onClick: () => (window.location.href = "/admin/finance/student-balances"),
      gradient: "from-purple-500 to-purple-700",
    },
  ];

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

      {/* Quick navigation cards */}
      <QuickNavCards cards={quickNavCards} />

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