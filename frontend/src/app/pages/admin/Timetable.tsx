"use client";

import { useState } from "react";
import TopBar from "@/components/admin/TopBar";
import PageHeader from "@/components/admin/timetable/PageHeader";
import TimetableControls from "@/components/admin/timetable/TimetableControls";
import TimetableGrid from "@/components/admin/timetable/TimetableGrid";
import type { Timetable } from "@/types/timetable";

const TimetablePage = () => {
  const [timetable ] = useState<Timetable | null>(null);

  return (
    <div className="space-y-6">
      {/* Top Navigation */}
      <TopBar />

      {/* Page Title */}
      <div className="flex items-center justify-between px-6">
        <h1 className="text-2xl font-semibold text-gray-800">School Timetable</h1>
        <button
          onClick={() => window.history.back()}
          className="text-blue-600 hover:underline"
        >
          ← Back
        </button>
      </div>

      {/* Page Content */}
      <div className="px-6 py-4 space-y-4">
        <PageHeader />

        <TimetableControls />

        <TimetableGrid timetable={timetable} />
      </div>
    </div>
  );
};

export default TimetablePage;
