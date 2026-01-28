import React, { useState } from 'react';
import {
  FaChevronDown,
  FaLock,
  FaCircle
} from 'react-icons/fa';
import type { Term } from '@/types/term';

interface TermDropdownProps {
  terms: Term[];
  selectedTerm: Term;
  onSelectTerm: (term: Term) => void;
}

const TermDropdown: React.FC<TermDropdownProps> = ({
  terms,
  selectedTerm,
  onSelectTerm,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const sortedTerms = [...terms].sort((a, b) => a.order - b.order);

  return (
    <div className="relative w-full md:w-64">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-white border border-gray-300 rounded-lg px-4 py-3 text-left hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <div className="flex items-center gap-3">
          {selectedTerm.isLocked ? (
            <FaLock className="w-4 h-4 text-red-500" />
          ) : (
            <FaCircle className="w-2 h-2 text-green-500" />
          )}
          <span className="font-medium">{selectedTerm.name}</span>
        </div>
        <FaChevronDown
          className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
            {sortedTerms.map((term) => (
              <button
                key={term.id}
                onClick={() => {
                  onSelectTerm(term);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                  selectedTerm.id === term.id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  {term.isLocked ? (
                    <FaLock className="w-4 h-4 text-red-500" />
                  ) : (
                    <FaCircle className="w-2 h-2 text-green-500" />
                  )}
                  <span className="font-medium text-gray-800">
                    {term.name}
                  </span>
                </div>

                {selectedTerm.id === term.id && (
                  <FaCircle className="w-2 h-2 text-blue-500" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TermDropdown;
