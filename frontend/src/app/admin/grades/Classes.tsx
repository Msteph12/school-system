"use client";

import { useState, useEffect } from "react";
import TopBar from "@/components/admin/TopBar";
import ClassesModal from "@/components/admin/Grades/ClassesModal";
import ClassesTable from "@/components/admin/Grades/ClassesTable";
import type { Grade } from "@/types/grade";
import type { Class } from "@/types/class";

const ClassesPage = () => { 
  const [showModal, setShowModal] = useState(false);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [allClasses, setAllClasses] = useState<Class[]>([]);
  const [filteredClasses, setFilteredClasses] = useState<Class[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingClasses, setIsLoadingClasses] = useState(false);

  // Fetch grades and classes on component mount
  useEffect(() => {
    fetchGrades();
    fetchAllClasses();
  }, []);

  // Filter classes when selectedGrade changes
  useEffect(() => {
    if (!selectedGrade) {
      // Show all classes sorted by grade name
      const sortedClasses = [...allClasses].sort((a, b) => {
        // First sort by grade name
        const gradeCompare = a.gradeName.localeCompare(b.gradeName);
        if (gradeCompare !== 0) return gradeCompare;
        
        // Then sort by class display order if same grade
        return (a.display_order || 0) - (b.display_order || 0);
      });
      setFilteredClasses(sortedClasses);
    } else {
      // Filter classes for selected grade
      const filtered = allClasses
        .filter(classItem => String(classItem.gradeId) === String(selectedGrade.id))
        .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
      setFilteredClasses(filtered);
    }
  }, [selectedGrade, allClasses]);

  const fetchGrades = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/grades');
      const data = await response.json();
      const sortedGrades = (data.grades || []).sort((a: Grade, b: Grade) => 
        a.name.localeCompare(b.name)
      );
      setGrades(sortedGrades);
    } catch (error) {
      console.error("Error fetching grades:", error);
      setGrades([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllClasses = async () => {
    try {
      setIsLoadingClasses(true);
      const response = await fetch('/api/classes');
      const data = await response.json();
      setAllClasses(data.classes || []);
    } catch (error) {
      console.error("Error fetching classes:", error);
      setAllClasses([]);
    } finally {
      setIsLoadingClasses(false);
    }
  };

  const handleCloseFilter = () => {
    setSelectedGrade(null);
  };

  const handleViewClass = (classItem: Class) => {
    console.log("View class", classItem);
  };

  const handleEditClass = (classItem: Class) => {
    console.log("Edit class", classItem);
  };

  // Get display title based on selection
  const getTableTitle = () => {
    if (selectedGrade) {
      return `Classes for ${selectedGrade.name}`;
    }
    return "All Classes (Grouped by Grade)";
  };

  // Get unique grade count for display
  const getUniqueGradeCount = () => {
    if (!selectedGrade) {
      const gradeIds = new Set(allClasses.map(classItem => classItem.gradeId));
      return gradeIds.size;
    }
    return 1;
  };

  return (
    <div className="space-y-6">
      <TopBar />

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Classes</h1>
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
          onClick={() => setShowModal(true)}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          + Add Class
        </button>
        
        {/* Grade Selection Dropdown */}
        <div className="ml-auto">
          <label htmlFor="gradeSelect" className="mr-2 text-gray-700">
            Filter by Grade:
          </label>
          <select
            id="gradeSelect"
            value={selectedGrade?.id || ""}
            onChange={(e) => {
              const gradeId = e.target.value;
              if (!gradeId) {
                setSelectedGrade(null);
              } else {
                const grade = grades.find(g => String(g.id) === gradeId);
                setSelectedGrade(grade || null);
              }
            }}
            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            <option value="">All Grades</option>
            {grades.map((grade) => (
              <option key={grade.id} value={grade.id}>
                {grade.name} ({grade.code})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading || isLoadingClasses ? (
        <div className="bg-white p-10 rounded shadow-md shadow-blue-200 text-center">
          Loading classes data...
        </div>
      ) : (
        <ClassesTable
          classes={filteredClasses}
          gradeName={getTableTitle()}
          onClose={selectedGrade ? handleCloseFilter : undefined}
          onView={handleViewClass}
          onEdit={handleEditClass}
          showGradeColumn={!selectedGrade}
          gradeCount={getUniqueGradeCount()}
          totalClasses={allClasses.length}
        />
      )}

      {/* Modal */}
      {showModal && (
        <ClassesModal onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};

export default ClassesPage;