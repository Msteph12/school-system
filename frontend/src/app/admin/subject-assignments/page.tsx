"use client";

import { useEffect, useState } from "react";
import TopBar from "@/components/admin/TopBar";
import SubjectAssignmentsTable from "@/components/admin/subjectAssignmentsTable";
import AssignSubjectModal from "@/components/admin/AssignSubjectModal";
import { getSubjectAssignments, removeSubjectAssignment } from "@/services/subjectAssignment";
import type { SubjectAssignment } from "@/types/subjectAssignment";

export default function SubjectAssignmentsPage() {
  const [data, setData] = useState<SubjectAssignment[]>([]);
  const [open, setOpen] = useState(false);

  const load = async () => {
    const res = await getSubjectAssignments();
    setData(res.data);
  };

  useEffect(() => {
  const fetchAssignments = async () => {
    const res = await getSubjectAssignments();
    setData(res.data);
  };

  fetchAssignments();
}, []);

  const remove = async (id: number) => {
    await removeSubjectAssignment(id);
    load();
  };

  return (
    <div className="space-y-6">
      <TopBar />

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Subject Assignments</h1>
        <button onClick={() => setOpen(true)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          + Assign Subject
        </button>
        <button
          onClick={() => window.history.back()}
          className="text-blue-600 mr-5 hover:underline"
        >
          ← Back
        </button>
      </div>

      <SubjectAssignmentsTable data={data} onDelete={remove} />

      {open && <AssignSubjectModal onClose={() => setOpen(false)} onSuccess={load} />}
    </div>
  );
}
