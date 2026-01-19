"use client";

import { useState } from "react";
import TopBar from "@/components/admin/TopBar";
import PageHeader from "@/components/admin/timetable/PageHeader";
import TimetableControls from "@/components/admin/timetable/TimetableControls";
import TimetableGrid from "@/components/admin/timetable/TimetableGrid";
import type { Timetable, TimeSlot } from "@/types/timetable";
import { timetableService } from "@/services/timetable";

const TimetablePage = () => {
  const [timetable, setTimetable] = useState<Timetable | null>(null);
  const [loading, setLoading] = useState<"create" | "auto" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
  setError(null);
  setLoading("create");
  try {
    const data = await timetableService.create(0);
    console.log("Created timetable:", data); // Add this
    console.log("Time slots count:", data.timeSlots.length); // Add this
    setTimetable(data);
  } catch (err) {
    setError("Failed to create timetable. Please try again.");
    console.error("Create timetable error:", err);
  } finally {
    setLoading(null);
  }
};

  const handleAutoGenerate = async () => {
    setError(null);
    setLoading("auto");
    try {
      const data = await timetableService.autoGenerate(0);
      setTimetable(data);
    } catch (err) {
      setError("Failed to auto-generate timetable. Please try again.");
      console.error("Auto-generate error:", err);
    } finally {
      setLoading(null);
    }
  };

  const handleSaveTimeSlots = (slots: TimeSlot[]) => {
    setTimetable((prev) =>
      prev ? { ...prev, timeSlots: slots } : prev
    );
  };

  return (
    <div className="space-y-6">
      <TopBar />

      <div className="flex items-center justify-between px-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          School Timetable
        </h1>
      </div>

      <div className="px-6 py-4 space-y-4">
        <PageHeader />

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded">
            {error}
          </div>
        )}

        <TimetableControls
          onCreate={handleCreate}
          onAutoGenerate={handleAutoGenerate}
          timeSlots={timetable?.timeSlots ?? []}
          onSaveTimeSlots={handleSaveTimeSlots}
          loading={loading}
        />

        <TimetableGrid timetable={timetable} />
      </div>
    </div>
  );
};

export default TimetablePage;