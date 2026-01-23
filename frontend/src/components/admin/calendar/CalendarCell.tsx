"use client";

import EventPill from "@/components/admin/calendar/EventPill";
import { useCalendarStore } from "@/utils/CalendarStore";

interface CalendarCellProps {
  date: number;
  isCurrentMonth?: boolean;
  events?: Array<{
    id: string;
    title: string;
    type?: string;
  }>;
}

const CalendarCell = ({ date, events = [], isCurrentMonth = true }: CalendarCellProps) => {
  const { currentDate, openModal } = useCalendarStore();

  const handleClick = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Create the correct date
    const cellDate = new Date(year, month, date);
    
    // Format as YYYY-MM-DD
    const formattedDate = cellDate.toISOString().split('T')[0];
    
    console.log("Cell clicked:", formattedDate); // Debug log
    openModal(formattedDate);
  };

  return (
    <div 
      onClick={handleClick}
      className="border-r border-b p-2 text-sm h-full cursor-pointer hover:bg-gray-50"
    >
      {/* Date number */}
      <div className={`text-xs mb-1 ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}`}>
        {date}
      </div>

      {/* Events */}
      <div className="space-y-1">
        {events.map((event) => (
          <EventPill
            key={event.id}
            title={event.title}
            type={event.type as "exam" | "meeting" | "holiday" | "general"}
          />
        ))}
      </div>
    </div>
  );
};

export default CalendarCell;