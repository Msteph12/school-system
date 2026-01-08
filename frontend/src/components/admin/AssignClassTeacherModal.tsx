"use client";

import { useEffect, useState } from "react";
import { assignClassTeacher } from "@/services/classTeachers";
import api from "@/services/api";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

interface Teacher {
  id: number;
  first_name: string;
  last_name: string;
}

interface Grade {
  id: number;
  name: string;
}

interface SchoolClass {
  id: number;
  name: string;
  grade_id: number;
}

export default function AssignClassTeacherModal({ onClose, onSuccess }: Props) {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);

  const [teacherId, setTeacherId] = useState<number | "">("");
  const [gradeId, setGradeId] = useState<number | "">("");
  const [classId, setClassId] = useState<number | "">("");

  useEffect(() => {
    const load = async () => {
      const [t, g, c] = await Promise.all([
        api.get("/teachers"),
        api.get("/grades"),
        api.get("/classes"),
      ]);

      setTeachers(t.data);
      setGrades(g.data);
      setClasses(c.data);
    };

    load();
  }, []);

  const submit = async () => {
    if (!teacherId || !gradeId || !classId) return;

    await assignClassTeacher({
      teacher_id: teacherId,
      grade_id: gradeId,
      class_id: classId,
    });

    onSuccess();
    onClose();
  };

  const filteredClasses = classes.filter(c => c.grade_id === gradeId);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 space-y-4">
        <h2 className="text-lg font-semibold">Assign Class Teacher</h2>

        {/* Teacher */}
        <select
          className="w-full border rounded p-2"
          value={teacherId}
          onChange={e => setTeacherId(Number(e.target.value))}
        >
          <option value="">Select Teacher</option>
          {teachers.map(t => (
            <option key={t.id} value={t.id}>
              {t.first_name} {t.last_name}
            </option>
          ))}
        </select>

        {/* Grade */}
        <select
          className="w-full border rounded p-2"
          value={gradeId}
          onChange={e => {
            setGradeId(Number(e.target.value));
            setClassId("");
          }}
        >
          <option value="">Select Grade</option>
          {grades.map(g => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>

        {/* Class */}
        <select
          className="w-full border rounded p-2"
          value={classId}
          onChange={e => setClassId(Number(e.target.value))}
          disabled={!gradeId}
        >
          <option value="">Select Class</option>
          {filteredClasses.map(c => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-3 pt-4">
          <button onClick={onClose} className="text-gray-600">
            Cancel
          </button>
          <button
            onClick={submit}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Assign
          </button>
        </div>
      </div>
    </div>
  );
}
