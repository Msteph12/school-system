import React from 'react';
import { FaPlus } from 'react-icons/fa';

interface AddGradeButtonProps {
  onClick: () => void;
}

const AddGradeButton: React.FC<AddGradeButtonProps> = ({ onClick }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Grade Scale</h2>
          <p className="text-sm text-gray-500">Add and manage grade definitions</p>
        </div>
        <button
          onClick={onClick}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaPlus className="w-4 h-4" />
          Add Grade
        </button>
      </div>
    </div>
  );
};

export default AddGradeButton;