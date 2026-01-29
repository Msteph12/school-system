"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import api from "@/services/api";
import TopBar from "@/components/admin/TopBar";
import SubjectsModal from "@/components/admin/Grades/SubjectsModal";
import EditSubjectModal from "@/components/admin/Grades/EditSubjectModal";
import type { Grade } from "@/types/grade";
import type { Subject } from "@/types/subject";

// Define interface for form data
interface SubjectFormData {
  grade_id: string;
  name: string;
  code?: string;
  status?: string;
}

const GradesSubjects = () => {
  const { gradeId } = useParams<{ gradeId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [grade, setGrade] = useState<Grade | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [savingEditId, setSavingEditId] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
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
        const gradeData = gradeResponse.data;
        setGrade(gradeData);

        // Fetch subjects for this grade
        const subjectsResponse = await api.get(`/subjects`, {
          params: { grade_id: gradeId }
        });
        const subjectsData = subjectsResponse.data;
        setSubjects(subjectsData);
      } catch (error) {
        console.error("Error loading data:", error);
        setError("Failed to load grade and subject data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (gradeId) {
      loadData();
    }
  }, [gradeId, location.state]);

  // Handle subject deletion with proper feedback
  const handleDeleteSubject = async (subjectId: string, subjectName: string) => {
    if (!confirm(`Are you sure you want to delete "${subjectName}"? This action cannot be undone.`)) {
      return;
    }

    setDeletingId(subjectId);
    
    try {
      await api.delete(`/subjects/${subjectId}`);
      setSubjects(prev => prev.filter(s => s.id !== subjectId));
      alert(`"${subjectName}" successfully deleted!`);
    } catch (error) {
      console.error("Error deleting subject:", error);
      alert(`Failed to delete "${subjectName}". Please try again.`);
    } finally {
      setDeletingId(null);
    }
  };

  // Handle subject status toggle with proper feedback
  const handleToggleStatus = async (subject: Subject) => {
    setTogglingId(subject.id);
    const newStatus = subject.status === "Active" ? "Inactive" : "Active";
    
    try {
      const updatedSubject = { ...subject, status: newStatus };
      await api.put(`/subjects/${subject.id}`, updatedSubject);
      setSubjects(prev => prev.map(s => 
        s.id === subject.id ? updatedSubject : s
      ));
      alert(`Subject status successfully updated to ${newStatus}!`);
    } catch (error) {
      console.error("Error updating subject status:", error);
      alert(`Failed to update subject status. Please try again.`);
    } finally {
      setTogglingId(null);
    }
  };

  // Handle subject edit with proper feedback
  const handleEditSubject = async (subjectId: string, updatedData: Partial<Subject>) => {
    setSavingEditId(subjectId);
    
    try {
      await api.put(`/subjects/${subjectId}`, updatedData);
      setSubjects(prev => prev.map(s => 
        s.id === subjectId ? { ...s, ...updatedData } : s
      ));
      alert(`Subject successfully updated!`);
    } catch (error) {
      console.error("Error updating subject:", error);
      alert(`Failed to update subject. Please try again.`);
    } finally {
      setSavingEditId(null);
    }
  };

  // Handle new subject added
  const handleSubjectAdded = (newSubject: Subject) => {
    setSubjects(prev => [...prev, newSubject]);
    alert(`"${newSubject.name}" successfully added!`);
  };

  // Handle edit click
  const handleEdit = (subject: Subject) => {
    setEditingSubject(subject);
  };

  // Handle save edit
  const handleSaveEdit = async (updatedData: Partial<Subject>) => {
    if (editingSubject) {
      try {
        await handleEditSubject(editingSubject.id, updatedData);
        setEditingSubject(null);
      } catch (error) {
        console.error("Error saving edit:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <TopBar />
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800">Loading Grade Subjects...</h1>
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:underline"
            aria-label="Go back"
          >
            ← Back
          </button>
        </div>
        
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>
              ))}
            </div>
            <div className="h-64 bg-gray-200 rounded-2xl mt-6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !grade) {
    return (
      <div className="space-y-6 p-6">
        <TopBar />
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800">Grade Subjects</h1>
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:underline"
            aria-label="Go back"
          >
            ← Back
          </button>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center py-8">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Unable to Load Data</h3>
            <p className="text-gray-600 mb-4">
              {error}
            </p>
            <button
              onClick={() => navigate("/admin/subjects-per-grade")}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              aria-label="Back to all grades"
            >
              Back to All Grades
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!grade) {
    return (
      <div className="space-y-6 p-6">
        <TopBar />
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800">Grade Not Found</h1>
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:underline"
            aria-label="Go back"
          >
            ← Back
          </button>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center py-8">
            <div className="text-gray-400 text-4xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Grade Not Available</h3>
            <p className="text-gray-600 mb-4">
              The requested grade could not be found.
            </p>
            <button
              onClick={() => navigate("/admin/subjects-per-grade")}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              aria-label="Back to all grades"
            >
              Back to All Grades
            </button>
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
            {grade.name} Subjects
          </h1>
          <p className="text-gray-600">
            All subjects assigned to {grade.name} ({grade.code})
          </p>
        </div>
        <button
          onClick={() => navigate("/admin/subjects-per-grade")}
          className="text-blue-600 hover:underline"
          aria-label="Back to all grades"
        >
          ← Back to All Grades
        </button>
      </div>

      {/* Grade Info Card */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                grade.status === "Active" 
                  ? "bg-blue-100 text-blue-600" 
                  : "bg-gray-100 text-gray-600"
              }`}>
                <span className="text-lg font-bold">{grade.name.charAt(grade.name.length - 1)}</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">{grade.name}</h3>
                <p className="text-gray-600">Code: {grade.code} • Status: {grade.status}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
              aria-label={`Add subjects to ${grade.name}`}
            >
              <span className="text-xl">+</span>
              <span>Add Subjects to {grade.name}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Subjects Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Subjects in {grade.name}</h3>
              <p className="text-sm text-gray-600">All subjects assigned to this grade</p>
            </div>
            <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
              {subjects.length} Subjects
            </span>
          </div>
        </div>

        {/* Custom Subjects Table for Grade Page */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject Code
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {subjects.map((subject) => {
                const isDeleting = deletingId === subject.id;
                const isToggling = togglingId === subject.id;
                
                return (
                  <tr key={subject.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{subject.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                        {subject.code}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(subject)}
                        disabled={isToggling}
                        className={`px-2.5 py-1 text-xs font-medium rounded-full cursor-pointer transition-colors flex items-center gap-1 ${
                          subject.status === 'Active' 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        } ${isToggling ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title={`Click to ${subject.status === 'Active' ? 'deactivate' : 'activate'}`}
                        aria-label={`${subject.status === 'Active' ? 'Deactivate' : 'Activate'} ${subject.name}`}
                      >
                        {isToggling ? (
                          <>
                            <span className="animate-spin h-3 w-3 border-2 border-current border-t-transparent rounded-full"></span>
                            Updating...
                          </>
                        ) : subject.status}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleEdit(subject)}
                          className="text-green-600 hover:text-green-900 transition-colors px-2 py-1 rounded hover:bg-green-50 flex items-center gap-1"
                          title="Edit subject"
                          aria-label={`Edit ${subject.name}`}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteSubject(subject.id, subject.name)}
                          disabled={isDeleting}
                          className={`text-red-600 hover:text-red-900 transition-colors px-2 py-1 rounded hover:bg-red-50 flex items-center gap-1 ${
                            isDeleting ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                          title="Delete subject"
                          aria-label={`Delete ${subject.name}`}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          {isDeleting ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {subjects.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📚</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Subjects Assigned</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              No subjects have been assigned to {grade.name} yet.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              aria-label={`Add first subject to ${grade.name}`}
            >
              Add First Subject
            </button>
          </div>
        )}

        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <div>
              Showing <span className="font-medium">{subjects.length}</span> subjects in {grade.name}
            </div>
            <div className="flex items-center space-x-2">
              <button
                className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => navigate(`/admin/subjects-per-grade`)}
                aria-label="View all grades"
              >
                ← View All Grades
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Subject Modal */}
      {showAddModal && (
        <SubjectsModal
          grades={[grade]}
          onClose={() => setShowAddModal(false)}
          onSubjectAdded={handleSubjectAdded}
        />
      )}

      {/* Edit Subject Modal */}
      {editingSubject && (
        <EditSubjectModal
          subject={editingSubject}
          grades={[grade]}
          onClose={() => setEditingSubject(null)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
};

export default GradesSubjects;