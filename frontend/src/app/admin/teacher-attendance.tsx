import { useState } from "react";
import Topbar from "@/components/admin/TopBar";
import TeacherAttendanceTable from "@/components/admin/TeacherAttendanceTable";
import RecordTeacherAttendanceModal from "@/components/admin/RecordTeacherAttendanceModal";
import QuickNavCards from "@/components/common/QuickNavCards";
import type { QuickNavCard } from "@/types/result";

export default function TeacherAttendancePage() {
  const [open, setOpen] = useState(false);

  // Quick navigation cards data
  const quickNavCards: QuickNavCard[] = [
    {
      title: "All Teachers",
      description: "Overview of all teachers",
      onClick: () => (window.location.href = "/admin/teachers"),
      gradient: "from-blue-500 to-blue-700",
    },
    {
      title: "Subject Assignments",
      description: "Specify what teachers teaches",
      onClick: () => (window.location.href = "/admin/subject-assignments"),
      gradient: "from-green-500 to-green-700",
    },
    {
      title: "Class Teachers",
      description: "Class Teacher Allocation",
      onClick: () => (window.location.href = "/admin/class-teachers"),
      gradient: "from-purple-500 to-purple-700",
    },
  ];

  return (
    <div className="space-y-6">
      <Topbar />

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">
          Teacher Attendance
        </h1>
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
      <TeacherAttendanceTable />

      {/* Modal */}
      {open && (
        <RecordTeacherAttendanceModal onClose={() => setOpen(false)} />
      )}
    </div>
  );
}