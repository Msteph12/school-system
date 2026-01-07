import { useEffect, useState } from "react";
import api from "@/services/api";
import type { StudentAttendance } from "@/types/studentAttendance";

type Grade = {
  id: number;
  name: string;
};

type ClassItem = {
  id: number;
  name: string;
};

export default function StudentAttendanceTable() {
  const [records, setRecords] = useState<StudentAttendance[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);

  const [gradeId, setGradeId] = useState<number | "">("");
  const [classId, setClassId] = useState<number | "">("");

  /* Load grades */
  useEffect(() => {
    api.get("/grades").then(res => setGrades(res.data));
  }, []);

  /* Load classes when grade changes */
  useEffect(() => {
  if (!gradeId) return;

  let active = true;

  const fetchClasses = async () => {
    const res = await api.get(`/classes?grade_id=${gradeId}`);
    if (active) setClasses(res.data);
  };

  fetchClasses();

  return () => {
    active = false;
  };
}, [gradeId]);


  /* Load attendance (with filters) */
  useEffect(() => {
    const params: Record<string, number> = {};
    if (gradeId) params.grade_id = gradeId;
    if (classId) params.class_id = classId;

    api.get("/student-attendance", { params }).then(res => {
      setRecords(res.data);
    });
  }, [gradeId, classId]);

  return (
    <div className="bg-white rounded shadow overflow-x-auto p-4 space-y-4">
      <h3 className="text-xl font-semibold">Attendance History</h3>

      {/* Filters */}
      <div className="flex gap-4">
        <select
          className="border rounded px-2 py-1"
          value={gradeId}
          onChange={e => setGradeId(Number(e.target.value) || "")}
        >
          <option value="">Select Grade</option>
          {grades.map(g => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>

        <select
          className="border rounded px-2 py-1"
          value={classId}
          onChange={e => setClassId(Number(e.target.value) || "")}
          disabled={!gradeId}
        >
          <option value="">Select Class</option>
          {classes.map(c => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <table className="w-full text-sm border">
        <thead className="bg-red-100">
          <tr>
            <th className="p-2 text-left">Student</th>
            <th className="p-2">Status</th>
            <th className="p-2">Reason</th>
            <th className="p-2">From</th>
            <th className="p-2">To</th>
            <th className="p-2">Remarks</th>
          </tr>
        </thead>

        <tbody>
          {records.length === 0 && (
            <tr>
              <td colSpan={6} className="p-4 text-center text-gray-500">
                No records found
              </td>
            </tr>
          )}

          {records.map(r => (
            <tr key={r.id} className="border-t">
              <td className="p-2">{r.student_name}</td>
              <td className="p-2">{r.status}</td>
              <td className="p-2">{r.reason ?? "-"}</td>
              <td className="p-2">{r.from_date}</td>
              <td className="p-2">{r.to_date ?? "Ongoing"}</td>
              <td className="p-2">{r.remarks ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
