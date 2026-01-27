"use client";

import { useState, useEffect } from "react";
import type { TimeSlot } from "@/types/examTimetable";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialSlots: TimeSlot[];
  onSave: (slots: TimeSlot[]) => void;
}

const ExamTimeSlotsModal = ({
  isOpen,
  onClose,
  initialSlots,
  onSave,
}: Props) => {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [type, setType] = useState<"exam" | "break" | "lunch">("exam");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setSlots(initialSlots);
      setStart("");
      setEnd("");
      setError("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);
  if (!isOpen) return null;

  const addSlot = () => {
    setError("");

    if (!start || !end) {
      setError("Start time and end time are required.");
      return;
    }

    if (start >= end) {
      setError("End time must be later than start time.");
      return;
    }

    const duplicate = slots.some(
      (s) => s.startTime === start && s.endTime === end
    );

    if (duplicate) {
      setError("This time slot already exists.");
      return;
    }

    const newSlot: TimeSlot = {
      startTime: start,
      endTime: end,
      type: type, // Add type to TimeSlot
    };

    setSlots((prev) => [...prev, newSlot]);
    setStart("");
    setEnd("");
  };

  const removeSlot = (index: number) => {
    setSlots((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave(slots);
    onClose();
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case "exam": return "bg-blue-100 text-blue-800";
      case "break": return "bg-yellow-100 text-yellow-800";
      case "lunch": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeLabel = (type: string) => {
    switch(type) {
      case "exam": return "Exam";
      case "break": return "Break";
      case "lunch": return "Lunch";
      default: return "Unknown";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Configure Time Slots</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>

        <p className="text-sm text-gray-600">Define time slots for exam sessions, breaks, and lunch periods.</p>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
            <input
              type="time"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
            <input
              type="time"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as "exam" | "break" | "lunch")}
              className="w-full border rounded px-3 py-2"
            >
              <option value="exam">Exam Session</option>
              <option value="break">Break</option>
              <option value="lunch">Lunch</option>
            </select>
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-600 font-medium">{error}</p>
        )}

        <button
          type="button"
          onClick={addSlot}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Time Slot
        </button>

        <div className="border-t pt-4">
          <h3 className="font-medium text-gray-700 mb-3">Time Slots ({slots.length})</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {slots.length === 0 ? (
              <p className="text-gray-400 text-center py-4">No slots added yet</p>
            ) : (
              slots.map((slot, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center border border-gray-200 p-3 rounded"
                >
                  <div>
                    <div className="font-medium">{slot.startTime} – {slot.endTime}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-1 rounded ${getTypeColor(slot.type || "exam")}`}>
                        {getTypeLabel(slot.type || "exam")}
                      </span>
                      <span className="text-xs text-gray-500">
                        Duration: {calculateDuration(slot.startTime, slot.endTime)}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSlot(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <button 
            onClick={onClose} 
            className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={slots.length === 0}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save {slots.length} Slot{slots.length !== 1 ? 's' : ''}
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper function to calculate duration
const calculateDuration = (start: string, end: string): string => {
  const [startHour, startMinute] = start.split(':').map(Number);
  const [endHour, endMinute] = end.split(':').map(Number);
  
  const startTotal = startHour * 60 + startMinute;
  const endTotal = endHour * 60 + endMinute;
  
  const durationMinutes = endTotal - startTotal;
  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

export default ExamTimeSlotsModal;