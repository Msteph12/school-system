import { useState } from "react";
import Topbar from "@/components/admin/TopBar";
import StudentAttendanceTable from "@/components/admin/StudentAttendanceTable";
import RecordAttendanceModal from "@/components/admin/RecordAttendanceModal";

export default function StudentAttendancePage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-4">
      <Topbar />
      {/* Heading stays */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Student Attendance</h1>
        <button
          onClick={() => window.history.back()}
          className="text-blue-600 mr-5 hover:underline"
        >
          ← Back
        </button>
      </div>

      <div className="flex flex-wrap  items-center gap-4 bg-white p-4 rounded shadow-md shadow-red-200">
        {/* Button BELOW title */}
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
