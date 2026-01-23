"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";
import TopBar from "@/components/admin/TopBar";
import SubjectsModal from "@/components/admin/Grades/SubjectsModal";
import type { Grade } from "@/types/grade";
import type { Subject } from "@/types/subject";

const SubjectsPerGrade = () => {
  const [showModal, setShowModal] = useState(false);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch grades and subjects on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch grades
        const gradesResponse = await api.get("/grades");
        const gradesData = gradesResponse.data;
        setGrades(gradesData);

        // Fetch subjects
        const subjectsResponse = await api.get("/subjects");
        const subjectsData = subjectsResponse.data;
        setSubjects(subjectsData);
      } catch (error) {
        console.error("Error loading data:", error);
        setError(`Failed to load data. Please try again.`);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Get subjects count for a specific grade
  const getSubjectsCountForGrade = (gradeId: string) => {
    return subjects.filter(subject => subject.grade_id === String(gradeId)).length;
  };

  // Handle subject added
  const handleSubjectAdded = (newSubject: Subject) => {
    setSubjects(prev => [...prev, newSubject]);
  };

  // Handle grade card click - navigate to grade subjects page
  const handleGradeCardClick = (grade: Grade) => {
    navigate(`/admin/subjects/grade/${grade.id}`, {
      state: {
        grade,
        subjects: subjects.filter(s => s.grade_id === String(grade.id))
      }
    });
  };

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <TopBar />
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800">Subjects per Grade</h1>
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 mr-5 hover:underline"
          >
            ← Back
          </button>
        </div>
        
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-48 bg-gray-200 rounded-2xl"></div>
              ))}
            </div>
            <div className="h-12 bg-gray-200 rounded w-full mt-6"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-64 bg-gray-200 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 p-6">
        <TopBar />
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800">Subjects per Grade</h1>
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 mr-5 hover:underline"
          >
            ← Back
          </button>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center py-8">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Failed to Load Data</h3>
            <p className="text-gray-600 mb-4">
              Could not connect to the server. Please check your connection and try again.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Error: {error}
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <TopBar />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Subjects per Grade
          </h1>
          <p className="text-gray-600">Browse and manage subjects assigned to each grade</p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:underline"
        >
          ← Back
        </button>
      </div>

      {/* Quick Navigation Section with Add Subject Button */}
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Subjects Management</h3>
            <p className="text-gray-600 text-sm">
              Add new subjects or browse existing ones by grade
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 whitespace-nowrap"
          >
            <span className="text-xl">+</span>
            <span>Add Subject</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="relative h-48 rounded-2xl overflow-hidden shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-red-600/80 to-red-400/80" />
          <div className="relative h-full p-5 flex flex-col justify-end text-white">
            <p className="text-sm opacity-90">Total Grades</p>
            <h2 className="text-2xl font-bold mt-1">{grades.length}</h2>
            <p className="text-xs opacity-80 mt-1">Active grades in system</p>
          </div>
        </div>

        <div className="relative h-48 rounded-2xl overflow-hidden shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-green-600/80 to-green-400/80" />
          <div className="relative h-full p-5 flex flex-col justify-end text-white">
            <p className="text-sm opacity-90">Total Subjects</p>
            <h2 className="text-2xl font-bold mt-1">{subjects.length}</h2>
            <p className="text-xs opacity-80 mt-1">Subjects across all grades</p>
          </div>
        </div>

        <div className="relative h-48 rounded-2xl overflow-hidden shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/80 to-blue-400/80" />
          <div className="relative h-full p-5 flex flex-col justify-end text-white">
            <p className="text-sm opacity-90">Active Subjects</p>
            <h2 className="text-2xl font-bold mt-1">
              {subjects.filter(s => s.status === 'Active').length}
            </h2>
            <p className="text-xs opacity-80 mt-1">Currently active subjects</p>
          </div>
        </div>
      </div>

      {/* Grade Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {grades.map((grade) => {
          const subjectsCount = getSubjectsCountForGrade(String(grade.id));
          const gradientClass = getGradientClass(grade.status);
          const gradeSubjects = subjects.filter(s => s.grade_id === String(grade.id));
          
          return (
            <div
              key={grade.id}
              onClick={() => handleGradeCardClick(grade)}
              className="relative h-64 rounded-2xl overflow-hidden shadow-lg cursor-pointer transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl group"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass}`} />

              <div className="relative h-full p-6 flex flex-col justify-between text-white">
                {/* Top Section - Grade Details */}
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-1">{grade.name}</h3>
                      <p className="text-sm opacity-90">Code: {grade.code}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      grade.status === "Active" 
                        ? "bg-white/20 backdrop-blur-sm" 
                        : "bg-black/20 backdrop-blur-sm"
                    }`}>
                      {grade.status}
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm opacity-90">Classes:</span>
                      <span className="font-semibold">{grade.classCount || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Middle Section - Subjects Count */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <p className="text-sm opacity-90">Subjects Assigned</p>
                      <h4 className="text-2xl font-bold">{subjectsCount}</h4>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Section - Subject Preview */}
                <div className="pt-4 border-t border-white/20">
                  <p className="text-sm opacity-90 mb-2">Subjects:</p>
                  {gradeSubjects.length > 0 ? (
                    <div className="space-y-1">
                      {gradeSubjects.slice(0, 3).map((subject, index) => (
                        <div key={subject.id || index} className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-white/60"></div>
                          <span className="text-sm truncate">{subject.name}</span>
                        </div>
                      ))}
                      {gradeSubjects.length > 3 && (
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-2 h-2 rounded-full bg-white/40"></div>
                          <span className="text-xs opacity-80">
                            +{gradeSubjects.length - 3} more subjects
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm opacity-80 italic">No subjects assigned yet</p>
                  )}
                  <p className="text-xs opacity-80 mt-3 text-center">
                    Click to view all subjects →
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State for No Grades */}
      {grades.length === 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-10 text-center">
          <div className="text-gray-400 text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Grades Found</h3>
          <p className="text-gray-600 mb-6">
            You need to create grades first before assigning subjects.
          </p>
          <button
            onClick={() => navigate("/admin/grades")}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
          >
            Go to Grades Management
          </button>
        </div>
      )}

      {/* Add Subject Modal */}
      {showModal && (
        <SubjectsModal
          grades={grades}
          onClose={() => setShowModal(false)}
          onSubjectAdded={handleSubjectAdded}
        />
      )}
    </div>
  );
};

// Helper function to determine gradient class based on grade status
const getGradientClass = (status: string) => {
  switch (status.toLowerCase()) {
    case "active":
      return "from-blue-600/90 to-blue-500/90";
    case "inactive":
      return "from-gray-600/90 to-gray-500/90";
    default:
      return "from-purple-600/90 to-purple-500/90";
  }
};

export default SubjectsPerGrade;