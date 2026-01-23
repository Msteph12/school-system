import React from 'react';
import type { Subject, ExamType } from '@/types/result';

interface EnterResultsActionsProps {
  allCriteriaSelected: boolean;
  selectedSubject: string;
  selectedExamType: string;
  subjects: Subject[];
  examTypes: ExamType[];
  onAddResult: () => void;
}

const EnterResultsActions: React.FC<EnterResultsActionsProps> = ({
  allCriteriaSelected,
  selectedSubject,
  selectedExamType,
  subjects,
  examTypes,
  onAddResult,
}) => {
  const subjectName = subjects.find(s => s.id === selectedSubject)?.name || '';
  const examTypeName = examTypes.find(e => e.id === selectedExamType)?.name || '';

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Results Entry</h3>
          <p className="text-gray-600 text-sm">
            {allCriteriaSelected
              ? `Entering results for ${subjectName} - ${examTypeName}`
              : "Select all criteria to enter results"
            }
          </p>
        </div>
        <button
          onClick={onAddResult}
          disabled={!allCriteriaSelected}
          className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="text-xl">+</span>
          <span>Add Result</span>
        </button>
      </div>
    </div>
  );
};

export default EnterResultsActions;