"use client";

import { useEffect, useState } from "react";
import TopBar from "@/components/admin/TopBar";
import ClassesModal from "@/components/admin/Grades/ClassesModal";
import ClassesTable from "@/components/admin/Grades/ClassesTable";
import QuickNavCards from "@/components/common/QuickNavCards";
import type { Grade } from "@/types/grade";
import type { Class } from "@/types/class";
import type { QuickNavCard } from "@/types/result";

const ClassesPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [filteredClasses, setFilteredClasses] = useState<Class[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);
  const [loadingGrades, setLoadingGrades] = useState(true);
  const [loadingClasses, setLoadingClasses] = useState(true);

  /* ---------------- FETCH DATA ---------------- */

  const fetchGrades = async () => {
    try {
      setLoadingGrades(true);
      const res = await fetch("/api/grades");
      const data = await res.json();

      setGrades(
        (data.grades || []).sort((a: Grade, b: Grade) =>
          a.name.localeCompare(b.name)
        )
      );
    } catch (err) {
      console.error("Failed to fetch grades", err);
      setGrades([]);
    } finally {
      setLoadingGrades(false);
    }
  };

  const fetchClasses = async () => {
    try {
      setLoadingClasses(true);
      const res = await fetch("/api/school-classes");
      const data = await res.json();
      setClasses(data.classes || []);
    } catch (err) {
      console.error("Failed to fetch classes", err);
      setClasses([]);
    } finally {
      setLoadingClasses(false);
    }
  };

  /* ---------------- EFFECTS ---------------- */

  useEffect(() => {
    fetchGrades();
    fetchClasses();
  }, []);

  useEffect(() => {
    if (!selectedGrade) {
      const sorted = [...classes].sort((a, b) => {
        const gradeCompare = a.gradeName.localeCompare(b.gradeName);
        if (gradeCompare !== 0) return gradeCompare;
        return (a.display_order || 0) - (b.display_order || 0);
      });
      setFilteredClasses(sorted);
    } else {
      setFilteredClasses(
        classes
          .filter((c) => String(c.gradeId) === String(selectedGrade.id))
          .sort(
            (a, b) =>
              (a.display_order || 0) - (b.display_order || 0)
          )
      );
    }
  }, [classes, selectedGrade]);

  /* ---------------- ACTIONS ---------------- */

  const handleToggleStatus = async (id: string) => {
    await fetch(`/api/school-classes/${id}/status`, {
      method: "PATCH",
    });
    fetchClasses();
  };

  const handleCloseFilter = () => setSelectedGrade(null);

  /* ---------------- UI HELPERS ---------------- */

  const tableTitle = selectedGrade
    ? `Classes for ${selectedGrade.name}`
    : "All Classes (Grouped by Grade)";

  const uniqueGradeCount = new Set(classes.map((c) => c.gradeId)).size;

  /* ---------------- QUICK NAV CARDS ---------------- */

  const quickNavCards: QuickNavCard[] = [
    {
      title: "Classes",
      description: "Manage all classes",
      onClick: () => (window.location.href = "/admin/classes"),
      gradient: "from-blue-500 to-blue-700",
    },
    {
      title: "Grades",
      description: "Manage academic grades",
      onClick: () => (window.location.href = "/admin/grades"),
      gradient: "from-green-500 to-green-700",
    },
    {
      title: "Subjects per Grade",
      description: "Assign subjects to grades",
      onClick: () => (window.location.href = "/admin/subjects-per-grade"),
      gradient: "from-purple-500 to-purple-700",
    },
  ];

  /* ---------------- RENDER ---------------- */

  return (
    <div className="space-y-6">
      <TopBar />

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Classes</h1>
        <button
          onClick={() => window.history.back()}
          className="text-blue-600 hover:underline"
        >
          ← Back
        </button>
      </div>

      {/* Quick navigation cards */}
      <QuickNavCards cards={quickNavCards} />

      {/* Actions */}
      <div className="flex items-center gap-4 bg-white p-4 rounded shadow">
        <button
          onClick={() => setShowModal(true)}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          + Add Class
        </button>

        <div className="ml-auto">
          <label className="mr-2 text-gray-700">Filter by Grade:</label>
          <select
            value={selectedGrade?.id || ""}
            onChange={(e) => {
              const grade = grades.find(
                (g) => String(g.id) === e.target.value
              );
              setSelectedGrade(grade || null);
            }}
            className="px-4 py-2 border rounded"
            disabled={loadingGrades}
          >
            <option value="">All Grades</option>
            {grades.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name} ({g.code})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      {loadingGrades || loadingClasses ? (
        <div className="bg-white p-10 rounded shadow text-center">
          Loading classes...
        </div>
      ) : (
        <ClassesTable
          classes={filteredClasses}
          gradeName={tableTitle}
          onClose={selectedGrade ? handleCloseFilter : undefined}
          onToggleStatus={handleToggleStatus}
          showGradeColumn={!selectedGrade}
          gradeCount={uniqueGradeCount}
          totalClasses={classes.length}
        />
      )}

      {/* Modal */}
      {showModal && (
        <ClassesModal
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            fetchClasses();
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
};

export default ClassesPage;