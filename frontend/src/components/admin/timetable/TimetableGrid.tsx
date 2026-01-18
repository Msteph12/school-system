"use client";

import TimetableCell from "@/components/admin/timetable/TimetableCell";
import type { Timetable } from "@/types/timetable";

interface Props {
  timetable: Timetable | null;
}

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const timeSlots = [
  { id: 1, label: "08:00 - 08:40", type: "lesson" },
  { id: 2, label: "08:40 - 09:20", type: "lesson" },
  { id: 3, label: "09:20 - 09:40", type: "break" },
];

const breakLetters = ["B", "R", "E", "A", "K"];

const TimetableGrid = ({ timetable }: Props) => {
    void timetable; // placeholder to avoid unused prop warning
    
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse shadow-sm mt-3">
        <thead>
          <tr>
            <th className="border bg-gray-100 p-3 text-sm">Day / Time</th>
            {timeSlots.map((slot) => (
              <th
                key={slot.id}
                className="border bg-gray-100 p-3 text-sm text-center"
              >
                {slot.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {days.map((day, dayIndex) => (
            <tr key={day}>
              {/* Day column */}
              <td className="border bg-gray-50 p-3 font-medium text-sm">
                {day}
              </td>

              {timeSlots.map((slot) => {
                if (slot.type === "break") {
                  // Render break cell ONLY once (Monday)
                  if (dayIndex === 0) {
                    return (
                      <td
                        key={slot.id}
                        rowSpan={days.length}
                        className="p-0 text-center align-middle"
                      >
                        <div className="h-full flex flex-col justify-around font-bold text-gray-400">
                          {breakLetters.map((letter) => (
                            <span key={letter}>{letter}</span>
                          ))}
                        </div>
                      </td>
                    );
                  }
                  return null; // skip break cell for other days
                }

                return (
                  <td
                    key={slot.id}
                    className="border p-3 h-24 align-top text-sm"
                  >
                    <TimetableCell
                      subject="Math"
                      teacher={null}
                      room={null}
                    />
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
