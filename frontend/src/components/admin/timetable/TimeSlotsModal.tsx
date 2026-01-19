"use client";

import { useState, useEffect } from "react";
import type { TimeSlot } from "@/types/timetable";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialSlots: TimeSlot[];
  onSave: (slots: TimeSlot[]) => void;
}

const TimeSlotsModal = ({
  isOpen,
  onClose,
  initialSlots,
  onSave,
}: Props) => {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [type, setType] = useState<TimeSlot["type"]>("lesson");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      // Reset all state when modal opens
      setSlots(initialSlots);
      setStart("");
      setEnd("");
      setType("lesson");
      setError("");
    }
  }, [isOpen, initialSlots]);

  if (!isOpen) return null;

  const addSlot = () => {
    setError("");

    // Empty validation
    if (!start || !end) {
      setError("Start time and end time are required.");
      return;
    }

    if (start >= end) {
      setError("End time must be later than start time.");
      return;
    }

    // Duplicate validation
    const duplicate = slots.some(
      (s) => s.startTime === start && s.endTime === end
    );

    if (duplicate) {
      setError("This time slot already exists.");
      return;
    }

    const newSlot: TimeSlot = {
      id: Date.now(),
      startTime: start,
      endTime: end,
      type,
    };

    setSlots((prev) => [...prev, newSlot]);

    // Reset inputs
    setStart("");
    setEnd("");
  };

  const removeSlot = (id: number) => {
    setSlots((prev) => prev.filter((s) => s.id !== id));
  };

  const handleSave = () => {
    onSave(slots);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded p-6 space-y-4">
        <h2 className="text-lg font-semibold">Configure Time Slots</h2>

        <div className="grid grid-cols-3 gap-3">
          <input
            type="time"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="border rounded px-2 py-1"
          />
          <input
            type="time"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="border rounded px-2 py-1"
          />
          <select
            value={type}
            onChange={(e) =>
              setType(e.target.value as TimeSlot["type"])
            }
            className="border rounded px-2 py-1"
          >
            <option value="lesson">Lesson</option>
            <option value="break">Break</option>
            <option value="lunch">Lunch</option>
          </select>
        </div>

        {error && (
          <p className="text-sm text-red-600 font-medium">{error}</p>
        )}

        <button
          type="button"
          onClick={addSlot}
          className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
        >
          Add Slot
        </button>

        <div className="space-y-2">
          {slots.map((slot) => (
            <div
              key={slot.id}
              className="flex justify-between items-center border p-2 rounded text-sm"
            >
              <span>
                {slot.startTime} – {slot.endTime} ({slot.type})
              </span>
              <button
                type="button"
                onClick={() => removeSlot(slot.id)}
                className="text-red-500"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 border rounded"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-3 py-1 bg-green-600 text-white rounded"
          >
            Save Slots
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimeSlotsModal;