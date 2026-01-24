"use client";

import { useCalendarStore } from "@/utils/CalendarStore";
import EventPill from "@/components/admin/calendar/EventPill";
import type { CalendarEvent } from "@/types/calendar";

const HOURS = Array.from({ length: 24 }, (_, i) => (i + 6) % 24);
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface WeekGridProps {
  onEventClick?: (event: CalendarEvent) => void;
}

const WeekGrid = ({ onEventClick }: WeekGridProps) => {
  const { currentDate, events, eventFilters, openModal } = useCalendarStore();

  // Get start of week (Sunday)
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

  const isToday = (date: Date) =>
    date.toDateString() === new Date().toDateString();

  // Get events for specific date and hour
  const getEventsForTimeSlot = (date: Date, hour: number) => {
    const formattedDate = date.toLocaleDateString("en-CA");
    const hourStr = hour.toString().padStart(2, '0');
    
    return events.filter((event) => 
      event.date === formattedDate && 
      eventFilters.includes(event.type) &&
      event.startTime?.startsWith(hourStr)
    );
  };

  const handleTimeSlotClick = (date: Date, hour: number) => {
    const selectedDate = new Date(date);
    selectedDate.setHours(hour, 0, 0, 0);
    const formattedDate = selectedDate.toLocaleDateString("en-CA");
    openModal(formattedDate);
  };

  const handleEventClick = (e: React.MouseEvent, event: CalendarEvent) => {
    e.stopPropagation();
    onEventClick?.(event);
  };

  return (
    <div className="flex flex-1 overflow-auto h-full">
      {/* Time column */}
      <div className="w-16 border-r flex flex-col">
        <div className="h-10 flex-shrink-0" />
        <div className="flex-1">
          {HOURS.map((hour) => (
            <div key={hour} className="h-20 text-xs text-gray-500 px-1 flex-shrink-0">
              {hour}:00
            </div>
          ))}
        </div>
      </div>

      {/* Days columns */}
      <div className="grid grid-cols-7 flex-1 h-full">
        {DAYS.map((day, i) => {
          const date = new Date(startOfWeek);
          date.setDate(startOfWeek.getDate() + i);

          return (
            <div key={day} className="border-r last:border-r-0 flex flex-col">
              {/* Day header */}
              <div
                className={`h-10 border-b text-xs font-medium flex items-center justify-center flex-shrink-0 ${
                  isToday(date) ? "bg-red-200 shadow-sm" : ""
                }`}
              >
                {day} {date.getDate()}
              </div>

              {/* Time slots */}
              <div className="flex-1">
                {HOURS.map((hour) => {
                  const slotEvents = getEventsForTimeSlot(date, hour);
                  
                  return (
                    <div
                      key={hour}
                      onClick={() => handleTimeSlotClick(date, hour)}
                      className="h-20 border-b hover:bg-gray-50 shrink-0 cursor-pointer p-1 relative"
                    >
                      {/* Event pills */}
                      <div className="space-y-1">
                        {slotEvents.slice(0, 2).map((event) => (
                          <div
                            key={event.id}
                            onClick={(e) => handleEventClick(e, event)}
                          >
                            <EventPill
                              title={event.title}
                              type={event.type as "academic" | "exam" | "meeting" | "holiday" | "general"}
                              onClick={() => onEventClick?.(event)}
                            />
                          </div>
                        ))}
                        {slotEvents.length > 2 && (
                          <div className="text-xs text-gray-500 pl-1">
                            +{slotEvents.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeekGrid;