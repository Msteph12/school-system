import { useState } from "react";
import Topbar from "@/components/admin/TopBar";
import StudentAttendanceTable from "@/components/admin/StudentAttendanceTable";
import RecordAttendanceModal from "@/components/admin/RecordAttendanceModal";
import QuickNavCards from "@/components/common/QuickNavCards";
import type { QuickNavCard } from "@/types/result";

export default function StudentAttendancePage() {
  const [open, setOpen] = useState(false);

  // Quick navigation cards data
  const quickNavCards: QuickNavCard[] = [
    {
      title: "Student Promotion",
      description: "Promote students to next class",
      onClick: () => (window.location.href = "/admin/students-promotion"),
      gradient: "from-blue-500 to-blue-700",
    },
    {
      title: "Promotion History",
      description: "View past promotions",
      onClick: () =>
        (window.location.href = "/admin/students-promotion/history"),
      gradient: "from-green-500 to-green-700",
    },
    {
      title: "Student Attendance",
      description: "View & record attendance",
      onClick: () => (window.location.href = "/admin/student-attendance"),
      gradient: "from-purple-500 to-purple-700",
    },
  ];

  return (
    <div className="space-y-6">
      <Topbar />
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Student Attendance</h1>
        <button
          onClick={() => window.history.back()}
          className="text-blue-600 mr-5 hover:underline"
        >
          ← Back
        </button>
      </div>

      {/* Quick navigation cards */}
      <QuickNavCards cards={quickNavCards} />

      {/* Action button */}
      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded shadow-md shadow-red-200">
        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          onClick={() => setOpen(true)}
        >
          + Record Attendance
        </button>
      </div>

      {/* Table = history */}
      <StudentAttendanceTable />

      {/* Modal */}
      {open && <RecordAttendanceModal onClose={() => setOpen(false)} />}
    </div>
  );
}