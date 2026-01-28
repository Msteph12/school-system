"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import TopBar from "@/components/admin/TopBar";
import GradesModal from "@/components/admin/Grades/GradesModal";
import GradesTable from "@/components/admin/Grades/GradesTable";
import type { Grade } from "@/types/grade";
import api from "@/services/api";

const Grades = () => {
  const [showModal, setShowModal] = useState(false);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingGrade, setEditingGrade] = useState<Grade | null>(null);

  // View (placeholder)
  const handleView = (grade: Grade) => {
    console.log("View grade", grade);
    alert(`Viewing: ${grade.name} (${grade.code})`);
  };

  // Edit
  const handleEdit = (grade: Grade) => {
    setEditingGrade(grade);
    setShowModal(true);
  };

  // View streams (placeholder)
  const handleViewStreams = (grade: Grade) => {
    console.log("View streams for grade", grade);
    alert(`Viewing streams for: ${grade.name} - ${grade.classCount} streams`);
  };

  // Load grades
  useEffect(() => {
    const loadGrades = async () => {
      setLoading(true);
      try {
        const response = await api.get("/grades");
        setGrades(response.data);
      } catch (error) {
        console.error("Error fetching grades:", error);
      } finally {
        setLoading(false);
      }
    };

    loadGrades();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <TopBar />
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800">Grades</h1>
          <button
            onClick={() => window.history.back()}
            className="text-blue-600 mr-5 hover:underline"
          >
            ← Back
          </button>
        </div>

        <div className="bg-white p-10 rounded shadow-md shadow-blue-200 text-center">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

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

      {/* Quick navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-4 rounded shadow-md">
        <Link
          to="/admin/streams"
          className="bg-blue-100 hover:bg-blue-200 text-blue-800 p-4 rounded-lg text-left transition block"
        >
          <h3 className="font-semibold">Grades</h3>
          <p className="text-sm">Manage grades per class & term</p>
        </Link>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 bg-white p-4 rounded shadow-md">
        <button
          onClick={() => {
            setEditingGrade(null);
            setShowModal(true);
          }}
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
        onViewStreams={handleViewStreams}
      />

      {/* Modal */}
      {showModal && (
        <GradesModal
          gradeToEdit={editingGrade}
          onClose={() => {
            setShowModal(false);
            setEditingGrade(null);
          }}
          onGradeAdded={(savedGrade) => {
            setGrades((prev) =>
              editingGrade
                ? prev.map((g) =>
                    g.id === savedGrade.id ? savedGrade : g
                  )
                : [...prev, savedGrade]
            );
          }}
        />
      )}
    </div>
  );
};

export default Grades;
