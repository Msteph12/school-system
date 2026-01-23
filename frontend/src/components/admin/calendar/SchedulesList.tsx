"use client";

const SCHEDULES = ["Exams", "Meetings", "Holidays"];

const SchedulesList = () => {
  return (
    <div className="p-4 flex-1">
      <h3 className="text-sm font-semibold mb-3">Schedules</h3>

      <ul className="space-y-2">
        {SCHEDULES.map((item) => (
          <li
            key={item}
            className="text-sm text-gray-700 cursor-pointer hover:underline"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SchedulesList;
