"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import api from "@/services/api";
import TopBar from "@/components/admin/TopBar";
import type { Grade } from "@/types/grade";
import type { Subject } from "@/types/subject";

const GradesSubjects = () => {
  const { gradeId } = useParams<{ gradeId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [grade, setGrade] = useState<Grade | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      // Check if data was passed via navigation state
      if (location.state?.grade && location.state?.subjects) {
        setGrade(location.state.grade);
        setSubjects(location.state.subjects);
        setLoading(false);
        return;
      }

      // Otherwise, fetch from API
      try {
        // Fetch grade details
        const gradeResponse = await api.get(`/grades/${gradeId}`);
        setGrade(gradeResponse.data);

        // Fetch subjects for this grade
        const subjectsResponse = await api.get(`/subjects`, {
          params: { grade_id: gradeId }
        });
        setSubjects(subjectsResponse.data);
      } catch (error) {
        console.error("Error loading data:", error);
        setError("Failed to load grade subjects. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (gradeId) {
      loadData();
    }
  }, [gradeId, location.state]);

  const handleDeleteSubject = async (subjectId: string, subjectName: string) => {
    if (!confirm(`Are you sure you want to delete "${subjectName}"?`)) {
      return;
    }

    try {
      await api.delete(`/subjects/${subjectId}`);
      setSubjects(prev => prev.filter(s => s.id !== subjectId));
    } catch (error) {
      console.error("Error deleting subject:", error);
      alert("Failed to delete subject. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <TopBar />
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800">Loading...</h1>
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 mr-5 hover:underline"
          >
            ← Back
          </button>
        </div>
      </div>
    );
  }

  if (error || !grade) {
    return (
      <div className="space-y-6">
        <TopBar />
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800">Error</h1>
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 mr-5 hover:underline"
          >
            ← Back
          </button>
        </div>
        <div className="bg-white p-6 rounded shadow-md">
          <div className="text-center py-10">
            <div className="text-red-500 mb-4">{error || "Grade not found"}</div>
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Go Back
            </button>
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
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Subjects for {grade.name} ({grade.code})
          </h1>
          <p className="text-gray-600">
            {grade.status} • {grade.streamCount || 0} streams
          </p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 mr-5 hover:underline"
        >
          ← Back to All Grades
        </button>
      </div>

      {/* Subjects List */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {subjects.length} Subject{subjects.length !== 1 ? 's' : ''}
              </h3>
              <p className="text-gray-600 text-sm">
                Subjects assigned to this grade
              </p>
            </div>
            <button
              onClick={() => navigate("/admin/subjects")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add More Subjects
            </button>
          </div>
        </div>

        {subjects.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {subjects.map((subject) => (
                  <tr key={subject.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {subject.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {subject.code || "—"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        subject.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {subject.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => {
                          // TODO: Implement edit functionality
                          console.log("Edit subject:", subject);
                        }}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteSubject(subject.id, subject.name)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10">
            <div className="text-gray-400 text-5xl mb-4">📚</div>
            <p className="text-gray-500 text-lg mb-2">No subjects assigned to this grade yet</p>
            <p className="text-gray-400 text-sm mb-4">Start by adding subjects to this grade</p>
            <button
              onClick={() => navigate("/admin/subjects")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              + Add Subjects
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GradesSubjects;