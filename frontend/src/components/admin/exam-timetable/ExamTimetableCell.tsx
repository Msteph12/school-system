"use client";

import type { HTMLAttributes } from "react";

interface Props {
  subjectName: string;
  paperLabel?: string;
  isEditMode?: boolean;
  onEdit?: () => void;
  isDragging?: boolean;
  dragHandleProps?: HTMLAttributes<HTMLDivElement>;
}

const ExamTimetableCell = ({ 
  subjectName, 
  paperLabel,
  isEditMode = false,
  onEdit,
  isDragging = false,
  dragHandleProps
}: Props) => {
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (isEditMode && onEdit) {
      onEdit();
    }
  };

  return (
    <div 
      className={`w-full h-full ${paperLabel && paperLabel.trim() !== '' ? 'flex flex-col justify-center' : 'flex items-center justify-center'} text-center p-2 relative
        ${isEditMode ? 'cursor-pointer hover:bg-blue-50 active:bg-blue-100 pointer-events-auto' : ''}
        ${isDragging ? 'opacity-50' : ''}
      `}
      onDoubleClick={handleDoubleClick}
    >
      {/* Drag handle for edit mode */}
      {isEditMode && dragHandleProps && (
        <div 
          className="absolute top-1 right-1 cursor-grab active:cursor-grabbing z-10 pointer-events-auto"
          {...dragHandleProps}
        >
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
          </svg>
        </div>
      )}

      {/* Subject Name */}
      <div className={`font-bold text-gray-800 ${paperLabel ? '' : ''}`}>
        {subjectName || (isEditMode ? 'Empty' : '')}
      </div>

      {/* Paper/Slot Label */}
      {paperLabel && (
        <div className="mt-1 text-sm text-blue-600 font-medium">
          {paperLabel}
        </div>
      )}

      {/* Edit hint */}
      {isEditMode && !subjectName && (
        <div className="text-xs text-gray-400 italic mt-1">
          Double-click to edit
        </div>
      )}
    </div>
  );
};

export default ExamTimetableCell;