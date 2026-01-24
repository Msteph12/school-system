"use client";

import { useCalendarStore } from "@/utils/CalendarStore";

const EVENT_TYPES = [
  { label: "All Events", value: "all" },
  { label: "Exams", value: "exam" },
  { label: "Meetings", value: "meeting" },
  { label: "Holidays", value: "holiday" },
  { label: "Academic", value: "academic" },
  { label: "General", value: "general" },
  { label: "Other", value: "other" },
];

const SchedulesList = () => {
  const { eventFilters, toggleEventFilter } = useCalendarStore();
  
  const allTypes = EVENT_TYPES.slice(1).map(t => t.value); // All except "all"
  const allChecked = allTypes.every(type => eventFilters.includes(type));
  const isAllChecked = eventFilters.includes("all") || allChecked;

  const handleTypeToggle = (value: string) => {
    if (value === "all") {
      // Handle "All" toggle
      if (isAllChecked) {
        // Uncheck all types
        allTypes.forEach(type => {
          if (eventFilters.includes(type)) {
            toggleEventFilter(type);
          }
        });
        if (eventFilters.includes("all")) {
          toggleEventFilter("all");
        }
      } else {
        // Check all types
        allTypes.forEach(type => {
          if (!eventFilters.includes(type)) {
            toggleEventFilter(type);
          }
        });
        if (!eventFilters.includes("all")) {
          toggleEventFilter("all");
        }
      }
    } else {
      // Handle individual type toggle
      toggleEventFilter(value);
      
      // If unchecking a type while "all" is checked, remove "all"
      if (eventFilters.includes("all")) {
        toggleEventFilter("all");
      }
      
      // If all types are checked, auto-check "all"
      const allTypesNowChecked = allTypes.every(type => 
        eventFilters.includes(type) || (type === value && !eventFilters.includes(value))
      );
      
      if (allTypesNowChecked && !eventFilters.includes("all")) {
        toggleEventFilter("all");
      }
    }
  };

  return (
    <div className="p-4 flex-1 border-t">
      <h3 className="text-sm font-semibold mb-3">Filter Events</h3>

      <ul className="space-y-2">
        {EVENT_TYPES.map((item) => {
          const isChecked = item.value === "all" 
            ? isAllChecked 
            : eventFilters.includes(item.value);
          
          return (
            <li
              key={item.value}
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => handleTypeToggle(item.value)}
            >
              <div className={`w-3 h-3 rounded-full border ${
                isChecked 
                  ? "bg-blue-500 border-blue-500" 
                  : "bg-white border-gray-400"
              }`} />
              <span className="text-sm text-gray-700">
                {item.label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SchedulesList;