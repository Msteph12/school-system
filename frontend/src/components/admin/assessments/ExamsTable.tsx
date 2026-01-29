// ExamsTable.tsx – FULLY CORRECTED (backend status as source of truth)

import React, { useState } from 'react';
import { MoreVertical, Eye, Edit, X, Loader2, AlertCircle } from 'lucide-react';
import type { Exam } from '@/types/assessment';

interface ExamsTableProps {
  exams: Exam[];
  onEditExam: (exam: Exam) => void;
  onViewDetails?: (exam: Exam) => void;
  onCloseExam: (id: string, startDate?: string) => Promise<void> | void;
  onActivateExam?: (exam: Exam) => Promise<void> | void;
  loading?: boolean;
  error?: string | null;
}

const ExamsTable: React.FC<ExamsTableProps> = ({
  exams,
  onEditExam,
  onViewDetails,
  onCloseExam,
  onActivateExam,
  loading = false,
  error = null,
}) => {
  const [openActionsId, setOpenActionsId] = useState<string | null>(null);
  const [viewingExam, setViewingExam] = useState<Exam | null>(null);
  const [filters, setFilters] = useState({
    grade: 'all',
    class: 'all',
    subject: 'all',
    examType: 'all',
  });

  const extractGradeFromClassName = (exam: Exam): string => {
    if (!exam.class?.name) return 'N/A';
    const match = exam.class.name.match(/\d+/);
    return match ? `Grade ${match[0]}` : exam.class.name;
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'completed':
        return 'bg-gray-100 text-gray-800 border border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const filteredExams = exams.filter((exam) => {
    const grade = extractGradeFromClassName(exam);
    return (
      (filters.grade === 'all' || grade === filters.grade) &&
      (filters.class === 'all' || exam.class?.name === filters.class) &&
      (filters.subject === 'all' || exam.subject?.name === filters.subject) &&
      (filters.examType === 'all' || exam.examType?.name === filters.examType)
    );
  });

  const uniqueValues = {
    grades: Array.from(new Set(exams.map(extractGradeFromClassName))).filter(
      (g) => g !== 'N/A'
    ),
    classes: Array.from(new Set(exams.map((e) => e.class?.name).filter(Boolean))),
    subjects: Array.from(
      new Set(exams.map((e) => e.subject?.name).filter(Boolean))
    ),
    examTypes: Array.from(
      new Set(exams.map((e) => e.examType?.name).filter(Boolean))
    ),
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  const toggleActions = (id: string) =>
    setOpenActionsId(openActionsId === id ? null : id);

  const closeViewModal = () => setViewingExam(null);

  return (
    <>
      <div className="overflow-x-auto">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 p-4 bg-gray-50 border-b">
          <div className="text-sm font-medium text-gray-700">Filters:</div>

          <select
            value={filters.grade}
            onChange={(e) => setFilters({ ...filters, grade: e.target.value })}
            className="px-3 py-2 border rounded-lg text-sm"
            disabled={loading || !!error}
          >
            <option value="all">All Grades</option>
            {uniqueValues.grades.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>

          <select
            value={filters.class}
            onChange={(e) => setFilters({ ...filters, class: e.target.value })}
            className="px-3 py-2 border rounded-lg text-sm"
            disabled={loading || !!error}
          >
            <option value="all">All Classes</option>
            {uniqueValues.classes.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={filters.subject}
            onChange={(e) =>
              setFilters({ ...filters, subject: e.target.value })
            }
            className="px-3 py-2 border rounded-lg text-sm"
            disabled={loading || !!error}
          >
            <option value="all">All Subjects</option>
            {uniqueValues.subjects.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            value={filters.examType}
            onChange={(e) =>
              setFilters({ ...filters, examType: e.target.value })
            }
            className="px-3 py-2 border rounded-lg text-sm"
            disabled={loading || !!error}
          >
            <option value="all">All Exam Types</option>
            {uniqueValues.examTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <div className="ml-auto text-sm text-gray-600">
            {error
              ? 'Error loading data'
              : `Showing ${filteredExams.length} of ${exams.length} exams`}
          </div>
        </div>

        {/* Table */}
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Grade</th>
              <th className="p-4 text-left">Class</th>
              <th className="p-4 text-left">Subject</th>
              <th className="p-4 text-left">Type</th>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {error ? (
              <tr>
                <td colSpan={8} className="p-8 text-center">
                  <AlertCircle size={40} className="mx-auto text-red-500 mb-2" />
                  {error}
                </td>
              </tr>
            ) : loading ? (
              <tr>
                <td colSpan={8} className="p-8 text-center">
                  <Loader2 className="animate-spin mx-auto text-blue-600" />
                </td>
              </tr>
            ) : (
              filteredExams.map((exam) => (
                <tr key={exam.id} className="hover:bg-gray-50">
                  <td className="p-4 font-medium">{exam.name}</td>
                  <td className="p-4">{extractGradeFromClassName(exam)}</td>
                  <td className="p-4">{exam.class?.name || 'N/A'}</td>
                  <td className="p-4">{exam.subject?.name || 'N/A'}</td>
                  <td className="p-4">{exam.examType?.name || 'N/A'}</td>
                  <td className="p-4">{formatDate(exam.exam_date)}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        exam.status
                      )}`}
                    >
                      {exam.status}
                    </span>
                  </td>
                  <td className="p-4 relative">
                    <button
                      onClick={() => toggleActions(String(exam.id))}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <MoreVertical size={18} />
                    </button>

                    {openActionsId === String(exam.id) && (
                      <>
                        <div className="absolute right-0 mt-1 w-48 bg-white border rounded-lg shadow z-20">
                          <button
                            onClick={() =>
                              onViewDetails
                                ? onViewDetails(exam)
                                : setViewingExam(exam)
                            }
                            className="w-full px-4 py-2 text-left hover:bg-gray-50 flex gap-2"
                          >
                            <Eye size={16} /> View
                          </button>

                          <button
                            onClick={() => onEditExam(exam)}
                            className="w-full px-4 py-2 text-left hover:bg-blue-50 flex gap-2"
                          >
                            <Edit size={16} /> Edit
                          </button>

                          {exam.status === 'active' && (
                            <button
                              onClick={() =>
                                onCloseExam(
                                  exam.id.toString(),
                                  exam.exam_date
                                )
                              }
                              className="w-full px-4 py-2 text-left hover:bg-red-50"
                            >
                              Close Exam
                            </button>
                          )}

                          {exam.status === 'scheduled' && onActivateExam && (
                            <button
                              onClick={() => onActivateExam(exam)}
                              className="w-full px-4 py-2 text-left hover:bg-green-50"
                            >
                              Activate
                            </button>
                          )}
                        </div>

                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setOpenActionsId(null)}
                        />
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* View Modal */}
      {viewingExam && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-lg">
            <div className="bg-blue-600 p-5 flex justify-between items-center">
              <h3 className="text-white font-semibold">Exam Details</h3>
              <button onClick={closeViewModal}>
                <X className="text-white" />
              </button>
            </div>

            <div className="p-5 space-y-3">
              <div>Name: {viewingExam.name}</div>
              <div>Marks: {viewingExam.total_marks}</div>
              <div>Status: {viewingExam.status}</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ExamsTable;
