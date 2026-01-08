"use client";

import { useEffect, useState } from "react";
import TopBar from "@/components/admin/TopBar";
import ClassTeachersTable from "@/components/admin/ClassTeachersTable";
import AssignClassTeacherModal from "@/components/admin/AssignClassTeacherModal";
import { getClassTeachers, unassignClassTeacher } from "@/services/classTeachers";
import type { ClassTeacher } from "@/types/classTeacher";

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

  return (
    <div className="space-y-6">
      <TopBar />

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Class Teachers</h1>

        <button
          onClick={() => setOpen(true)}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          + Assign Class Teacher
        </button>
        <button
          onClick={() => window.history.back()}
          className="text-blue-600 mr-5 hover:underline"
        >
          ← Back
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
