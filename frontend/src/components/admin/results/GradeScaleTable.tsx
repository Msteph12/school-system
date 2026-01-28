import React from 'react';
import { FaEdit, FaToggleOn, FaToggleOff, FaTrash, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import type { GradeScale } from '@/types/grade';

interface GradesTableProps {
  grades: GradeScale[];
  onEdit: (grade: GradeScale) => void;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
  error?: string | null;
  onRetry?: () => void;
}

const GradesTable: React.FC<GradesTableProps> = ({
  grades,
  onEdit,
  onToggleStatus,
  onDelete,
  isLoading,
  error = null,
  onRetry,
}) => {
  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <FaSpinner className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
        <p className="mt-2 text-gray-600">Loading grades...</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
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
          {error ? (
            <tr>
              <td colSpan={3} className="px-6 py-12 text-center">
                <div className="flex flex-col items-center justify-center gap-3">
                  <FaExclamationTriangle className="w-12 h-12 text-red-500" />
                  <div>
                    <h3 className="font-semibold text-red-800 text-lg">Failed to load grades</h3>
                    <p className="text-red-600 mt-1">{error}</p>
                  </div>
                  {onRetry && (
                    <button
                      onClick={onRetry}
                      className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Retry
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ) : grades.length === 0 ? (
            <tr>
              <td colSpan={3} className="px-6 py-8 text-center">
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="text-gray-500 text-lg">No grade scales yet</div>
                  <div className="text-gray-400 text-sm">Add your first grade scale to get started</div>
                </div>
              </td>
            </tr>
          ) : (
            grades.map((grade) => (
              <tr key={grade.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{grade.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    grade.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {grade.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onEdit(grade)}
                      className="text-blue-600 hover:text-blue-900"
                      title="Edit grade"
                    >
                      <FaEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onToggleStatus(grade.id)}
                      className={grade.status === 'active' 
                        ? 'text-yellow-600 hover:text-yellow-900' 
                        : 'text-green-600 hover:text-green-900'
                      }
                      title={grade.status === 'active' ? 'Disable grade' : 'Enable grade'}
                    >
                      {grade.status === 'active' ? (
                        <FaToggleOn className="w-5 h-5" />
                      ) : (
                        <FaToggleOff className="w-5 h-5" />
                      )}
                    </button>
                    <button
                      onClick={() => onDelete(grade.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete grade"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default GradesTable;