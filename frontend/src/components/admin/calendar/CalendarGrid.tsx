"use client";

import { useCalendarStore } from "@/utils/CalendarStore";
import CalendarCell from "@/components/admin/calendar/CalendarCell";
import type { CalendarEvent } from "@/types/calendar";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const CalendarGrid = ({ onEventClick }: { onEventClick: (event: CalendarEvent) => void }) => {
  const { currentDate, events, eventFilters } = useCalendarStore();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const today = new Date();
  const isCurrentMonthToday = today.getFullYear() === year && today.getMonth() === month;
  const todayDate = today.getDate();

  const getEventsForDate = (date: number) => {
    const formattedDate = new Date(year, month, date).toLocaleDateString("en-CA");
    // Filter events by date AND by selected event types
    return events.filter((event) => 
      event.date === formattedDate && 
      eventFilters.includes(event.type)
    );
  };

  return (
    <div className="flex-1 overflow-auto">
      {/* Day headers */}
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

      {/* Calendar cells */}
      <div className="grid grid-cols-7 auto-rows-[115px]">
        {/* Previous month */}
        {Array.from({ length: firstDay }).map((_, index) => {
          const date = daysInPrevMonth - firstDay + index + 1;
          return (
            <CalendarCell
              key={`prev-${index}`}
              date={date}
              events={[]}
              isCurrentMonth={false}
              isToday={false}
              onEventClick={onEventClick}
            />
          );
        })}

        {/* Current month */}
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const date = index + 1;
          const isToday = isCurrentMonthToday && date === todayDate;
          const cellEvents = getEventsForDate(date);

          return (
            <CalendarCell
              key={`current-${index}`}
              date={date}
              events={cellEvents}
              isCurrentMonth
              isToday={isToday}
              onEventClick={onEventClick}
            />
          );
        })}

        {/* Next month filler */}
        {Array.from({ length: 35 - (firstDay + daysInMonth) }).map((_, index) => (
          <CalendarCell
            key={`next-${index}`}
            date={index + 1}
            events={[]}
            isCurrentMonth={false}
            isToday={false}
            onEventClick={onEventClick}
          />
        ))}
      </div>
    </div>
  );
};

export default CalendarGrid;