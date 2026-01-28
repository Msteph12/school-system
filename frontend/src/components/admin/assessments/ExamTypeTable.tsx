import React, { useState } from 'react';
import { Plus, Edit, Trash2, X, Loader2, AlertCircle } from 'lucide-react';
import type { ExamType } from '@/types/assessment';

interface ExamTypeTableProps {
  examTypes: ExamType[];
  onCreate: (name: string) => Promise<boolean> | void;
  onUpdate: (id: number, name: string) => Promise<boolean> | void;
  onDelete: (id: number) => Promise<boolean> | void;
  loading?: boolean;
  error?: string | null;
}

const ExamTypeTable: React.FC<ExamTypeTableProps> = ({
  examTypes,
  onCreate,
  onUpdate,
  onDelete,
  loading = false,
  error = null,
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentExamType, setCurrentExamType] = useState<ExamType | null>(null);
  const [newExamTypeName, setNewExamTypeName] = useState('');
  const [modalLoading, setModalLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleCreate = async () => {
    if (!newExamTypeName.trim()) return;

    setModalLoading(true);
    try {
      const result = await onCreate(newExamTypeName.trim());
      if (result !== false) {
        setNewExamTypeName('');
        setIsCreateModalOpen(false);
      }
    } finally {
      setModalLoading(false);
    }
  };

  const handleEdit = (examType: ExamType) => {
    setCurrentExamType(examType);
    setNewExamTypeName(examType.name);
    setIsEditModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!currentExamType || !newExamTypeName.trim()) return;

    setModalLoading(true);
    try {
      const result = await onUpdate(currentExamType.id, newExamTypeName.trim());
      if (result !== false) {
        setCurrentExamType(null);
        setNewExamTypeName('');
        setIsEditModalOpen(false);
      }
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this exam type?')) return;

    setDeletingId(id);
    try {
      const result = await onDelete(id);
      if (result === false) {
        alert('Failed to delete exam type');
      }
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Exam Types</h3>
          <p className="text-sm text-gray-500">Manage all exam types for assessments</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
          Create Exam Type
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {error ? (
              <tr>
                <td colSpan={2} className="px-6 py-8 text-center">
                  <AlertCircle size={48} className="text-red-500 mb-4 mx-auto" />
                  <p className="text-gray-600">{error}</p>
                </td>
              </tr>
            ) : examTypes.length > 0 ? (
              examTypes.map((examType) => (
                <tr key={examType.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{examType.name}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(examType)}
                        disabled={loading}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(examType.id)}
                        disabled={loading || deletingId === examType.id}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                      >
                        {deletingId === examType.id ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="px-6 py-8 text-center text-gray-500">
                  No exam types found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Create Exam Type</h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                title="Close modal"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="p-5">
              <div className="mb-4">
                <label htmlFor="create-exam-type-name" className="block text-sm font-medium text-gray-700 mb-2">
                  Exam Type Name *
                </label>
                <input
                  id="create-exam-type-name"
                  type="text"
                  value={newExamTypeName}
                  onChange={(e) => setNewExamTypeName(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                  placeholder="e.g., Mid-Term Exam"
                  autoFocus
                />
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  disabled={modalLoading}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 text-sm font-medium transition-colors disabled:opacity-50"
                  title="Cancel creation"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={!newExamTypeName.trim() || modalLoading}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Create exam type"
                >
                  {modalLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin" />
                      Creating...
                    </span>
                  ) : (
                    'Create'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && currentExamType && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Edit Exam Type</h3>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setCurrentExamType(null);
                  setNewExamTypeName('');
                }}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                title="Close modal"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="p-5">
              <div className="mb-4">
                <label htmlFor="edit-exam-type-name" className="block text-sm font-medium text-gray-700 mb-2">
                  Exam Type Name *
                </label>
                <input
                  id="edit-exam-type-name"
                  type="text"
                  value={newExamTypeName}
                  onChange={(e) => setNewExamTypeName(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                  placeholder="e.g., Mid-Term Exam"
                  autoFocus
                />
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setCurrentExamType(null);
                    setNewExamTypeName('');
                  }}
                  disabled={modalLoading}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 text-sm font-medium transition-colors disabled:opacity-50"
                  title="Cancel editing"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  disabled={!newExamTypeName.trim() || modalLoading}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Update exam type"
                >
                  {modalLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin" />
                      Updating...
                    </span>
                  ) : (
                    'Update'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamTypeTable;