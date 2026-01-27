import React from 'react';
import { Plus, Loader2 } from 'lucide-react';
import ExamsTable from './ExamsTable';
import type { Exam } from '@/types/assessment';

interface ExamManagementProps {
  exams: Exam[];
  onCreateExam: () => void;
  onCloseExam: (id: string, startDate?: string) => Promise<void> | void;
  onEditExam: (exam: Exam) => void;
  onViewDetails?: (exam: Exam) => void;
  onActivateExam?: (exam: Exam) => Promise<void> | void;
  loading?: boolean;
  error?: string | null;
}

const ExamManagement: React.FC<ExamManagementProps> = ({
  exams,
  onCreateExam,
  onCloseExam,
  onEditExam,
  onViewDetails,
  onActivateExam,
  loading = false,
  error = null,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-800">
          All Exams ({exams.length})
        </h2>
        <button
          onClick={onCreateExam}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
          Create New Exam
        </button>
      </div>

      <ExamsTable 
        exams={exams}
        onCloseExam={onCloseExam}
        onEditExam={onEditExam}
        onViewDetails={onViewDetails}
        onActivateExam={onActivateExam}
        loading={loading}
        error={error}
      />
    </div>
  );
};

export default ExamManagement;