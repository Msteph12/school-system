"use client";

import { useState, useEffect } from 'react';
import { DndContext, type DragEndEvent, DragOverlay, type DragStartEvent, closestCorners } from '@dnd-kit/core';
import { SortableContext, arrayMove, rectSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import TimetableCell from './TimetableCell';

export interface CellData {
  id: string;
  day: string;
  timeSlot: string;
  subject: string;
  teacher?: string;
  room?: string;
  classId?: string;
}

interface EditableTimetableProps {
  initialData: CellData[];
  days: string[];
  timeSlots: string[];
  isEditMode: boolean;
  onDataChange: (data: CellData[]) => void;
}

const SortableCell = ({ 
  cell, 
  isEditMode,
  onEdit
}: { 
  cell: CellData;
  isEditMode: boolean;
  onEdit: (cell: CellData) => void;
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
    zIndex: isDragging ? 1000 : 1,
  };

  const handleEdit = () => {
    if (isEditMode) {
      onEdit(cell);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`border border-gray-200 rounded h-full ${isDragging ? 'shadow-lg' : ''}`}
    >
      <TimetableCell
        subject={cell.subject}
        teacher={cell.teacher}
        room={cell.room}
        isEditMode={isEditMode}
        onEdit={handleEdit}
        isDragging={isDragging}
        dragHandleProps={isEditMode ? { ...attributes, ...listeners } : undefined}
      />
    </div>
  );
};

const EditableTimetable = ({
  initialData,
  days,
  timeSlots,
  isEditMode,
  onDataChange,
}: EditableTimetableProps) => {
  const [cells, setCells] = useState<CellData[]>(initialData);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [editingCell, setEditingCell] = useState<CellData | null>(null);

  // Update cells when initialData changes
  useEffect(() => {
    setCells(initialData);
  }, [initialData]);

  // Notify parent of data changes
  useEffect(() => {
    onDataChange(cells);
  }, [cells, onDataChange]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      setCells((items) => {
        const activeCell = items.find((item) => item.id === active.id);
        if (!activeCell) return items;

        // Check if dropping on an empty cell
        if (over.id.toString().startsWith('empty-')) {
          // Parse day and timeSlot from empty cell ID
          const [day, timeSlot] = over.id.toString().split('-');
          
          // Update the dragged cell's position
          const updatedCell = {
            ...activeCell,
            day,
            timeSlot
          };

          // Remove from old position, add to new position
          const newCells = items.filter(item => item.id !== active.id);
          newCells.push(updatedCell);
          
          return newCells;
        } else {
          // Swap with existing cell
          const oldIndex = items.findIndex((item) => item.id === active.id);
          const newIndex = items.findIndex((item) => item.id === over.id);
          
          const newCells = arrayMove(items, oldIndex, newIndex);
          
          // Swap positions
          const movedCell = newCells[newIndex];
          const targetCell = newCells[oldIndex];
          
          if (movedCell && targetCell) {
            const tempDay = movedCell.day;
            const tempTime = movedCell.timeSlot;
            
            movedCell.day = targetCell.day;
            movedCell.timeSlot = targetCell.timeSlot;
            
            targetCell.day = tempDay;
            targetCell.timeSlot = tempTime;
          }

          return newCells;
        }
      });
    }
  };

  const handleEditCell = (cell: CellData) => {
    setEditingCell(cell);
  };

  const handleSaveEdit = (updatedCell: CellData) => {
    setCells(prev => prev.map(c => 
      c.id === updatedCell.id ? updatedCell : c
    ));
    setEditingCell(null);
  };

  // Find cell for drag overlay
  const activeCell = activeId ? cells.find(cell => cell.id === activeId) : null;

  // Generate grid structure
  const getCellAtPosition = (day: string, timeSlot: string) => {
    return cells.find(cell => cell.day === day && cell.timeSlot === timeSlot);
  };

  // Helper function for empty cell IDs
  const generateEmptyCellId = (day: string, timeSlot: string) => {
    return `empty-${day}-${timeSlot}`;
  };

  return (
    <>
      <DndContext
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-3 border bg-gray-100">Time</th>
                {days.map(day => (
                  <th key={day} className="p-3 border bg-gray-100">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((timeSlot) => (
                <tr key={timeSlot}>
                  <td className="p-3 border bg-gray-50 font-medium">
                    {timeSlot}
                  </td>
                  {days.map(day => {
                    const cell = getCellAtPosition(day, timeSlot);
                    const emptyCellId = generateEmptyCellId(day, timeSlot);
                    const allCellIds = [...cells.map(c => c.id), emptyCellId];
                    
                    return (
                      <td 
                        key={`${day}-${timeSlot}`} 
                        className="p-2 border min-h-[100px]"
                      >
                        <SortableContext 
                          items={allCellIds}
                          strategy={rectSortingStrategy}
                        >
                          {cell ? (
                            <SortableCell
                              cell={cell}
                              isEditMode={isEditMode}
                              onEdit={handleEditCell}
                            />
                          ) : (
                            <div 
                              id={emptyCellId}
                              className="h-full min-h-[80px] border border-dashed border-gray-300 rounded bg-gray-50 flex items-center justify-center"
                            >
                              {isEditMode ? (
                                <span className="text-gray-400 text-sm">
                                  Drop here
                                </span>
                              ) : null}
                            </div>
                          )}
                        </SortableContext>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <DragOverlay>
          {activeCell ? (
            <div className="border border-blue-300 rounded shadow-lg bg-white p-2">
              <TimetableCell
                subject={activeCell.subject}
                teacher={activeCell.teacher}
                room={activeCell.room}
                isEditMode={isEditMode}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Edit Modal */}
      {editingCell && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96 shadow-red-200">
            <h3 className="text-lg font-bold mb-4">Edit Cell</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Subject</label>
                <input 
                  type="text"
                  defaultValue={editingCell.subject}
                  className="w-full px-3 py-2 border rounded"
                  onChange={(e) => setEditingCell({...editingCell, subject: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Teacher (Optional) </label>
                <input 
                  type="text"
                  defaultValue={editingCell.teacher || ''}
                  className="w-full px-3 py-2 border rounded"
                  onChange={(e) => setEditingCell({...editingCell, teacher: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Room (Optional) </label>
                <input 
                  type="text"
                  defaultValue={editingCell.room || ''}
                  className="w-full px-3 py-2 border rounded"
                  onChange={(e) => setEditingCell({...editingCell, room: e.target.value})}
                />
              </div>
              <div className="flex gap-2 justify-end mt-6">
                <button
                  onClick={() => setEditingCell(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSaveEdit(editingCell)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditableTimetable;