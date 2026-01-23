"use client";

import type { CalendarEvent } from "@/types/calendar";
import { useState } from "react";

interface EventModalProps {
  isOpen: boolean;
  date: string;
  onClose: () => void;
  onSave: (event: CalendarEvent) => void;
}

const EventModal = ({ isOpen, date, onClose, onSave }: EventModalProps) => {
  const [title, setTitle] = useState("");
  const [type, setType] = useState<"exam" | "meeting" | "general" | "holiday">("general");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleTypeChange = (value: string) => {
    if (value === "exam" || value === "meeting" || value === "general" || value === "holiday") {
      setType(value);
    }
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    
    onSave({
      id: crypto.randomUUID(),
      title: title || "New Event",
      date,
      type,
      startTime,
      endTime,
    });
    
    setIsSubmitting(false);
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setTitle("");
    setType("general");
    setStartTime("09:00");
    setEndTime("10:00");
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-6">Create Event</h2>

        <div className="mb-6 p-3 bg-gray-50 rounded">
          <p className="text-sm font-medium">📅 Selected date</p>
          <p className="text-base mt-1">{date}</p>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">✏️ Event Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border p-3 rounded"
              placeholder="Enter event title"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">🕒 Start Time</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full border p-3 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">🕒 End Time</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full border p-3 rounded"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">🏷️ Event Type</label>
            <select
              value={type}
              onChange={(e) => handleTypeChange(e.target.value)}
              className="w-full border p-3 rounded"
            >
              <option value="exam">Exam</option>
              <option value="meeting">Meeting</option>
              <option value="general">General</option>
              <option value="holiday">Holiday</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={handleClose}
            className="border px-5 py-2.5 rounded hover:bg-gray-50"
          >
            ❌ Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSubmitting}
            className="bg-red-500 text-white px-5 py-2.5 rounded hover:bg-red-600 disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "💾 Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventModal;