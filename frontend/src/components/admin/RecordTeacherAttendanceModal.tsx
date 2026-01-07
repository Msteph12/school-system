import { useEffect, useState } from "react";
import api from "@/services/api";
import { AxiosError } from "axios";

interface Props {
  onClose: () => void;
  onSuccess?: () => void;
}

interface AttendanceForm {
  teacher_id: number | "";
  academic_year_id: number | "";
  date: string;
  status: "present" | "absent" | "on_leave";
  check_in_time: string | null;
  check_out_time: string | null;
}

interface Teacher {
  id: number;
  name: string;
}

interface AcademicYear {
  id: number;
  name: string;
}

export default function RecordTeacherAttendanceModal({
  onClose,
  onSuccess,
}: Props) {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [years, setYears] = useState<AcademicYear[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<AttendanceForm>({
    teacher_id: "",
    academic_year_id: "",
    date: "",
    status: "present",
    check_in_time: null,
    check_out_time: null,
  });

  /* Load teachers + academic years */
  useEffect(() => {
    api.get("/teachers").then(res => setTeachers(res.data));
    api.get("/academic-years").then(res => setYears(res.data));
  }, []);

  const isFormValid =
    form.teacher_id &&
    form.academic_year_id &&
    form.date &&
    (form.status !== "present" || form.check_in_time);

  const submit = async () => {
    if (!isFormValid) return;

    setLoading(true);
    setError(null);

    try {
      await api.post("/teacher-attendance", form);

      if (onSuccess) onSuccess();
      else window.location.reload();

      onClose();
    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string }>;
      setError(
        error.response?.data?.message ||
          "Failed to record attendance. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[600px] p-6 space-y-4">
        <h1 className="text-lg font-semibold">Record Teacher Attendance</h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Teacher *</label>
            <select
              className="w-full border p-2 rounded"
              value={form.teacher_id}
              onChange={e =>
                setForm({ ...form, teacher_id: Number(e.target.value) })
              }
            >
              <option value="">Select Teacher</option>
              {teachers.map(t => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Academic Year *
            </label>
            <select
              className="w-full border p-2 rounded"
              value={form.academic_year_id}
              onChange={e =>
                setForm({
                  ...form,
                  academic_year_id: Number(e.target.value),
                })
              }
            >
              <option value="">Select Year</option>
              {years.map(y => (
                <option key={y.id} value={y.id}>
                  {y.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Date *</label>
            <input
              type="date"
              className="w-full border p-2 rounded"
              onChange={e => setForm({ ...form, date: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Status *</label>
            <select
              className="w-full border p-2 rounded"
              value={form.status}
              onChange={e =>
                setForm({
                  ...form,
                  status: e.target.value as AttendanceForm["status"],
                  check_in_time: null,
                  check_out_time: null,
                })
              }
            >
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="on_leave">On Leave</option>
            </select>
          </div>

          {form.status === "present" && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Check In *
                </label>
                <input
                  type="time"
                  className="w-full border p-2 rounded"
                  onChange={e =>
                    setForm({ ...form, check_in_time: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Check Out
                </label>
                <input
                  type="time"
                  className="w-full border p-2 rounded"
                  onChange={e =>
                    setForm({ ...form, check_out_time: e.target.value })
                  }
                />
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            className="border px-4 py-2 rounded hover:bg-gray-50"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:bg-gray-400"
            onClick={submit}
            disabled={!isFormValid || loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
