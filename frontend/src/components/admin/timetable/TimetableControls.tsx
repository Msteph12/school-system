"use client";

import { useState } from "react";
import TimeSlotsModal from "@/components/admin/timetable/TimeSlotsModal";
import { timetableService } from "@/services/timetable";

const TimetableControls = () => {
  const [showTimeSlotsModal, setShowTimeSlotsModal] = useState(false);

  const handleAutoGenerate = async () => {
  try {
    // gradeId will come from PageHeader filter later
    await timetableService.autoGenerate(0);
    console.log("Timetable auto-generated");
  } catch {
    console.error("Auto-generate not implemented yet");
  }
};

  return (
    <>
      <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded shadow-sm shadow-red-200">
        <button className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700">
          + Create Timetable
        </button>

        <button
          onClick={handleAutoGenerate}
          className="px-4 py-2 text-sm bg-indigo-500 text-white rounded hover:bg-indigo-700"
        >
          Auto Generate
        </button>

        <button className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-red-200">
          Edit
        </button>

        <button className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-red-200">
          Duplicate
        </button>

        <button
          onClick={() => setShowTimeSlotsModal(true)}
          className="px-4 py-2 text-sm bg-emerald-500 text-white rounded hover:bg-green-800"
        >
          + Time Slots
        </button>

        <button className="px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-800">
          Publish
        </button>

        <div className="ml-auto flex gap-2">
          <button className="px-4 py-2 text-sm bg-blue-100 text-gray-700 rounded hover:bg-blue-300">
            Print
          </button>

          <button className="px-4 py-2 text-sm bg-blue-100 text-gray-700 rounded hover:bg-blue-300">
            Export
          </button>
        </div>
      </div>

      <TimeSlotsModal
        isOpen={showTimeSlotsModal}
        onClose={() => setShowTimeSlotsModal(false)}
      />
    </>
  );
};

export default TimetableControls;
