import React from 'react';
import { FaCalendarAlt, FaUser, FaLock, FaUnlock, FaClock, FaHashtag } from 'react-icons/fa';
import type { Term } from '@/types/term';

interface InfoCardProps {
  term: Term | null;
}

const InfoCard: React.FC<InfoCardProps> = ({ term }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!term) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <FaCalendarAlt className="w-6 h-6 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">Term Information</h3>
      </div>

      <div className="space-y-4">
        {/* Lock Status */}
        <div className="flex items-start gap-3">
          {term.isLocked ? (
            <FaLock className="w-5 h-5 text-gray-400 mt-0.5" />
          ) : (
            <FaUnlock className="w-5 h-5 text-gray-400 mt-0.5" />
          )}
          <div>
            <p className="text-sm text-gray-500 mb-1">Current Status</p>
            <p className={`font-medium ${term.isLocked ? 'text-red-600' : 'text-green-600'}`}>
              {term.isLocked ? 'Locked' : 'Open for Editing'}
            </p>
          </div>
        </div>

        {/* Locked Date */}
        <div className="flex items-start gap-3">
          <FaClock className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm text-gray-500 mb-1">Locked Date</p>
            <p className="font-medium text-gray-800">
              {term.lockedDate ? formatDate(term.lockedDate) : 'Not locked yet'}
            </p>
          </div>
        </div>

        {/* Locked By */}
        <div className="flex items-start gap-3">
          <FaUser className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm text-gray-500 mb-1">Locked By</p>
            <p className="font-medium text-gray-800">
              {term.lockedBy || 'N/A'}
            </p>
          </div>
        </div>

        {/* Term Order */}
        <div className="flex items-start gap-3">
          <FaHashtag className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm text-gray-500 mb-1">Term Sequence</p>
            <p className="font-medium text-gray-800">
              Term {term.order}
            </p>
          </div>
        </div>
      </div>

      {!term.isLocked && (
        <div className="mt-6 pt-6 border-t border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <p>This term is currently open for result entry</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InfoCard;
