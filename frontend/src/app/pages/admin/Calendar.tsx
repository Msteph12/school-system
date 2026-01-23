"use client";

import { useCalendarStore } from "@/utils/CalendarStore";
import type { CalendarEvent } from "@/types/calendar";
import CalendarHeader from "@/components/admin/calendar/CalendarHeader";
import CalendarGrid from "@/components/admin/calendar/CalendarGrid";
import CalendarSidebar from "@/components/admin/calendar/CalendarSidebar";
import WeekGrid from "@/components/admin/calendar/WeekGrid";
import CalendarEventModal from "@/components/admin/calendar/CalendarEventModal";

const Calendar = () => {
 const { view, modalOpen, selectedDate, closeModal } = useCalendarStore(); // Add these

  // Add a placeholder save function
  const handleSaveEvent = (event: CalendarEvent) => {
    console.log('Event saved:', event);
    // You'll implement actual saving logic later
  };

  return (
    <div className="flex h-full w-full bg-gray-100">
      {/* Left Sidebar */}
      <CalendarSidebar />

      {/* Main Calendar Area */}
      <div className="flex flex-col flex-1 overflow-hidden pb-5">
        <CalendarHeader />
        <div className="flex-1 overflow-auto"> 
          {view === 'month' ? <CalendarGrid /> : <WeekGrid />}
        </div>
        
        {/* Modal */}
       <CalendarEventModal
        isOpen={modalOpen}
        date={selectedDate || ""}
        onClose={closeModal}
        onSave={handleSaveEvent}
      />
      </div>
    </div>
  );
};

export default Calendar;