"use client";

import { useCalendarStore } from "@/utils/CalendarStore";
import CalendarCell from "@/components/admin/calendar/CalendarCell";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const CalendarGrid = () => {
  const { currentDate } = useCalendarStore();
  
  // Get month/year from store
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  // Get first day of month (0=Sunday)
  const firstDay = new Date(year, month, 1).getDay();
  
  // Get days in month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // Get days in previous month
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  return (
    <div className="flex-1 overflow-auto">
      {/* Day Headers */}
      <div className="grid grid-cols-7 border-b">
        {DAYS.map((day) => (
          <div
            key={day}
            className="px-3 py-2 text-sm font-medium text-gray-600 border-r last:border-r-0"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Cells */}
      <div className="grid grid-cols-7 auto-rows-[120px]">
        {/* Previous month days */}
        {Array.from({ length: firstDay }).map((_, index) => {
          const date = daysInPrevMonth - firstDay + index + 1;
          return (
            <CalendarCell 
              key={`prev-${index}`} 
              date={date} 
              events={[]}
              isCurrentMonth={false}
            />
          );
        })}
        
        {/* Current month days */}
        {Array.from({ length: daysInMonth }).map((_, index) => (
          <CalendarCell 
            key={`current-${index}`} 
            date={index + 1} 
            events={[]}
            isCurrentMonth={true}
          />
        ))}
        
        {/* Next month days (to fill grid) */}
        {Array.from({ length: (35 - (firstDay + daysInMonth)) }).map((_, index) => (
          <CalendarCell 
            key={`next-${index}`} 
            date={index + 1} 
            events={[]}
            isCurrentMonth={false}
          />
        ))}
      </div>
    </div>
  );
};

export default CalendarGrid;