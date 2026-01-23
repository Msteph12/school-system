import React from 'react';
import { FaLock, FaUnlock, FaExclamationTriangle } from 'react-icons/fa';
import type { Term } from '@/types/term';

interface StatusCardProps {
  term: Term | null;
  onLockToggle: () => void;
  isProcessing: boolean;
}

const StatusCard: React.FC<StatusCardProps> = ({
  term,
  onLockToggle,
  isProcessing,
}) => {
  if (!term) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Term Status</h3>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${term.isLocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {term.isLocked ? 'LOCKED' : 'OPEN'}
        </div>
      </div>

      <div className="mb-6">
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg mb-4 ${
          term.isLocked ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
        }`}>
          {term.isLocked ? (
            <FaLock className="w-5 h-5" />
          ) : (
            <FaUnlock className="w-5 h-5" />
          )}
          <span className="font-medium">
            {term.isLocked ? 'Results are read-only' : 'Results can be entered and edited'}
          </span>
        </div>

        <p className="text-gray-600 text-sm">
          {term.isLocked 
            ? 'Teachers can view and print results but cannot make changes.'
            : 'Teachers can enter new results and edit existing entries.'
          }
        </p>
      </div>

      <button
        onClick={onLockToggle}
        disabled={isProcessing}
        className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-colors ${
          term.isLocked
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-red-600 hover:bg-red-700 text-white'
        } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isProcessing ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Processing...
          </>
        ) : (
          <>
            {term.isLocked ? (
              <>
                <FaUnlock className="w-5 h-5" />
                Unlock Term
              </>
            ) : (
              <>
                <FaLock className="w-5 h-5" />
                Lock Term
              </>
            )}
          </>
        )}
      </button>

      {term.order > 1 && !term.isLocked && !term.disabled && (
        <div className="mt-4 flex items-start gap-2 text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
          <FaExclamationTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <p>
            This will affect all results for {term.name}. 
            Ensure all data is verified before locking.
          </p>
        </div>
      )}
    </div>
  );
};

export default StatusCard;