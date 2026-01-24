"use client";

import { useCalendarStore } from "@/utils/CalendarStore";
import SchedulesList from "@/components/admin/calendar/SchedulesList";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DAYS = ["S", "M", "T", "W", "T", "F", "S"];

const CalendarSidebar = () => {
  const { currentDate, nextMonth, prevMonth } = useCalendarStore();
  
  const monthYear = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
  
  // Get days in month
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // Get first day of month (0 = Sunday)
  const firstDay = new Date(year, month, 1).getDay();
  
  // Get today's date
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
  const todayDate = today.getDate();

  return (
    <aside className="w-64 border-r bg-gray-50 flex flex-col">
      {/* Mini Calendar */}
      <div className="p-4 border-b">
        {/* Header row */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold">{monthYear}</h3>
          <div className="flex items-center gap-1">
            <button onClick={prevMonth} className="p-1 rounded hover:bg-gray-100">
              <ChevronLeft size={16} />
            </button>
            <button onClick={nextMonth} className="p-1 rounded hover:bg-gray-100">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Day labels */}
        <div className="grid grid-cols-7 text-sm text-gray-500 mb-2">
          {DAYS.map((day) => (
            <div key={day} className="text-center">{day}</div>
          ))}
        </div>

        {/* Dates */}
        <div className="grid grid-cols-7 gap-1 text-sm font-semibold">
          {/* Empty cells for days before 1st */}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="h-8"></div>
          ))}
          
          {/* Date cells */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const date = i + 1;
            const isToday = isCurrentMonth && date === todayDate;
            
            return (
              <div
                key={i}
                className="h-8 flex items-center justify-center rounded cursor-pointer hover:bg-gray-200"
              >
                <div className={`
                  w-7 h-7 flex items-center justify-center rounded-full
                  ${isToday ? 'bg-red-100 shadow-inner shadow-red-200' : ''}
                `}>
                  <span className={`
                    ${isToday ? 'text-black font-medium' : ''}
                  `}>
                    {date}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <SchedulesList />
    </aside>
  );
};

export default CalendarSidebar;