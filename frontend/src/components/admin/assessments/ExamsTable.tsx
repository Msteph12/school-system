import React, { useState } from 'react';
import { MoreVertical, Eye, Edit, CheckCircle, XCircle, FileText, Download, X, Loader2, AlertCircle } from 'lucide-react';
import type { Exam } from '@/types/assessment';

interface ExamsTableProps {
  exams: Exam[];
  onCloseExam: (id: string, startDate?: string) => Promise<void> | void;
  onEditExam: (exam: Exam) => void;
  onViewDetails?: (exam: Exam) => void;
  onActivateExam?: (exam: Exam) => Promise<void> | void;
  loading?: boolean;
  error?: string | null;
}

const ExamsTable: React.FC<ExamsTableProps> = ({ 
  exams, 
  onCloseExam, 
  onEditExam, 
  onViewDetails,
  onActivateExam,
  loading = false,
  error = null
}) => {
  const [openActionsId, setOpenActionsId] = useState<string | null>(null);
  const [viewingExam, setViewingExam] = useState<Exam | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    type: 'all',
    term: 'all',
    grade: 'all',
    status: 'all',
  });

  // Filter exams based on selected filters
  const filteredExams = exams.filter((exam) => {
    return (
      (filters.type === 'all' || exam.type === filters.type) &&
      (filters.term === 'all' || exam.term === filters.term) &&
      (filters.grade === 'all' || exam.grade === filters.grade) &&
      (filters.status === 'all' || exam.status === filters.status)
    );
  });

  // Get unique values for filter options
  const uniqueValues = {
    types: Array.from(new Set(exams.map(e => e.type))),
    terms: Array.from(new Set(exams.map(e => e.term))),
    grades: Array.from(new Set(exams.map(e => e.grade))),
    statuses: Array.from(new Set(exams.map(e => e.status))),
  };

  const getStatusColor = (status: Exam['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border border-green-200';
      case 'scheduled': return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getTypeColor = (type: Exam['type']) => {
    switch (type) {
      case 'mid-term': return 'bg-purple-100 text-purple-800 border border-purple-200';
      case 'final': return 'bg-red-100 text-red-800 border border-red-200';
      case 'quiz': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'assignment': return 'bg-indigo-100 text-indigo-800 border border-indigo-200';
      case 'test': return 'bg-cyan-100 text-cyan-800 border border-cyan-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const calculateDurationInDays = (startDate: string, endDate: string): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end days
  };

  const toggleActions = (id: string) => {
    setOpenActionsId(openActionsId === id ? null : id);
  };

  const handleActionClick = async (action: string, exam: Exam) => {
    setOpenActionsId(null);
    
    switch (action) {
      case 'edit': {
        onEditExam(exam);
        break;
      }
      case 'activate': {
        // Show confirmation
        const shouldActivate = window.confirm(
          'Activate this exam now? It will start today.'
        );
        
        if (shouldActivate && onActivateExam) {
          setActionLoading(`activate-${exam.id}`);
          try {
            await onActivateExam(exam);
          } finally {
            setActionLoading(null);
          }
        }
        break;
      }
      case 'close': {
        setActionLoading(`close-${exam.id}`);
        try {
          await onCloseExam(exam.id, exam.startDate);
        } finally {
          setActionLoading(null);
        }
        break;
      }
      case 'view': {
        if (onViewDetails) {
          onViewDetails(exam);
        } else {
          setViewingExam(exam);
        }
        break;
      }
      default: {
        break;
      }
    }
  };

  const handleDownload = (filename: string) => {
    alert(`Downloading ${filename}...`);
  };

  const closeViewModal = () => {
    setViewingExam(null);
  };

  return (
    <>
      <div className="overflow-x-auto">
        {/* Filter Section - ALWAYS SHOW */}
        <div className="flex flex-wrap items-center gap-3 p-4 bg-gray-50 border-b">
          <div className="text-sm font-medium text-gray-700">Filters:</div>
          
          <select
            value={filters.type}
            onChange={(e) => setFilters({...filters, type: e.target.value})}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-label="Filter by exam type"
            disabled={loading || !!error}
          >
            <option value="all">All Types</option>
            {uniqueValues.types.map(type => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
              </option>
            ))}
          </select>

          <select
            value={filters.term}
            onChange={(e) => setFilters({...filters, term: e.target.value})}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-label="Filter by term"
            disabled={loading || !!error}
          >
            <option value="all">All Terms</option>
            {uniqueValues.terms.map(term => (
              <option key={term} value={term}>{term}</option>
            ))}
          </select>

          <select
            value={filters.grade}
            onChange={(e) => setFilters({...filters, grade: e.target.value})}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-label="Filter by grade"
            disabled={loading || !!error}
          >
            <option value="all">All Grades</option>
            {uniqueValues.grades.map(grade => (
              <option key={grade} value={grade}>{grade}</option>
            ))}
          </select>

          <select
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-label="Filter by status"
            disabled={loading || !!error}
          >
            <option value="all">All Status</option>
            {uniqueValues.statuses.map(status => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>

          <button
            onClick={() => setFilters({ type: 'all', term: 'all', grade: 'all', status: 'all' })}
            className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={loading || !!error}
          >
            Reset Filters
          </button>

          <div className="ml-auto text-sm text-gray-600">
            {error ? 'Error loading data' : `Showing ${filteredExams.length} of ${exams.length} exams`}
          </div>
        </div>

        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-gray-700">Name</th>
              <th className="text-left p-4 text-sm font-medium text-gray-700">Type</th>
              <th className="text-left p-4 text-sm font-medium text-gray-700">Term</th>
              <th className="text-left p-4 text-sm font-medium text-gray-700">Grade</th>
              <th className="text-left p-4 text-sm font-medium text-gray-700">Date</th>
              <th className="text-left p-4 text-sm font-medium text-gray-700">Status</th>
              <th className="text-left p-4 text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {error ? (
              <tr>
                <td colSpan={7} className="p-8 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <AlertCircle size={48} className="text-red-500 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to Load Data</h3>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                      onClick={() => window.location.reload()}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Retry
                    </button>
                  </div>
                </td>
              </tr>
            ) : loading && filteredExams.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <Loader2 size={48} className="animate-spin text-blue-600 mb-4" />
                    <p className="text-gray-600">Loading exams...</p>
                  </div>
                </td>
              </tr>
            ) : filteredExams.length > 0 ? (
              filteredExams.map((exam) => (
                <tr key={exam.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {exam.attachment && <FileText size={16} className="text-gray-400" />}
                      <div>
                        <div className="font-medium text-gray-900">{exam.name}</div>
                        {exam.attachment && (
                          <div className="text-xs text-gray-500 mt-1">File attached</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(exam.type)}`}>
                      {exam.type.charAt(0).toUpperCase() + exam.type.slice(1).replace('-', ' ')}
                    </span>
                  </td>
                  <td className="p-4 text-gray-700">{exam.term}</td>
                  <td className="p-4 text-gray-700">{exam.grade}</td>
                  <td className="p-4 text-gray-700">
                    {formatDate(exam.startDate)} - {formatDate(exam.endDate)}
                    <div className="text-xs text-gray-500 mt-1">
                      Duration: {calculateDurationInDays(exam.startDate, exam.endDate)} days
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(exam.status)}`}>
                      {exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
                    </span>
                  </td>
                  <td className="p-4 relative">
                    <div className="relative">
                      <button
                        onClick={() => toggleActions(exam.id)}
                        disabled={actionLoading?.includes(exam.id) || loading}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                        aria-label="More options"
                        title="More options"
                      >
                        {actionLoading?.includes(exam.id) ? (
                          <Loader2 size={18} className="text-gray-500 animate-spin" />
                        ) : (
                          <MoreVertical size={18} className="text-gray-500" />
                        )}
                      </button>
                      
                      {openActionsId === exam.id && (
                        <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border z-20 animate-fadeIn">
                          <button
                            onClick={() => handleActionClick('view', exam)}
                            className="w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                          >
                            <Eye size={16} className="text-gray-600" />
                            <span>View Details</span>
                          </button>
                          
                          {exam.status === 'scheduled' && (
                            <>
                              <button
                                onClick={() => handleActionClick('edit', exam)}
                                className="w-full text-left px-4 py-2.5 hover:bg-blue-50 flex items-center gap-3 transition-colors"
                              >
                                <Edit size={16} className="text-blue-600" />
                                <span>Edit Exam</span>
                              </button>
                              <div className="border-t">
                                <button
                                  onClick={() => handleActionClick('activate', exam)}
                                  className="w-full text-left px-4 py-2.5 hover:bg-green-50 flex items-center gap-3 transition-colors"
                                >
                                  <CheckCircle size={16} className="text-green-600" />
                                  <span>Activate (Start Today)</span>
                                </button>
                              </div>
                            </>
                          )}
                          
                          {exam.status === 'active' && (
                            <>
                              <button
                                onClick={() => handleActionClick('edit', exam)}
                                className="w-full text-left px-4 py-2.5 hover:bg-blue-50 flex items-center gap-3 transition-colors"
                              >
                                <Edit size={16} className="text-blue-600" />
                                <span>Edit Exam</span>
                              </button>
                              <div className="border-t">
                                <button
                                  onClick={() => handleActionClick('close', exam)}
                                  className="w-full text-left px-4 py-2.5 hover:bg-red-50 flex items-center gap-3 transition-colors"
                                >
                                  <XCircle size={16} className="text-red-600" />
                                  <span>Close Exam</span>
                                </button>
                              </div>
                            </>
                          )}
                          
                          {exam.status === 'completed' && (
                            <div className="text-xs text-gray-500 px-4 py-2.5">
                              No additional actions available
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    {openActionsId === exam.id && (
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setOpenActionsId(null)}
                      />
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="p-8 text-center">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Exams Found</h3>
                  <p className="text-gray-600 mb-4">
                    {exams.length === 0 
                      ? 'No exams have been created yet. Click "Create New Exam" to add one.' 
                      : 'No exams match the selected filters. Try changing your filter criteria.'}
                  </p>
                  <button
                    onClick={() => setFilters({ type: 'all', term: 'all', grade: 'all', status: 'all' })}
                    className="text-blue-600 hover:underline"
                  >
                    Reset all filters →
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {viewingExam && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="bg-blue-600 p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Eye size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Exam Details</h3>
                    <p className="text-blue-100 text-sm">View exam information</p>
                  </div>
                </div>
                <button 
                  onClick={closeViewModal} 
                  className="p-1.5 hover:bg-blue-700 rounded-lg transition-colors"
                  aria-label="Close modal"
                >
                  <X size={18} className="text-white" />
                </button>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Exam Name</label>
                  <div className="px-3 py-2 bg-gray-50 rounded-lg">{viewingExam.name}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <div className="px-3 py-2 bg-gray-50 rounded-lg">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(viewingExam.type)}`}>
                      {viewingExam.type.charAt(0).toUpperCase() + viewingExam.type.slice(1).replace('-', ' ')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Term</label>
                  <div className="px-3 py-2 bg-gray-50 rounded-lg">{viewingExam.term}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
                  <div className="px-3 py-2 bg-gray-50 rounded-lg">{viewingExam.grade}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <div className="px-3 py-2 bg-gray-50 rounded-lg">{formatDate(viewingExam.startDate)}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <div className="px-3 py-2 bg-gray-50 rounded-lg">{formatDate(viewingExam.endDate)}</div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                <div className="px-3 py-2 bg-gray-50 rounded-lg">
                  {calculateDurationInDays(viewingExam.startDate, viewingExam.endDate)} days
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <div className="px-3 py-2 bg-gray-50 rounded-lg">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(viewingExam.status)}`}>
                    {viewingExam.status.charAt(0).toUpperCase() + viewingExam.status.slice(1)}
                  </span>
                </div>
              </div>

              {viewingExam.attachment && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Attached File</label>
                  <div className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileText size={16} className="text-gray-500" />
                      <span className="text-sm">{viewingExam.attachment}</span>
                    </div>
                    <button
                      onClick={() => handleDownload(viewingExam.attachment!)}
                      className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Download size={14} />
                      Download
                    </button>
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-4 border-t">
                <button
                  onClick={closeViewModal}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ExamsTable;