import React from 'react';
import type { ResultEntry } from '@/types/result';

interface EnterResultsTableProps {
  results: ResultEntry[];
  allCriteriaSelected: boolean;

  // backend-aligned actions
  onEditResult: (result: ResultEntry) => void;
  onDeleteResult?: (id: string) => void; // optional
}

const EnterResultsTable: React.FC<EnterResultsTableProps> = ({
  results,
  allCriteriaSelected,
  onEditResult,
  onDeleteResult,
}) => {
  const getGradeColor = (grade?: string) => {
    if (!grade) return 'bg-gray-100 text-gray-800';
    if (grade.startsWith('A')) return 'bg-green-100 text-green-800';
    if (grade.startsWith('B')) return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

  if (results.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Entered Results</h3>
              <p className="text-gray-600 text-sm">
                {results.length} result{Number(results.length) !== 1 ? 's' : ''} found
              </p>
            </div>
          </div>
        </div>
        <div className="text-center py-12">
          <div className="text-gray-400 text-5xl mb-4">📊</div>
          <p className="text-gray-500 text-lg mb-2">No results found</p>
          <p className="text-gray-400 text-sm">
            {allCriteriaSelected
              ? "No results entered for selected criteria"
              : "Select all filters to view results"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Entered Results</h3>
            <p className="text-gray-600 text-sm">
              {results.length} result{results.length !== 1 ? 's' : ''} found
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Admission No.
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Marks
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Grade
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Remarks
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {results.map((result) => (
              <tr key={result.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {result.admission_no}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {result.student_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  {result.marks}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs rounded-full font-medium ${getGradeColor(
                      result.grade_scale
                    )}`}
                  >
                    {result.grade_scale || 'N/A'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                  {result.remarks || '—'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                  <button
                    onClick={() => onEditResult(result)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Edit
                  </button>

                  {onDeleteResult && (
                    <button
                      onClick={() => onDeleteResult(result.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EnterResultsTable;
