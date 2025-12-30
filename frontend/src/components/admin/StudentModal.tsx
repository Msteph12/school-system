"use client";

import { useEffect, useState } from "react";
import { addStudent, updateStudent } from "@/services/students";
import { getGrades } from "@/services/grades";
import { getClasses } from "@/services/classes";

interface Student {
  id?: number;
  admission_number: string;
  first_name: string;
  last_name: string;
  gender?: string;
  status?: string;
  grade_id?: string;
  class_id?: string;
  guardian_name?: string;
  guardian_phone?: string;
  guardian_address?: string;
}

interface Grade {
  id: number;
  name: string;
}

interface Class {
  id: number;
  name: string;
}

interface Props {
  mode: "add" | "edit" | "view";
  student?: Student | null;
  onClose: () => void;
  onSuccess: () => void;
}

const emptyForm: Student = {
  admission_number: "",
  first_name: "",
  last_name: "",
  gender: "",
  status: "",
  grade_id: "",
  class_id: "",
  guardian_name: "",
  guardian_phone: "",
  guardian_address: "",
};

const StudentModal = ({ mode, student, onClose, onSuccess }: Props) => {
  const readOnly = mode === "view";

  const [form, setForm] = useState<Student>(emptyForm);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load dropdown data
  useEffect(() => {
    getGrades().then(res => setGrades(res.data));
    getClasses().then(res => setClasses(res.data));
  }, []);

  // Init form when modal opens
  useEffect(() => {
    if ((mode === "edit" || mode === "view") && student) {
      setForm({
        ...student,
        grade_id: student.grade_id?.toString() || "",
        class_id: student.class_id?.toString() || "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [mode, student]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!form.admission_number) return "Admission number is required";
    if (!form.first_name) return "First name is required";
    if (!form.last_name) return "Last name is required";
    if (!form.grade_id) return "Grade is required";
    if (!form.class_id) return "Class is required";
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const payload = {
      admission_number: form.admission_number,
      first_name: form.first_name,
      last_name: form.last_name,
      gender: form.gender,
      status: form.status,
      grade_id: form.grade_id,
      class_id: form.class_id,
      guardian_name: form.guardian_name,
      guardian_phone: form.guardian_phone,
      guardian_address: form.guardian_address,
    };

    try {
      if (mode === "add") await addStudent(payload);
      if (mode === "edit" && student?.id)
        await updateStudent(student.id, payload);

      onSuccess();
      onClose();
    } catch {
      setError("Failed to save student. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">
          {mode === "add" && "Add Student"}
          {mode === "edit" && "Edit Student"}
          {mode === "view" && "View Student"}
        </h2>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 p-2 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <input name="admission_number" value={form.admission_number} onChange={handleChange} readOnly={readOnly} placeholder="Admission No" className="border p-2 rounded col-span-2" />
          <input name="first_name" value={form.first_name} onChange={handleChange} readOnly={readOnly} placeholder="First Name" className="border p-2 rounded" />
          <input name="last_name" value={form.last_name} onChange={handleChange} readOnly={readOnly} placeholder="Last Name" className="border p-2 rounded" />

          {!readOnly ? (
            <select name="gender" value={form.gender} onChange={handleChange} className="border p-2 rounded">
              <option value="">Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          ) : (
            <input value={form.gender} readOnly className="border p-2 rounded" />
          )}

          {!readOnly ? (
            <select name="status" value={form.status} onChange={handleChange} className="border p-2 rounded">
              <option value="">Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="transferred">Transferred</option>
            </select>
          ) : (
            <input value={form.status} readOnly className="border p-2 rounded" />
          )}

          {!readOnly ? (
            <select name="grade_id" value={form.grade_id} onChange={handleChange} className="border p-2 rounded">
              <option value="">Select Grade</option>
              {grades.map(g => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          ) : (
            <input value={form.grade_id} readOnly className="border p-2 rounded" />
          )}

          {!readOnly ? (
            <select name="class_id" value={form.class_id} onChange={handleChange} className="border p-2 rounded">
              <option value="">Select Class</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          ) : (
            <input value={form.class_id} readOnly className="border p-2 rounded" />
          )}

          <input name="guardian_name" value={form.guardian_name} onChange={handleChange} readOnly={readOnly} placeholder="Guardian Name" className="border p-2 rounded col-span-2" />
          <input name="guardian_phone" value={form.guardian_phone} onChange={handleChange} readOnly={readOnly} placeholder="Guardian Phone" className="border p-2 rounded col-span-2" />
          <input name="guardian_address" value={form.guardian_address} onChange={handleChange} readOnly={readOnly} placeholder="Guardian Address" className="border p-2 rounded col-span-2" />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="border px-4 py-2 rounded">
            Close
          </button>

          {!readOnly && (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-red-500 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentModal;
