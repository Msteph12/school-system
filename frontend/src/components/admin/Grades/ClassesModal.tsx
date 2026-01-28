"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";

type ClassStatus = "active" | "inactive";

interface ClassesModalProps {
  onClose: () => void;
  onSuccess: () => void;
  editingClass?: {
    id: string;
    grade_id: string;
    name: string;
    status: ClassStatus;
    teacher_id?: string | null;
    capacity?: number | null;
  } | null;
}

interface Grade {
  id: string;
  name: string;
  code: string;
  status: string;
}

interface Teacher {
  id: string;
  name: string;
  status?: string;
}

interface ClassFormData {
  grade_id: string;
  name: string;
  status: ClassStatus;
  teacher_id: string | null;
  capacity?: number | null;
}

const ClassesModal = ({
  onClose,
  onSuccess,
  editingClass,
}: ClassesModalProps) => {
  const [gradeId, setGradeId] = useState<string>(
    editingClass?.grade_id ?? ""
  );
  const [className, setClassName] = useState<string>(
    editingClass?.name ?? ""
  );
  const [teacherId, setTeacherId] = useState<string>(
    editingClass?.teacher_id ?? ""
  );
  const [capacity, setCapacity] = useState<number | "">(
    editingClass?.capacity ?? ""
  );
  const [status, setStatus] = useState<ClassStatus>(
    editingClass?.status ?? "active"
  );

  const [grades, setGrades] = useState<Grade[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  /* ---------------- FETCH DATA ---------------- */

  useEffect(() => {
    fetchGrades();
    fetchTeachers();
  }, []);

  const fetchGrades = async () => {
    const res = await api.get("/grades");
    setGrades(res.data.grades ?? res.data);
  };

  const fetchTeachers = async () => {
    const res = await api.get("/teachers");
    setTeachers(res.data.teachers ?? res.data);
  };

  /* ---------------- VALIDATION ---------------- */

  const validate = (): boolean => {
    const e: Record<string, string> = {};

    if (!gradeId) e.grade_id = "Grade is required";
    if (!className.trim()) e.name = "Class name is required";
    if (!teacherId) e.teacher_id = "Class teacher is required";
    if (capacity !== "" && Number(capacity) < 1) {
      e.capacity = "Capacity must be at least 1";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ---------------- SAVE ---------------- */

  const handleSave = async () => {
    if (!validate()) return;

    setIsLoading(true);

    const payload: ClassFormData = {
      grade_id: gradeId,
      name: className.trim(),
      status,
      teacher_id: teacherId || null,
      capacity: capacity === "" ? null : Number(capacity),
    };

    try {
      if (editingClass) {
        await api.put(`/school-classes/${editingClass.id}`, payload);
      } else {
        await api.post("/school-classes", payload);
      }

      onSuccess();
      onClose();
    } catch (err: unknown) {
      const error = err as { response?: { status?: number } };

      if (error?.response?.status === 409) {
        setErrors({ name: "Class name already exists in this grade" });
      } else {
        alert("Failed to save class");
      }
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-lg rounded-lg p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {editingClass ? "Edit Class" : "Add Class"}
          </h2>
          <button onClick={onClose}>✕</button>
        </div>

        {/* Grade */}
        <div>
          <label className="block mb-1">Grade *</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={gradeId}
            onChange={(e) => setGradeId(e.target.value)}
          >
            <option value="">Select grade</option>
            {grades.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name} ({g.code})
              </option>
            ))}
          </select>
          {errors.grade_id && (
            <p className="text-red-500 text-sm">{errors.grade_id}</p>
          )}
        </div>

        {/* Name */}
        <div>
          <label className="block mb-1">Class Name *</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name}</p>
          )}
        </div>

        {/* Teacher */}
        <div>
          <label className="block mb-1">Class Teacher *</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={teacherId}
            onChange={(e) => setTeacherId(e.target.value)}
          >
            <option value="">Select teacher</option>
            {teachers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
          {errors.teacher_id && (
            <p className="text-red-500 text-sm">{errors.teacher_id}</p>
          )}
        </div>

        {/* Capacity */}
        <div>
          <label className="block mb-1">Capacity</label>
          <input
            type="number"
            className="w-full border rounded px-3 py-2"
            value={capacity}
            onChange={(e) => setCapacity(e.target.valueAsNumber || "")}
          />
        </div>

       {/* Status */}
        <div>
          <label className="block mb-1">Status</label>
          <div className="flex gap-4">
            <label>
              <input
                type="radio"
                checked={status === "active"}
                onChange={() => setStatus("active")}
              />{" "}
              Active
            </label>
            <label>
              <input
                type="radio"
                checked={status === "inactive"}
                onChange={() => setStatus("inactive")}
              />{" "}
              Inactive
            </label>
          </div>
        </div>


        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {isLoading
              ? "Saving..."
              : editingClass
              ? "Update Class"
              : "Create Class"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClassesModal;
