"use client";

import { useEffect, useState } from "react";
import TopBar from "@/components/admin/TopBar";
import ClassTeachersTable from "@/components/admin/ClassTeachersTable";
import AssignClassTeacherModal from "@/components/admin/AssignClassTeacherModal";
import QuickNavCards from "@/components/common/QuickNavCards";
import { getClassTeachers, unassignClassTeacher } from "@/services/classTeachers";
import type { ClassTeacher } from "@/types/classTeacher";
import type { QuickNavCard } from "@/types/result";

export default function ClassTeachersPage() {
  const [data, setData] = useState<ClassTeacher[]>([]);
  const [open, setOpen] = useState(false);

  // ✅ SAFE pattern (same as Subject Assignments)
  useEffect(() => {
    const fetchClassTeachers = async () => {
      const res = await getClassTeachers();
      setData(res.data);
    };

    fetchClassTeachers();
  }, []);

  // ✅ manual reload after actions
  const reload = async () => {
    const res = await getClassTeachers();
    setData(res.data);
  };

  const unassign = async (id: number) => {
    await unassignClassTeacher(id);
    reload();
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
      title: "Subject Assignments",
      description: "Specify what teachers teaches",
      onClick: () => (window.location.href = "/admin/subject-assignments"),
      gradient: "from-green-500 to-green-700",
    },
  ];

  return (
    <div className="space-y-6">
      <TopBar />

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Class Teachers</h1>
        <button
          onClick={() => window.history.back()}
          className="text-blue-600 mr-5 hover:underline"
        >
          ← Back
        </button>
      </div>

      {/* Quick navigation cards */}
      <QuickNavCards cards={quickNavCards} />

      {/* Actions */}
      <div className="flex items-center justify-between bg-white p-4 rounded shadow-md">
        <div></div> {/* Empty div to balance the layout */}
        <button
          onClick={() => setOpen(true)}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          + Assign Class Teacher
        </button>
      </div>

      <ClassTeachersTable data={data} onUnassign={unassign} />

      {open && (
        <AssignClassTeacherModal
          onClose={() => setOpen(false)}
          onSuccess={() => {
            setOpen(false);
            reload();
          }}
        />
      )}
    </div>
  );
}