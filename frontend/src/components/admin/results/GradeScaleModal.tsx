import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import type { GradeScale } from '@/types/grade';

interface GradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string; status: 'active' | 'inactive' }) => void;
  initialData?: GradeScale | null;
}

const GradeModal: React.FC<GradeModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');

  // Reset form when modal opens or initialData changes
  useEffect(() => {
    if (initialData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(initialData.name);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus(initialData.status);
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName('');
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus('active');
    }
  }, [initialData, isOpen]); // Added isOpen dependency to reset when modal opens

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter a grade name');
      return;
    }
    onSave({ name: name.trim(), status });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {initialData ? 'Edit Grade' : 'Add New Grade'}
            </h3>
            <p className="text-sm text-gray-500">
              {initialData ? 'Update grade details' : 'Define a new grade scale'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close modal"
            title="Close"
          >
            <FaTimes className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Grade Scale Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Excellent, Average, Good"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                autoFocus
              />
              <p className="mt-1 text-sm text-gray-500">
                Descriptive name for the grade
              </p>
            </div>

            {/* Status Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="active"
                    checked={status === 'active'}
                    onChange={() => setStatus('active')}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Active</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="inactive"
                    checked={status === 'inactive'}
                    onChange={() => setStatus('inactive')}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Inactive</span>
                </label>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                {status === 'active' 
                  ? 'Grade will be available for use' 
                  : 'Grade will be hidden from selection'
                }
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              aria-label="Cancel and close modal"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              aria-label={initialData ? 'Update grade' : 'Add new grade'}
            >
              {initialData ? 'Update Grade' : 'Add Grade'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GradeModal;