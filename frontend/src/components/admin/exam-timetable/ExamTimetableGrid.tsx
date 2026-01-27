"use client";

import type { ExamTimetable } from "@/types/examTimetable";

interface Props {
  timetable: ExamTimetable | null;
  grade?: string;
  examType?: string;
  calculatedDays?: string[]; 
}

const ExamTimetableGrid = ({ timetable, grade = "", examType = "", calculatedDays }: Props) => {
  if (!timetable) {
    return (
      <div className="text-center text-gray-400 py-12">
        No exam timetable created yet. Click "Create Timetable" to start.
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

  // Get unique days from entries
  const getUniqueDays = () => {
    if (calculatedDays && calculatedDays.length > 0) {
      return calculatedDays;
    }

    const daysSet = new Set(timetable.entries.map(entry => entry.day));
    return Array.from(daysSet).sort((a, b) => {
      const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      return dayOrder.indexOf(a) - dayOrder.indexOf(b);
    });
  };

  const days = getUniqueDays();

   return (
    <div
      id="timetable-print-area"  
      className="overflow-x-auto shadow-sm rounded-lg shadow-red-200 print:overflow-visible print:shadow-none"
    >
      {/* Add title section here */}
      {(grade || examType) && (
        <div className="mb-4 print:mb-2">
          <h2 className="text-xl font-bold text-center text-gray-800 print:text-lg">
            {examType} {grade && `- ${grade}`} Exam Timetable
          </h2>
          {timetable.startDate && timetable.endDate && (
            <p className="text-center text-gray-600 text-sm print:text-xs">
              {new Date(timetable.startDate).toLocaleDateString()} - {new Date(timetable.endDate).toLocaleDateString()}
            </p>
          )}
        </div>
      )}

     <table className="w-full border-collapse mt-4 print:text-black print:text-sm">
        <thead>
          <tr>
            <th className="border p-2 bg-gray-100 w-32">Day / Time</th> 
            {timetable.timeSlots.sort((a, b) => a.startTime.localeCompare(b.startTime)).map((slot, index) =>(
              <th key={slot.id || index} className="border p-2 text-sm w-48">
                {slot.startTime} - {slot.endTime}
                {slot.type === 'break' && ' (Break)'}
                {slot.type === 'lunch' && ' (Lunch)'}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {days.map((day, index) => (
            <tr key={`${day}-${index}`} className="print:break-inside-avoid">
              <td className="border p-2 font-medium text-center align-middle w-32">{day}</td>
              {timetable.timeSlots
              .sort((a, b) => a.startTime.localeCompare(b.startTime))
              .map((slot, slotIndex) => {
                // Check slot type for break/lunch
               if (slot.type === "break") {
                  return (
                    <td
                      key={`${day}-${slot.id}-break`}
                      className="border border-gray-200 p-0 align-middle bg-yellow-50 w-20"
                    >
                      <div className="h-full flex flex-col justify-center items-center bg-yellow-50">
                        <div className="text-2xl font-bold text-yellow-700">B</div>
                        <div className="text-xs text-yellow-600">Break</div>
                      </div>
                    </td>
                  );
                }

                if (slot.type === "lunch") {
                  return (
                    <td
                      key={`${day}-${slot.id}-lunch`}
                      className="border border-gray-200 p-0 align-middle bg-green-50 w-20"
                    >
                      <div className="h-full flex flex-col justify-center items-center bg-green-50">
                        <div className="text-2xl font-bold text-green-700">L</div>
                        <div className="text-xs text-green-600">Lunch</div>
                      </div>
                    </td>
                  );
                }
                // For exam slots - find matching entry using timeSlotId
                const entry = timetable.entries.find(
                  (e) => e.day === day && e.timeSlotId === (slot.id || slotIndex + 1)
                );

                return (
                  <td key={`${day}-${slot.id || slotIndex}`} className="border h-20 w-48 align-top">
                    {entry ? (
                      <div className={`h-full p-2 ${entry.paperLabel && entry.paperLabel.trim() !== '' ? 'flex flex-col justify-center items-center' : 'flex items-center justify-center'} text-center`}>
                        <div className="font-semibold text-blue-800">{entry.subjectName}</div>
                        {entry.paperLabel && entry.paperLabel.trim() !== '' && (
                          <div className="text-sm text-gray-600 mt-1">{entry.paperLabel}</div>
                        )}
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center text-gray-400">
                        -
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

export default ExamTimetableGrid;