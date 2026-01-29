// components/admin/Grades/SubjectsTable.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Grade } from "@/types/grade";
import type { Subject } from "@/types/subject";
import EditSubjectModal from "./EditSubjectModal";

interface SubjectsTableProps {
  subjects: Subject[];
  grades: Grade[];
  onDeleteSubject: (subjectId: string, subjectName: string) => Promise<void>;
  onToggleStatus: (subject: Subject) => Promise<void>;
  onEditSubject: (subjectId: string, updatedData: Partial<Subject>) => Promise<void>;
  hideViewGradeAction?: boolean;
}

const SubjectsTable = ({ 
  subjects, 
  grades, 
  onDeleteSubject, 
  onToggleStatus,
  onEditSubject 
}: SubjectsTableProps) => {
  const navigate = useNavigate();
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const handleEdit = (subject: Subject) => {
    setEditingSubject(subject);
  };

  const handleSaveEdit = async (updatedData: Partial<Subject>) => {
    if (editingSubject) {
      await onEditSubject(editingSubject.id, updatedData);
      setEditingSubject(null);
    }
  };

  const handleDelete = async (subjectId: string, subjectName: string) => {
    if (confirm(`Are you sure you want to delete "${subjectName}"?`)) {
      setDeletingId(subjectId);
      try {
        await onDeleteSubject(subjectId, subjectName);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleToggle = async (subject: Subject) => {
    setTogglingId(subject.id);
    try {
      await onToggleStatus(subject);
    } finally {
      setTogglingId(null);
    }
  };

  const handleViewGradeSubjects = (subject: Subject) => {
    // Find the grade for this subject
    const grade = grades.find(g => String(g.id) === String(subject.grade_id));
    if (grade) {
      // Navigate to the grade subjects page
      navigate(`/admin/subjects/grade/${grade.id}`, {
        state: {
          grade,
          subjects: subjects.filter(s => s.grade_id === String(grade.id))
        }
      });
    } else {
      // Fallback: navigate to grade page anyway
      navigate(`/admin/subjects/grade/${subject.grade_id}`);
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">All Subjects</h3>
              <p className="text-sm text-gray-600">Complete list of subjects across all grades</p>
            </div>
            <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
              {subjects.length} Subjects
            </span>
          </div>
        </div>
        
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
                  Grade
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
                const grade = grades.find(g => String(g.id) === String(subject.grade_id));
                const isDeleting = deletingId === subject.id;
                const isToggling = togglingId === subject.id;
                
                return (
                  <tr key={subject.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 font-semibold text-sm">
                            {subject.name.charAt(0)}
                          </span>
                        </div>
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
                      <div className="text-sm text-gray-900">
                        {grade ? grade.name : `Grade ${subject.grade_id}`}
                      </div>
                      <div className="text-xs text-gray-500">
                        {grade ? grade.code : `Code: ${subject.grade_id}`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggle(subject)}
                        disabled={isToggling}
                        className={`px-2.5 py-1 text-xs font-medium rounded-full cursor-pointer transition-colors flex items-center gap-1 ${
                          subject.status === 'Active' 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        } ${isToggling ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title={`Click to ${subject.status === 'Active' ? 'deactivate' : 'activate'}`}
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
                          onClick={() => handleViewGradeSubjects(subject)}
                          className="text-blue-600 hover:text-blue-900 transition-colors px-2 py-1 rounded hover:bg-blue-50 flex items-center gap-1"
                          title="View all subjects in this grade"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View Grade
                        </button>
                        <button
                          onClick={() => handleEdit(subject)}
                          className="text-green-600 hover:text-green-900 transition-colors px-2 py-1 rounded hover:bg-green-50 flex items-center gap-1"
                          title="Edit subject"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(subject.id, subject.name)}
                          disabled={isDeleting}
                          className={`text-red-600 hover:text-red-900 transition-colors px-2 py-1 rounded hover:bg-red-50 flex items-center gap-1 ${
                            isDeleting ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                          title="Delete subject"
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Subjects Found</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              No subjects have been created yet. Add your first subject to get started.
            </p>
          </div>
        )}

        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <div>
              Showing <span className="font-medium">{subjects.length}</span> subjects
            </div>
            <div className="flex items-center space-x-4">
              <button
                className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => {/* Handle previous page */}}
                disabled={true}
              >
                Previous
              </button>
              <span className="px-2">Page 1 of 1</span>
              <button
                className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => {/* Handle next page */}}
                disabled={true}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Subject Modal */}
      {editingSubject && (
        <EditSubjectModal
          subject={editingSubject}
          grades={grades}
          onClose={() => setEditingSubject(null)}
          onSave={handleSaveEdit}
        />
      )}
    </>
  );
};

export default SubjectsTable;