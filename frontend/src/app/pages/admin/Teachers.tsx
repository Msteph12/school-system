"use client";

import { useCallback, useEffect, useState } from "react";
import TopBar from "@/components/admin/TopBar";
import TeachersTable from "@/components/admin/TeachersTable";
import TeacherModal from "@/components/admin/TeacherModal";
import { getTeachers } from "@/services/teachers";
import api from "@/services/api";
import type { TeacherFull, TeacherListItem } from "@/types/teacher";

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

      {/* Quick Actions (kept – you can update later) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-4 rounded shadow-md">
        <div className="bg-blue-100 text-blue-800 p-4 rounded-lg">
          <h3 className="font-semibold">Total Teachers</h3>
          <p className="text-sm">Overview of teaching staff</p>
        </div>

        <div className="bg-blue-100 text-blue-800 p-4 rounded-lg">
          <h3 className="font-semibold">Departments</h3>
          <p className="text-sm">Organize by subject areas</p>
        </div>

        <div className="bg-blue-100 text-blue-800 p-4 rounded-lg">
          <h3 className="font-semibold">Assignments</h3>
          <p className="text-sm">Classes & subjects allocation</p>
        </div>
      </div>

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
