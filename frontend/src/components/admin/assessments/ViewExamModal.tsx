import React from 'react';
import { Eye, X, FileText, Download } from 'lucide-react';
import type { Exam } from '@/types/assessment';

interface ViewExamModalProps {
  exam: Exam;
  onClose: () => void;
  onDownload?: (filename: string) => void;
}

const ViewExamModal: React.FC<ViewExamModalProps> = ({ exam, onClose, onDownload }) => {
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
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border border-green-200';
      case 'scheduled': return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'mid-term': return 'bg-purple-100 text-purple-800 border border-purple-200';
      case 'final': return 'bg-red-100 text-red-800 border border-red-200';
      case 'quiz': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'assignment': return 'bg-indigo-100 text-indigo-800 border border-indigo-200';
      case 'test': return 'bg-cyan-100 text-cyan-800 border border-cyan-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const handleDownload = (filename: string) => {
    if (onDownload) {
      onDownload(filename);
    } else {
      alert(`Downloading ${filename}...`);
    }
  };

  return (
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
              onClick={onClose} 
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
              <div className="px-3 py-2 bg-gray-50 rounded-lg">{exam.name}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <div className="px-3 py-2 bg-gray-50 rounded-lg">
                <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(exam.type)}`}>
                  {exam.type.charAt(0).toUpperCase() + exam.type.slice(1).replace('-', ' ')}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Term</label>
              <div className="px-3 py-2 bg-gray-50 rounded-lg">{exam.term}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
              <div className="px-3 py-2 bg-gray-50 rounded-lg">{exam.grade}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <div className="px-3 py-2 bg-gray-50 rounded-lg">{formatDate(exam.startDate)}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <div className="px-3 py-2 bg-gray-50 rounded-lg">{formatDate(exam.endDate)}</div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
            <div className="px-3 py-2 bg-gray-50 rounded-lg">
              {calculateDurationInDays(exam.startDate, exam.endDate)} days
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <div className="px-3 py-2 bg-gray-50 rounded-lg">
              <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(exam.status)}`}>
                {exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
              </span>
            </div>
          </div>

          {exam.attachment && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Attached File</label>
              <div className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-gray-500" />
                  <span className="text-sm">{exam.attachment}</span>
                </div>
                <button
                  onClick={() => handleDownload(exam.attachment!)}
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
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewExamModal;