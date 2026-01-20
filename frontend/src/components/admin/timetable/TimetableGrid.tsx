"use client";

import TimetableCell from "@/components/admin/timetable/TimetableCell";
import type { Timetable } from "@/types/timetable";

interface Props {
  timetable: Timetable | null;
}

const TimetableGrid = ({ timetable }: Props) => {
  if (!timetable) {
    return (
      <div className="text-center text-gray-400 py-12">
        No timetable created yet. Click "Create Timetable" to start.
      </div>
    );
  }

  if (timetable.timeSlots.length === 0) {
    return (
      <div className="text-center text-gray-400 py-12">
        No time slots configured. Click "+ Time Slots" to add time slots.
      </div>
    );
  }

  // Get days from timetable entries or use default
  const getUniqueDays = () => {
    const daysSet = new Set(timetable.entries.map(entry => entry.day));
    return Array.from(daysSet).sort((a, b) => {
      const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
      return dayOrder.indexOf(a) - dayOrder.indexOf(b);
    });
  };

  const days = getUniqueDays();
  const breakLetters = ["B", "R", "E", "A", "K"];
  const lunchLetters = ["L", "U", "N", "C", "H"];

  return (
    <div className="overflow-x-auto shadow-sm rounded-lg shadow-red-200">
      <table className="w-full border-collapse mt-4">
        <thead>
          <tr>
            <th className="border p-2 bg-gray-100">Day / Time</th>
            {timetable.timeSlots.map((slot) => (
              <th key={slot.id} className="border p-2 text-sm">
                {slot.startTime} - {slot.endTime}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {days.map((day, dayIndex) => (
            <tr key={day}>
              <td className="border p-2 font-medium">{day}</td>
              {timetable.timeSlots.map((slot) => {
                // Check if this slot is break/lunch or lesson based on type from API
                if (slot.type === "break") {
                  return (
                    <td
                      key={`${day}-${slot.id}`}
                      className="border-l border-r border-gray-200 p-0 align-middle bg-yellow-50"
                    >
                      <div className="h-full flex flex-col justify-center items-center bg-yellow-50">
                        <div className="text-2xl font-bold text-yellow-700">
                          {breakLetters[dayIndex] || "B"}
                        </div>
                      </div>
                    </td>
                  );
                }

                if (slot.type === "lunch") {
                  return (
                    <td
                      key={`${day}-${slot.id}`}
                      className="border-l border-r border-gray-200 p-0 align-middle bg-green-50"
                    >
                      <div className="h-full flex flex-col justify-center items-center bg-green-50">
                        <div className="text-2xl font-bold text-green-700">
                          {lunchLetters[dayIndex] || "L"}
                        </div>
                      </div>
                    </td>
                  );
                }

                // For lessons - find matching entry
                const entry = timetable.entries.find(
                  (e) => e.day === day && e.timeSlotId === slot.id
                );

                return (
                  <td key={`${day}-${slot.id}`} className="border h-20">
                    {entry?.subject ? (
                      <TimetableCell
                        subject={entry.subject}
                        teacher={entry.teacher}
                        room={entry.room}
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center text-gray-400">
                        Empty
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TimetableGrid;