import React from 'react';
import { FaExclamationTriangle, FaTimes } from 'react-icons/fa';
import type { Term } from '@/types/term';

interface LockConfirmationModalProps {
  isOpen: boolean;
  term: Term | null;
  onConfirm: () => void;
  onCancel: () => void;
}

const LockConfirmationModal: React.FC<LockConfirmationModalProps> = ({
  isOpen,
  term,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen || !term) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <FaExclamationTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Confirm Term Lock</h3>
              <p className="text-sm text-gray-500">Are you sure you want to lock {term.name}?</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close modal" 
            title="Close" 
          >
            <FaTimes className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <h4 className="font-medium text-red-800 mb-2">Warning: This action is irreversible</h4>
            <ul className="text-sm text-red-700 space-y-1">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5"></div>
                <span>All results for {term.name} will become read-only</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5"></div>
                <span>Teachers cannot edit or enter new results</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5"></div>
                <span>Only administrators can unlock this term</span>
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">Allowed after locking:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5"></div>
                <span>Viewing and printing results</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5"></div>
                <span>Generating reports and transcripts</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onCancel}
            className="flex-1 py-3 px-4 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            aria-label="Cancel term lock"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 px-4 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
            aria-label={`Lock ${term.name}`}
          >
            <FaExclamationTriangle className="w-5 h-5" />
            Lock {term.name}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LockConfirmationModal;