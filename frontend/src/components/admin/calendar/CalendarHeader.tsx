"use client";

import { useCalendarStore } from "@/utils/CalendarStore";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CalendarHeader = () => {
  const { 
    currentDate, 
    view, 
    setView, 
    prevMonth, 
    nextMonth, 
    prevWeek, 
    nextWeek, 
    goToToday 
  } = useCalendarStore();

  const monthYear = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b bg-white">
      {/* Left: Month & Navigation */}
      <div className="flex items-center gap-3">
        <button 
          onClick={view === 'month' ? prevMonth : prevWeek} 
          className="p-2 rounded hover:bg-gray-100"
        >
          <ChevronLeft size={18} />
        </button>

        <button 
          onClick={view === 'month' ? nextMonth : nextWeek} 
          className="p-2 rounded hover:bg-gray-100"
        >
          <ChevronRight size={18} />
        </button>

        <h2 className="text-lg font-semibold">{monthYear}</h2>

        <button
          onClick={goToToday}
          className="ml-2 px-4 py-1.5 text-sm border rounded-full bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:border-green-400 transition-colors flex items-center gap-2"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
          Today
        </button>
      </div>

      {/* Right: View Switch */}
      <div className="flex items-center border rounded overflow-hidden">
        <button 
          onClick={() => setView('month')}
          className={`px-4 py-1 text-sm ${view === 'month' ? 'bg-red-600 text-white' : 'hover:bg-gray-100'}`}
        >
          Month
        </button>
        <button 
          onClick={() => setView('week')}
          className={`px-4 py-1 text-sm ${view === 'week' ? 'bg-red-600 text-white' : 'hover:bg-gray-100'}`}
        >
          Week
        </button>
      </div>
    </div>
  );
};

export default CalendarHeader;