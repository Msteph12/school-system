"use client";

import EventPill from "@/components/admin/calendar/EventPill";
import { useCalendarStore } from "@/utils/CalendarStore";
import type { CalendarEvent } from "@/types/calendar";

interface CalendarCellProps {
  date: number;
  isCurrentMonth?: boolean;
  isToday?: boolean;
  events?: CalendarEvent[]; // Fixed type
  onEventClick: (event: CalendarEvent) => void; // Fixed type
}

const CalendarCell = ({
  date,
  events = [],
  isCurrentMonth = true,
  isToday = false,
  onEventClick,
}: CalendarCellProps) => {
  const { currentDate, openModal } = useCalendarStore();

  const handleCellClick = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const cellDate = new Date(year, month, date);
    const formattedDate = cellDate.toLocaleDateString("en-CA");

    openModal(formattedDate);
  };

  return (
    <div
      onClick={handleCellClick}
      className={`border-r border-b p-2 text-sm h-full cursor-pointer hover:bg-gray-50 ${
        isToday ? "bg-red-200" : ""
      }`}
    >
      {/* Date number */}
      <div
        className={`text-xs mb-1 font-medium ${
          isCurrentMonth ? "text-gray-900" : "text-gray-400"
        }`}
      >
        {date}
      </div>

      {/* Events */}
      <div className="space-y-1">
        {events.map((event) => (
          <div
            key={event.id}
            onClick={(e) => {
              e.stopPropagation();
              onEventClick(event); // Pass CalendarEvent directly
            }}
          >
            <EventPill
              title={event.title}
              type={event.type as "academic" | "exam" | "meeting" | "holiday" | "general"}
              onClick={() => onEventClick(event)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarCell;