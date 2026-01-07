"use client";

import { useEffect, useState } from "react";
import { createTeacher, updateTeacher } from "@/services/teachers";

interface Teacher {
  id?: number;
  staff_number: string;
  first_name: string;
  last_name: string;
  phone?: string;
  email?: string;
  department?: string;
  status?: string;
}

interface Props {
  mode: "add" | "edit" | "view";
  teacher?: Teacher | null;
  onClose: () => void;
  onSuccess: () => void;
}

const emptyForm: Teacher = {
  staff_number: "",
  first_name: "",
  last_name: "",
  phone: "",
  email: "",
  department: "",
  status: "active",
};

const TeacherModal = ({ mode, teacher, onClose, onSuccess }: Props) => {
  const readOnly = mode === "view";

  const [form, setForm] = useState<Teacher>(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Init form
  useEffect(() => {
    if ((mode === "edit" || mode === "view") && teacher) {
      setForm(teacher);
    } else {
      setForm(emptyForm);
    }
  }, [mode, teacher]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!form.staff_number) return "Staff number is required";
    if (!form.first_name) return "First name is required";
    if (!form.last_name) return "Last name is required";
    if (!form.status) return "Status is required";
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
      staff_number: form.staff_number,
      first_name: form.first_name,
      last_name: form.last_name,
      phone: form.phone,
      email: form.email,
      department: form.department,
      status: form.status,
    };

    try {
      if (mode === "add") await createTeacher(payload);
      if (mode === "edit" && teacher?.id)
        await updateTeacher(teacher.id, payload);

      onSuccess();
      onClose();
    } catch {
      setError("Failed to save teacher. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">
          {mode === "add" && "Add Teacher"}
          {mode === "edit" && "Edit Teacher"}
          {mode === "view" && "View Teacher"}
        </h2>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 p-2 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <input
            name="staff_number"
            value={form.staff_number}
            onChange={handleChange}
            readOnly={readOnly}
            placeholder="Staff Number"
            className="border p-2 rounded col-span-2"
          />

          <input
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
            readOnly={readOnly}
            placeholder="First Name"
            className="border p-2 rounded"
          />

          <input
            name="last_name"
            value={form.last_name}
            onChange={handleChange}
            readOnly={readOnly}
            placeholder="Last Name"
            className="border p-2 rounded"
          />

          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            readOnly={readOnly}
            placeholder="Phone"
            className="border p-2 rounded"
          />

          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            readOnly={readOnly}
            placeholder="Email"
            className="border p-2 rounded"
          />

          <input
            name="department"
            value={form.department}
            onChange={handleChange}
            readOnly={readOnly}
            placeholder="Department"
            className="border p-2 rounded col-span-2"
          />

          {!readOnly ? (
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="border p-2 rounded col-span-2"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="on_leave">On Leave</option>
            </select>
          ) : (
            <input
              value={form.status}
              readOnly
              className="border p-2 rounded col-span-2"
            />
          )}
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

export default TeacherModal;
