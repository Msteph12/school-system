import React from 'react';
import type { ResultDisplay } from '@/types/result';

interface ResultsTableProps {
  results: ResultDisplay[];
  termLocked: boolean;
  studentName: string;
  onPrintPreview: () => void;
  onEditResult: (resultId: string) => void;
  loading: boolean;
  admissionNo: string;
}

const ResultsTable: React.FC<ResultsTableProps> = ({
  results,
  termLocked,
  studentName,
  onPrintPreview,
  onEditResult,
  loading,
  admissionNo,
}) => {
  const getGradeColor = (grade?: string) => {
    if (!grade) return 'bg-gray-100 text-gray-800';
    if (grade.startsWith('A')) return 'bg-green-100 text-green-800';
    if (grade.startsWith('B')) return 'bg-blue-100 text-blue-800';
    if (grade.startsWith('C')) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Student Results</h3>
              <p className="text-gray-600 text-sm">
                {studentName ? `Showing results for ${studentName}` : 'No student selected'}
              </p>
            </div>
          </div>
        </div>
        <div className="text-center py-12">
          <div className="text-gray-400 text-5xl mb-4">📊</div>
          <p className="text-gray-500 text-lg mb-2">No results found</p>
          <p className="text-gray-400 text-sm">
            {admissionNo 
              ? "Use the search button to find student results"
              : "Enter admission number to search for results"
            }
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
            <h3 className="text-lg font-semibold text-gray-800">Student Results</h3>
            <p className="text-gray-600 text-sm">
              Showing results for {studentName}
            </p>
          </div>
          
          <div className="flex gap-3">
            {termLocked && (
              <span className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full">
                Term Locked
              </span>
            )}
            <button
              onClick={onPrintPreview}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              aria-label="Print results preview"
            >
              <span>🖨️</span>
              <span>Print Preview</span>
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subject
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subject Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Marks
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Grade
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Grade Scale
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
                  {result.subject_name || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {result.subject_code || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {result.marks}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${getGradeColor(result.grade_scale)}`}>
                    {result.grade_scale || 'N/A'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {result.grade_scale_name || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => onEditResult(result.id)}
                    className={`text-blue-600 hover:text-blue-900 ${termLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={termLocked}
                    aria-label={`Edit result for ${result.subject_name || 'subject'}`}
                    title={termLocked ? "Term is locked" : "Edit result"}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultsTable;