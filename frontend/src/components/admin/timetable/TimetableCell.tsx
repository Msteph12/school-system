"use client";

import type { HTMLAttributes } from "react";

interface Props {
  subject: string;
  teacher?: string | null;
  room?: string | null;
  isEditMode?: boolean;
  onEdit?: () => void;
  isDragging?: boolean;
  dragHandleProps?: HTMLAttributes<HTMLDivElement>;
}

const TimetableCell = ({ 
  subject, 
  teacher, 
  room, 
  isEditMode = false,
  onEdit,
  isDragging = false,
  dragHandleProps
}: Props) => {
  const hasMeta = teacher || room;

  const handleDoubleClick = () => {
    if (isEditMode && onEdit) {
      onEdit();
    }
  };

  return (
    <div 
      className={`w-full h-full flex flex-col justify-center items-center text-center p-2 relative
        ${isEditMode ? 'cursor-pointer hover:bg-blue-50' : ''}
        ${isDragging ? 'opacity-50' : ''}
      `}
      onDoubleClick={handleDoubleClick}
    >
      {/* Drag handle for edit mode */}
      {isEditMode && dragHandleProps && (
        <div 
          className="absolute top-1 right-1 cursor-grab active:cursor-grabbing z-10"
          {...dragHandleProps}
        >
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
          </svg>
        </div>
      )}

      {/* Subject */}
      <div className="font-bold uppercase text-gray-800">
        {subject || (isEditMode ? 'Empty' : '')}
      </div>

      {/* Teacher & Room (optional) */}
      {hasMeta && (
        <div className="mt-1 text-xs text-gray-500 space-y-0.5">
          {teacher && <div>{teacher}</div>}
          {room && <div>Room {room}</div>}
        </div>
      )}

      {/* Edit hint */}
      {isEditMode && !subject && (
        <div className="text-xs text-gray-400 italic mt-1">
          Double-click to edit
        </div>
      )}
    </div>
  );
};

export default TimetableCell;