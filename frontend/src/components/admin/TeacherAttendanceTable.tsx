import { useEffect, useState } from "react";
import api from "@/services/api";

type TeacherAttendance = {
  id: number;
  teacher_name: string;
  date: string;
  status: "present" | "absent" | "on_leave";
  check_in_time?: string | null;
  check_out_time?: string | null;
};

export default function TeacherAttendanceTable() {
  const [records, setRecords] = useState<TeacherAttendance[]>([]);

  /* Load attendance history */
  useEffect(() => {
    api.get("/teacher-attendance").then(res => {
      setRecords(res.data);
    });
  }, []);

  return (
    <div className="bg-white rounded shadow overflow-x-auto p-4 space-y-4">
      <h3 className="text-xl font-semibold">Attendance History</h3>

      <table className="w-full text-sm border">
        <thead className="bg-red-100">
          <tr>
            <th className="p-2 text-left">Teacher</th>
            <th className="p-2">Date</th>
            <th className="p-2">Status</th>
            <th className="p-2">Check In</th>
            <th className="p-2">Check Out</th>
          </tr>
        </thead>

        <tbody>
          {records.length === 0 && (
            <tr>
              <td colSpan={5} className="p-4 text-center text-gray-500">
                No records found
              </td>
            </tr>
          )}

          {records.map(r => (
            <tr key={r.id} className="border-t">
              <td className="p-2">{r.teacher_name}</td>
              <td className="p-2">{r.date}</td>
              <td className="p-2 capitalize">{r.status}</td>
              <td className="p-2">{r.check_in_time ?? "-"}</td>
              <td className="p-2">{r.check_out_time ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
