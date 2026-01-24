"use client";

import { useState } from "react";
import type { CalendarEvent, CalendarEventType } from "@/types/calendar";

interface EventModalProps {
  isOpen: boolean;
  date: string;
  onClose: () => void;
  onSave: (event: CalendarEvent) => void;
  event?: CalendarEvent | null;
}

const EventModal = ({ isOpen, date, onClose, onSave, event }: EventModalProps) => {
   // Initialize state based on event prop
  const [title, setTitle] = useState(event?.title || "");
  const [type, setType] = useState<CalendarEventType>(event?.type || "general");
  const [startTime, setStartTime] = useState(event?.startTime || "09:00");
  const [endTime, setEndTime] = useState(event?.endTime || "10:00");
  const [meetingLink, setMeetingLink] = useState(event?.meetingLink || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [description, setDescription] = useState(event?.description || "");

   // Update button text
  const buttonText = event ? "Update" : "Save";

  if (!isOpen) return null;

  const handleSave = async () => {
    setIsSubmitting(true);

    const eventData: CalendarEvent = {
      id: event?.id ?? crypto.randomUUID(),
      title: title || "New Event",
      date,
      type,
      startTime,
      endTime,
      meetingLink,
      description: description || undefined,
    };

    onSave(eventData);
    setIsSubmitting(false);
    handleClose();
  };

  const handleClose = () => {
    onClose();
    setTitle("");
    setType("general");
    setStartTime("09:00");
    setEndTime("10:00");
    setMeetingLink("");
    setDescription("");
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-6">
          {event ? "Edit Event" : "Create Event"}
        </h2>

        <div className="mb-6 p-3 bg-gray-50 rounded">
          <p className="text-sm font-medium">📅 Selected date</p>
          <p className="text-base mt-1">{date}</p>
        </div>

        <div className="space-y-4 mb-6">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-3 rounded"
            placeholder="Event title"
          />

          <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-3 rounded"
          placeholder="Description (optional)"
          rows={3}
          /> 


          <input
            type="url"
            value={meetingLink}
            onChange={(e) => setMeetingLink(e.target.value)}
            className="w-full border p-3 rounded"
            placeholder="Meeting link (optional)"
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full border p-3 rounded"
            />
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full border p-3 rounded"
            />
          </div>

          <select
            value={type}
            onChange={(e) => setType(e.target.value as CalendarEventType)}
            className="w-full border p-3 rounded"
          >
            <option value="academic">Academic</option>
            <option value="exam">Exam</option>
            <option value="meeting">Meeting</option>
            <option value="general">General</option>
            <option value="holiday">Holiday</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="flex justify-end gap-3">
          <button onClick={handleClose} className="border px-5 py-2.5 rounded">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSubmitting}
            className="bg-red-500 text-white px-5 py-2.5 rounded"
          >
            {isSubmitting ? "Saving..." : buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
