"use client";

import { useState } from "react";
import TimeSlotsModal from "@/components/admin/timetable/TimeSlotsModal";
import type { TimeSlot } from "@/types/timetable";

interface Props {
  onCreate: () => void;
  onAutoGenerate: () => void;
  timeSlots: TimeSlot[];
  onSaveTimeSlots: (slots: TimeSlot[]) => void;
  loading?: "create" | "auto" | null;
}

const TimetableControls = ({
  onCreate,
  onAutoGenerate,
  timeSlots,
  onSaveTimeSlots,
  loading = null,
}: Props) => {
  const [showTimeSlotsModal, setShowTimeSlotsModal] = useState(false);

  return (
    <>
      <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded shadow-sm">
        <button
          onClick={onCreate}
          disabled={loading === "create"}
          className="px-4 py-2 text-sm bg-red-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading === "create" ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating...
            </span>
          ) : (
            "+ Create Timetable"
          )}
        </button>

        <button
          onClick={onAutoGenerate}
          disabled={loading === "auto"}
          className="px-4 py-2 text-sm bg-indigo-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading === "auto" ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </span>
          ) : (
            "Auto Generate"
          )}
        </button>

        <button
          onClick={() => setShowTimeSlotsModal(true)}
          className="px-4 py-2 text-sm bg-emerald-500 text-white rounded"
        >
          + Time Slots
        </button>
      </div>

      <TimeSlotsModal
        key={showTimeSlotsModal ? "open" : "closed"} // Add this
        isOpen={showTimeSlotsModal}
        onClose={() => setShowTimeSlotsModal(false)}
        initialSlots={timeSlots}
        onSave={onSaveTimeSlots}
      />
    </>
  );
};

export default TimetableControls;