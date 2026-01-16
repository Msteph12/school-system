"use client";

import { useState, useEffect } from "react";
import TopBar from "@/components/admin/TopBar";
import GradesModal from "@/components/admin/Grades/GradesModal";
import GradesTable from "@/components/admin/Grades/GradesTable";
import type { Grade } from "@/types/grade";

const Grades = () => { 
  const [showModal, setShowModal] = useState(false);

  // ✅ MISSING STATE
  const [grades] = useState<Grade[]>([]);

  // ✅ MISSING HANDLERS
  const handleView = (grade: Grade) => {
    console.log("View grade", grade);
  };

  const handleEdit = (grade: Grade) => {
    console.log("Edit grade", grade);
  };


  useEffect(() => {
  // placeholder – will be replaced with API call
}, []);

  return (
    <div className="space-y-6">
      <TopBar />

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Grades</h1>
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
          <h3 className="font-semibold">Grades</h3>
          <p className="text-sm">Manage grades per class & term</p>
        </button>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 bg-white p-4 rounded shadow-md">
        <button
          onClick={() => setShowModal(true)}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          + Add Grade
        </button>
      </div>

      {/* Grades Table */}
      <GradesTable
        grades={grades}
        onView={handleView}
        onEdit={handleEdit}
        />

      {/* Modal */}
      {showModal && (
        <GradesModal onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};

export default Grades;
