"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { useCalendarStore } from "@/utils/CalendarStore";
import type { CalendarEvent } from "@/types/calendar";

import CalendarHeader from "@/components/admin/calendar/CalendarHeader";
import CalendarGrid from "@/components/admin/calendar/CalendarGrid";
import CalendarSidebar from "@/components/admin/calendar/CalendarSidebar";
import WeekGrid from "@/components/admin/calendar/WeekGrid";
import CalendarEventModal from "@/components/admin/calendar/CalendarEventModal";
import ViewCalendarEventModal from "@/components/admin/calendar/ViewCalendarEventModal";

const Calendar = () => {
  const {
    view,
    modalOpen,
    selectedDate,
    closeModal,
    addEvent,
    removeEvent,
    updateEvent,
    viewModalOpen,
    selectedEvent,
    openViewModal,
    closeViewModal,
    fetchEvents,
  } = useCalendarStore();

  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  // Load events on component mount
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  /* =========================
     Create / Update Event
  ========================= */
  const handleSaveEvent = async (event: CalendarEvent) => {
  try {
    if (editingEvent) {
      await updateEvent(event);
      toast("Event updated");
    } else {
      await addEvent(event);
      toast("Event created");
    }
    setEditingEvent(null);
  } catch {
    toast.error("Failed to save event");
  }
  };

  /* =========================
     View Event
  ========================= */
  const handleOpenEvent = (event: CalendarEvent) => {
    openViewModal(event);
  };

  /* =========================
     Edit Event
  ========================= */
  const handleEditEvent = (event: CalendarEvent) => {
    setEditingEvent(event);
    closeViewModal();
  };

  /* =========================
     Share Event
========================= */
const handleShareEvent = (event: CalendarEvent) => {
  const eventDetails = `
Event: ${event.title}
Date: ${event.date}
${event.startTime && event.endTime ? `Time: ${event.startTime} - ${event.endTime}` : ''}
Type: ${event.type}
${event.meetingLink ? `Meeting Link: ${event.meetingLink}` : ''}
${event.description ? `Description: ${event.description}` : ''}
  `.trim();

  if (navigator.share) {
    // Web Share API
    navigator.share({
      title: event.title,
      text: eventDetails,
      url: window.location.href,
    });
  } else if (navigator.clipboard) {
    // Copy to clipboard
    navigator.clipboard.writeText(eventDetails);
    toast("Event details copied to clipboard");
  } else {
    // Fallback
    const textArea = document.createElement('textarea');
    textArea.value = eventDetails;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    toast("Event details copied to clipboard");
  }
  };

  /* =========================
     Delete Event
  ========================= */
  const handleDeleteEvent = async (eventId: string) => {
  try {
    await removeEvent(eventId);
    closeViewModal();
    toast("Event deleted");
  } catch {
    toast.error("Failed to delete event");
  }
};


  return (
    <div className="space-y-6 mb-2">

      {/* Header (title + back) */}
      <div className="flex items-center justify-between mb-0.5">
        <h1 className="text-2xl font-semibold text-gray-800">Calendar</h1>
        <button
          onClick={() => window.history.back()}
          className="text-blue-600 mr-5 hover:underline"
        >
          ← Back
        </button>
      </div>

      {/* Calendar Wrapper (FULL SCREEN, NO SCROLL) */}
      <div className="flex h-[calc(115vh-180px)] bg-gray-100 rounded shadow-md mt-2 overflow-auto">
        {/* Sidebar */}
        <CalendarSidebar />

        {/* Main Calendar */}
        <div className="flex flex-col flex-1 h-full">
          <CalendarHeader />

          {view === "month" ? (
            <CalendarGrid onEventClick={handleOpenEvent} />
          ) : (
            <WeekGrid onEventClick={handleOpenEvent} />
          )}
        </div>
      </div>

      {/* Create / Edit Event Modal */}
      {(modalOpen || editingEvent) && (
        <CalendarEventModal
          key={editingEvent?.id || "create"}
          isOpen={modalOpen || !!editingEvent}
          date={selectedDate || editingEvent?.date || ""}
          onClose={() => {
            closeModal();
            setEditingEvent(null);
          }}
          onSave={handleSaveEvent}
          event={editingEvent}
        />
      )}

      {/* View Event Modal */}
      {viewModalOpen && selectedEvent && (
        <ViewCalendarEventModal
          isOpen={viewModalOpen}
          event={selectedEvent}
          onClose={closeViewModal}
          onEdit={() => handleEditEvent(selectedEvent)}
          onDelete={handleDeleteEvent}
           onShare={handleShareEvent}
        />
      )}
    </div>
  );
};

export default Calendar;
