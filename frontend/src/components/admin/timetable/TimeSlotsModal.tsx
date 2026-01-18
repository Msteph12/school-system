"use client";

import { useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const TimeSlotsModal = ({ isOpen, onClose }: Props) => {
  const [hasSlots] = useState(false); // placeholder (will come from DB)
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSave = () => {
    if (!hasSlots) {
      setError("Please add at least one time slot before saving.");
      return;
    }

    // save logic later
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-lg rounded shadow-lg p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-gray-800">
          Configure Time Slots
        </h2>

        {/* Warning when slots already exist */}
        {hasSlots && (
          <div className="text-sm bg-yellow-50 text-yellow-800 p-3 rounded">
            Updating time slots will affect existing timetables.
          </div>
        )}

        {/* Slot Form */}
        <div className="grid grid-cols-3 gap-3">
          <input type="time" className="border rounded px-3 py-2 text-sm" />
          <input type="time" className="border rounded px-3 py-2 text-sm" />
          <select className="border rounded px-3 py-2 text-sm">
            <option value="lesson">Lesson</option>
            <option value="break">Break</option>
            <option value="lunch">Lunch</option>
          </select>
        </div>

        {/* Error message */}
        {error && (
          <div className="text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Existing Slots */}
        <div className="text-sm text-gray-500">
          Existing slots will appear here
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-gray-100 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded"
          >
            Save Slots
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimeSlotsModal;
