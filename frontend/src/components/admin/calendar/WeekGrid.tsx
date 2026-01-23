// Add the openModal import at the top
import { useCalendarStore } from "@/utils/CalendarStore";

const HOURS = Array.from({ length: 24 }, (_, i) => (i + 6) % 24);
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const WeekGrid = () => {
  const { currentDate, openModal } = useCalendarStore(); // Add openModal

  // Get start of week (Sunday)
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

  return (
    <div className="flex flex-1 overflow-auto min-h-0">
      {/* Time column */}
      <div className="w-16 border-r flex flex-col">
        <div className="h-10 flex-shrink-0" />
        <div className="flex-1 overflow-y-auto">
          {HOURS.map((hour) => (
            <div key={hour} className="h-20 text-xs text-gray-500 px-1 flex-shrink-0">
              {hour}:00
            </div>
          ))}
        </div>
      </div>

      {/* Days columns */}
      <div className="grid grid-cols-7 flex-1 min-h-0">
        {DAYS.map((day, i) => {
          const date = new Date(startOfWeek);
          date.setDate(startOfWeek.getDate() + i);
          const dateString = date.toISOString().split("T")[0]; // Add this line

          return (
            <div key={day} className="border-r last:border-r-0 flex flex-col">
              {/* Day header */}
              <div className="h-10 border-b text-xs font-medium flex items-center justify-center flex-shrink-0">
                {day} {date.getDate()}
              </div>

              {/* Time slots */}
              <div className="flex-1 overflow-y-auto">
                {HOURS.map((hour) => (
                  <div
                    key={hour}
                    onClick={() => openModal(`${dateString}T${hour.toString().padStart(2, '0')}:00`)} // Add this onClick
                    className="h-20 border-b hover:bg-gray-50 flex-shrink-0 cursor-pointer"
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeekGrid;