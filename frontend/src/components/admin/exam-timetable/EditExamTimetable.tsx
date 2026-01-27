"use client";

import { useState, useEffect, useCallback } from 'react';
import { DndContext, type DragEndEvent, DragOverlay, type DragStartEvent, closestCorners } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ExamTimetableCell from './ExamTimetableCell';
import type { ExamTimetableEntry } from '@/types/examTimetable';

interface EditableExamTimetableProps {
  initialData: ExamTimetableEntry[];
  days: string[];
  timeSlots: string[];
  isEditMode: boolean;
  onDataChange: (data: ExamTimetableEntry[]) => void;
}

const SortableExamCell = ({ 
  cell, 
  isEditMode,
  onDoubleClick
}: { 
  cell: ExamTimetableEntry;
  isEditMode: boolean;
  onDoubleClick: (cell: ExamTimetableEntry) => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: cell.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleDoubleClick = () => {
    if (isEditMode) {
      onDoubleClick(cell);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`h-full ${isDragging ? 'opacity-50' : ''}`}
      onDoubleClick={handleDoubleClick}
    >
      <ExamTimetableCell
        subjectName={cell.subjectName}
        paperLabel={cell.paperLabel}
        isEditMode={isEditMode}
        onEdit={() => onDoubleClick(cell)}
        isDragging={isDragging}
        dragHandleProps={isEditMode ? { ...attributes, ...listeners } : undefined}
      />
    </div>
  );
};

const SortableEmptyCell = ({
  id,
  onDoubleClick
}: { 
  id: string;
  onDoubleClick: () => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onDoubleClick();
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`h-full min-h-[80px] border border-dashed border-gray-300 rounded bg-gray-50 relative ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div 
        className="absolute top-1 right-1 cursor-grab active:cursor-grabbing z-10 pointer-events-auto"
        {...attributes}
        {...listeners}
      >
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
        </svg>
      </div>

      <div 
        className="w-full h-full flex items-center justify-center cursor-pointer hover:bg-gray-100 pointer-events-auto p-4"
        onDoubleClick={handleDoubleClick}
      >
        <div className="text-center">
          <span className="text-gray-400 text-sm block">
            Drop here or
          </span>
          <span className="text-gray-400 text-sm block">
            double-click to add
          </span>
        </div>
      </div>
    </div>
  );
};

const EditableExamTimetable = ({
  initialData,
  days,
  timeSlots,
  isEditMode,
  onDataChange,
}: EditableExamTimetableProps) => {
  const [cells, setCells] = useState<ExamTimetableEntry[]>(initialData);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [editingCell, setEditingCell] = useState<ExamTimetableEntry | null>(null);

  useEffect(() => {
    setCells(initialData);
  }, [initialData]);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    if (!isEditMode) return;
    setActiveId(event.active.id as string);
  }, [isEditMode]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    if (!isEditMode) return;
    
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      setCells((items) => {
        const activeCell = items.find((item) => item.id === active.id);
        if (!activeCell) return items;

        if (over.id.toString().startsWith('empty-')) {
          const [, day, timeSlotIdStr] = over.id.toString().split('-');
          const timeSlotId = parseInt(timeSlotIdStr);
          
          const updatedCell = {
            ...activeCell,
            day,
            timeSlotId,
          };

          const newCells = items.filter(item => item.id !== active.id);
          newCells.push(updatedCell);
          
          onDataChange(newCells);
          return newCells;
        } else {
          const targetCell = items.find((item) => item.id === over.id);
          if (targetCell) {
            const updatedItems = items.map(item => {
              if (item.id === active.id) {
                return { ...item, day: targetCell.day, timeSlotId: targetCell.timeSlotId };
              }
              if (item.id === over.id) {
                return { ...item, day: activeCell.day, timeSlotId: activeCell.timeSlotId };
              }
              return item;
            });
            onDataChange(updatedItems);
            return updatedItems;
          }
          return items;
        }
      });
    }
  }, [isEditMode, onDataChange]);

  const handleDoubleClickCell = useCallback((cell: ExamTimetableEntry) => {
    console.log('Double-click triggered for:', cell.day, cell.timeSlotId);
    if (!isEditMode) return;
    setEditingCell(cell);
  }, [isEditMode]);

  const handleDoubleClickEmptyCell = useCallback((day: string, timeSlotId: number) => {
    if (!isEditMode) return;
    
    const newCell: ExamTimetableEntry = {
      id: `new-${Date.now()}`,
      examId: 0,
      subjectId: 0,
      subjectName: '',
      paperLabel: '',
      date: '',
      day,
      timeSlotId,
      startTime: timeSlots[timeSlotId - 1]?.split(' - ')[0] || '',
      endTime: timeSlots[timeSlotId - 1]?.split(' - ')[1] || '',
      duration: 120,
      gradeId: 0,
      gradeName: '',
      examTypeId: 0,
      venue: '',
      invigilator: '',
    };
    
    setEditingCell(newCell);
  }, [isEditMode, timeSlots]);

  const handleSaveEdit = useCallback((updatedCell: ExamTimetableEntry) => {
  if (!editingCell) return; // Add null check
  
  const newCells = editingCell.id.startsWith('new-') 
    ? [...cells, { ...updatedCell, id: `cell-${Date.now()}` }]
    : cells.map(c => c.id === updatedCell.id ? updatedCell : c);
  
    setCells(newCells);
    onDataChange(newCells);
    setEditingCell(null);
    }, [cells, editingCell, onDataChange]);

    const handleDeleteCell = useCallback(() => {
    if (!editingCell) return;
    
    const newCells = cells.filter(c => c.id !== editingCell.id);
    setCells(newCells);
    onDataChange(newCells);
    setEditingCell(null);
    }, [cells, editingCell, onDataChange]);

  const activeCell = activeId ? cells.find(cell => cell.id === activeId) : null;

  const getCellAtPosition = useCallback((day: string, timeSlotId: number) => {
    return cells.find(cell => cell.day === day && cell.timeSlotId === timeSlotId);
  }, [cells]);

  const generateEmptyCellId = useCallback((day: string, timeSlotId: number) => {
    return `empty-${day}-${timeSlotId}`;
  }, []);

  const renderTableRows = useCallback((isEdit: boolean) => {
    return days.map((day) => (
      <tr key={day}>
        <td className="p-3 border font-medium">{day}</td>
        {timeSlots.map((slot, slotIndex) => {
          const timeSlotId = slotIndex + 1;
          const cell = getCellAtPosition(day, timeSlotId);
          const emptyCellId = generateEmptyCellId(day, timeSlotId); 
          const allCellIds = cell ? [cell.id, emptyCellId] : [emptyCellId];
          
          const isBreak = slot.includes('Break');
          const isLunch = slot.includes('Lunch');
          
          if (isBreak || isLunch) {
            return (
              <td key={`${day}-${slotIndex}`} className="p-2 border min-h-[80px]">
                <div className={`h-full flex flex-col justify-center items-center ${
                  isBreak ? 'bg-yellow-50' : 'bg-green-50'
                }`}>
                  <div className={`text-2xl font-bold ${
                    isBreak ? 'text-yellow-700' : 'text-green-700'
                  }`}>
                    {isBreak ? 'B' : 'L'}
                  </div>
                  <div className={`text-xs ${isBreak ? 'text-yellow-600' : 'text-green-600'}`}>
                    {isBreak ? 'Break' : 'Lunch'}
                  </div>
                </div>
              </td>
            );
          }
          
          if (isEdit) {
            return (
              <td key={`${day}-${slotIndex}`} className="p-2 border min-h-[80px]">
                <SortableContext items={allCellIds} strategy={rectSortingStrategy}>
                  {cell ? (
                    <SortableExamCell
                      cell={cell}
                      isEditMode={isEdit}
                      onDoubleClick={handleDoubleClickCell}
                    />
                  ) : (
                    <SortableEmptyCell
                      id={emptyCellId}
                      onDoubleClick={() => handleDoubleClickEmptyCell(day, timeSlotId)}
                    />
                  )}
                </SortableContext>
              </td>
            );
          } else {
            return (
              <td key={`${day}-${slotIndex}`} className="p-2 border min-h-[80px]">
                {cell ? (
                  <ExamTimetableCell
                    subjectName={cell.subjectName}
                    paperLabel={cell.paperLabel}
                    isEditMode={false}
                  />
                ) : (
                  <div className="h-full min-h-[80px] flex items-center justify-center text-gray-400">
                    -
                  </div>
                )}
              </td>
            );
          }
        })}
      </tr>
    ));
  }, [days, timeSlots, getCellAtPosition, generateEmptyCellId, handleDoubleClickCell, handleDoubleClickEmptyCell]);

  if (!isEditMode) {
    return (
      <div className="overflow-x-auto shadow-sm rounded-lg shadow-red-200">
        <table className="w-full border-collapse mt-4">
          <thead>
            <tr>
              <th className="p-3 border bg-gray-100">Day / Time</th>
              {timeSlots.map((slot, index) => (
                <th key={index} className="p-3 border bg-gray-100 text-sm">
                  {slot}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {renderTableRows(false)}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <>
      <DndContext
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="overflow-x-auto shadow-sm rounded-lg shadow-red-200">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-3 border bg-gray-100">Day / Time</th>
                {timeSlots.map((slot, index) => (
                  <th key={index} className="p-3 border bg-gray-100 text-sm">
                    {slot}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {renderTableRows(true)}
            </tbody>
          </table>
        </div>

        <DragOverlay>
          {activeCell && (
            <div className="border border-blue-300 rounded shadow-lg bg-white p-2 w-32">
              <ExamTimetableCell
                subjectName={activeCell.subjectName}
                paperLabel={activeCell.paperLabel}
                isEditMode={isEditMode}
              />
            </div>
          )}
        </DragOverlay>
      </DndContext>
    
      {editingCell && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {editingCell.id.startsWith('new-') ? 'Add Exam' : 'Edit Exam'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <input 
                    type="text"
                    value={editingCell.subjectName || ''}
                    onChange={(e) => setEditingCell(prev => prev ? {...prev, subjectName: e.target.value} : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Paper Label (Optional)
                  </label>
                  <input 
                    type="text"
                    value={editingCell.paperLabel || ''}
                    onChange={(e) => setEditingCell(prev => prev ? {...prev, paperLabel: e.target.value} : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Paper 1, Final Exam"
                  />
                </div>
              </div>
              
              <div className="flex justify-between mt-8 pt-4 border-t">
                {!editingCell.id.startsWith('new-') && (
                  <button
                    type="button"
                    onClick={handleDeleteCell}
                    className="px-4 py-2 text-sm text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                )}
                
                <div className="flex gap-2 ml-auto">
                  <button
                    type="button"
                    onClick={() => setEditingCell(null)}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveEdit(editingCell)}
                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {editingCell.id.startsWith('new-') ? 'Add' : 'Save'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditableExamTimetable;