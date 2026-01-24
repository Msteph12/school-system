"use client";

import {
  X,
  Pencil,
  Trash2,
  Share2,
  Copy,
} from "lucide-react";
import type { CalendarEvent } from "@/types/calendar";

interface ViewEventModalProps {
  isOpen: boolean;
  event: CalendarEvent | null;
  onClose: () => void;
  onEdit: (event: CalendarEvent) => void;
  onDelete: (eventId: string) => void;
  onShare: (event: CalendarEvent) => void;
}

const ViewCalendarEventModal = ({
  isOpen,
  event,
  onClose,
  onEdit,
  onDelete,
  onShare,
}: ViewEventModalProps) => {
  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-lg p-8 relative">
        {/* Top-right icons */}
        <div className="absolute top-6 right-6 flex gap-3">
          <button 
            onClick={() => onEdit(event)} 
            title="Edit"
            className="p-2 hover:bg-gray-100 rounded"
          >
            <Pencil size={18} />
          </button>
          <button
            onClick={() => onDelete(event.id)}
            title="Delete"
            className="p-2 hover:bg-gray-100 rounded text-red-600"
          >
            <Trash2 size={18} />
          </button>
          <button 
            onClick={() => onShare(event)} 
            title="Share"
            className="p-2 hover:bg-gray-100 rounded"
          >
            <Share2 size={18} />
          </button>
          <button 
            onClick={onClose} 
            title="Close"
            className="p-2 hover:bg-gray-100 rounded"
          >
            <X size={18} />
          </button>
        </div>

        {/* Event details */}
        <div className="pr-12">
          <h2 className="text-2xl font-semibold mb-6">{event.title}</h2>

          {event.description && (
            <div className="mt-6 pt-6 border-t">
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-gray-700">{event.description}</p>
            </div>
         )}

          <div className="space-y-4 text-base">
            <div className="flex items-start gap-3">
              <span className="font-medium min-w-20">📅 Date:</span>
              <span>{event.date}</span>
            </div>

            {event.startTime && event.endTime && (
              <div className="flex items-start gap-3">
                <span className="font-medium min-w-20">🕒 Time:</span>
                <span>{event.startTime} – {event.endTime}</span>
              </div>
            )}

            <div className="flex items-start gap-3">
              <span className="font-medium min-w-20">🏷️ Type:</span>
              <span className="capitalize">{event.type}</span>
            </div>

            {event.meetingLink && (
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                <span className="font-medium min-w-20">🔗 Meeting:</span>
                <a
                    href={event.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline hover:text-blue-800"
                >
                    Join meeting
                </a>
                </div>
                <button
                onClick={() => navigator.clipboard.writeText(event.meetingLink!)}
                title="Copy link"
                className="p-1 hover:bg-gray-100 rounded"
                >
                <Copy size={16} />
                </button>
            </div>
            )}

            {event.description && (
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-gray-700">{event.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCalendarEventModal;