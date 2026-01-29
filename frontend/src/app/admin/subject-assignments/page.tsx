"use client";

import { useEffect, useState } from "react";
import TopBar from "@/components/admin/TopBar";
import SubjectAssignmentsTable from "@/components/admin/subjectAssignmentsTable";
import AssignSubjectModal from "@/components/admin/AssignSubjectModal";
import QuickNavCards from "@/components/common/QuickNavCards";
import { getSubjectAssignments, removeSubjectAssignment } from "@/services/subjectAssignment";
import type { SubjectAssignment } from "@/types/subjectAssignment";
import type { QuickNavCard } from "@/types/result";

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

  // Quick navigation cards data
  const quickNavCards: QuickNavCard[] = [
        {
      title: "All Teachers",
      description: "Overview of all teachers",
      onClick: () => (window.location.href = "/admin/teachers"),
      gradient: "from-blue-500 to-blue-700",
    },
    {
      title: "Teacher Attendance",
      description: "Overview of teachers attendance",
      onClick: () => (window.location.href = "/admin/teachers-attendance"),
      gradient: "from-blue-500 to-blue-700",
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
      <TopBar />

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Subject Assignments</h1>
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
      <div className="flex items-center bg-white p-4 rounded shadow-md">
        <button 
          onClick={() => setOpen(true)} 
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          + Assign Subject
        </button>
      </div>

      <SubjectAssignmentsTable data={data} onDelete={remove} />

      {open && <AssignSubjectModal onClose={() => setOpen(false)} onSuccess={load} />}
    </div>
  );
}