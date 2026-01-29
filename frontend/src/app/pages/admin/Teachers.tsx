"use client";

import { useCallback, useEffect, useState } from "react";
import TopBar from "@/components/admin/TopBar";
import TeachersTable from "@/components/admin/TeachersTable";
import TeacherModal from "@/components/admin/TeacherModal";
import QuickNavCards from "@/components/common/QuickNavCards";
import { getTeachers } from "@/services/teachers";
import api from "@/services/api";
import type { TeacherFull, TeacherListItem } from "@/types/teacher";
import type { QuickNavCard } from "@/types/result";

const Teachers = () => {
  const [teachers, setTeachers] = useState<TeacherListItem[]>([]);
  const [modalMode, setModalMode] =
    useState<"add" | "edit" | "view" | null>(null);
  const [selectedTeacher, setSelectedTeacher] =
    useState<TeacherFull | null>(null);

  // LOAD TEACHERS
  const loadTeachers = useCallback(async () => {
    const res = await getTeachers();
    setTeachers(res.data);
  }, []);

    useEffect(() => {
    const fetchTeachers = async () => {
        const res = await getTeachers();
        setTeachers(res.data);
    };

    fetchTeachers();
    }, []);


  // VIEW
  const handleView = async (row: TeacherListItem) => {
  const res = await api.get(`/teachers/${row.id}`);

  setSelectedTeacher({
    id: res.data.id,
    staff_number: res.data.staff_number,
    first_name: res.data.first_name,
    last_name: res.data.last_name,
    phone: res.data.phone,
    email: res.data.email,
    department: res.data.department,
    status: res.data.status,
  });

  setModalMode("view");
};

  // EDIT
  const handleEdit = async (row: TeacherListItem) => {
    const res = await api.get(`/teachers/${row.id}`);
    setSelectedTeacher(res.data);
    setModalMode("edit");
  };

  // Quick navigation cards data
  const quickNavCards: QuickNavCard[] = [
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
        <h1 className="text-2xl font-semibold text-gray-800">Teachers</h1>
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
      <div className="flex items-center gap-4 bg-white p-4 rounded shadow-md">
        <button
          onClick={() => {
            setModalMode("add");
            setSelectedTeacher(null);
          }}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          + Add Teacher
        </button>
      </div>

      {/* Table */}
      <TeachersTable
        teachers={teachers}
        onView={handleView}
        onEdit={handleEdit}
      />

      {/* Modal */}
      {modalMode && (
        <TeacherModal
          mode={modalMode}
          teacher={selectedTeacher}
          onClose={() => {
            setModalMode(null);
            setSelectedTeacher(null);
          }}
          onSuccess={loadTeachers}
        />
      )}
    </div>
  );
};

export default Teachers;