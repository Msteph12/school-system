import { useEffect, useState } from "react";
import api from "@/services/api";
import { AxiosError } from "axios";

interface Props {
  onClose: () => void;
  onSuccess?: () => void;
}

interface AttendanceForm {
  grade_id: number | "";
  class_id: number | "";
  admission_number: string;
  status: "reported" | "sent_home" | "returned" | "withdrawn";
  from_date: string;
  to_date: string | null;
  reason: string;
  remarks: string;
}

interface Grade {
  id: number;
  name: string;
}

interface ClassItem {
  id: number;
  name: string;
}

export default function RecordAttendanceModal({ onClose, onSuccess }: Props) {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<AttendanceForm>({
    grade_id: "",
    class_id: "",
    admission_number: "",
    status: "reported",
    from_date: "",
    to_date: null,
    reason: "",
    remarks: "",
  });

  useEffect(() => {
    api.get("/grades").then(res => setGrades(res.data));
  }, []);

  useEffect(() => {
    if (!form.grade_id) {
      setClasses([]);
      return;
    }

    const fetchClasses = async () => {
      try {
        const res = await api.get(`/classes?grade_id=${form.grade_id}`);
        setClasses(res.data);
      } catch (err) {
        console.error("Failed to fetch classes:", err);
      }
    };

    fetchClasses();
  }, [form.grade_id]);

  const isFormValid = 
    form.grade_id && 
    form.class_id && 
    form.admission_number && 
    form.from_date;

  const submit = async () => {
    if (!isFormValid) return;

    setLoading(true);
    setError(null);

    try {
      await api.post("/student-attendance", form);
      
      // Call parent success callback if provided
      if (onSuccess) {
        onSuccess();
      } else {
        // Fallback to reload if no callback provided
        window.location.reload();
      }
      
      onClose();
    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string }>;

      setError(
        error.response?.data?.message || 
        "Failed to save attendance. Please check all fields and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[600px] p-6 space-y-4">
        <h1 className="text-lg font-semibold">Record Attendance</h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Grade *</label>
            <select
              value={form.grade_id}
              onChange={e =>
                setForm({ ...form, grade_id: Number(e.target.value), class_id: "" })
              }
              className="w-full border p-2 rounded"
            >
              <option value="">Select Grade</option>
              {grades.map(g => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Class *</label>
            <select
              value={form.class_id}
              disabled={!form.grade_id}
              onChange={e =>
                setForm({ ...form, class_id: Number(e.target.value) })
              }
              className="w-full border p-2 rounded disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Select Class</option>
              {classes.map(cls => (
                <option key={cls.id} value={cls.id}>{cls.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Admission Number *</label>
            <input
              placeholder="e.g., ADM001"
              className="w-full border p-2 rounded"
              onChange={e => setForm({ ...form, admission_number: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Status *</label>
            <select
              value={form.status}
              onChange={e =>
                setForm({ ...form, status: e.target.value as AttendanceForm["status"] })
              }
              className="w-full border p-2 rounded"
            >
              <option value="reported">Reported</option>
              <option value="sent_home">Sent Home</option>
              <option value="returned">Returned</option>
              <option value="withdrawn">Withdrawn</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">From Date *</label>
            <input
              type="date"
              className="w-full border p-2 rounded"
              onChange={e => setForm({ ...form, from_date: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">To Date</label>
            <input
              type="date"
              className="w-full border p-2 rounded"
              onChange={e => setForm({ ...form, to_date: e.target.value || null })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Reason</label>
            <input
              placeholder="e.g., Sick, Fees Arrears"
              className="w-full border p-2 rounded"
              onChange={e => setForm({ ...form, reason: e.target.value })}
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Remarks (optional)</label>
            <textarea
              className="w-full border p-2 rounded"
              placeholder="Additional notes..."
              onChange={e => setForm({ ...form, remarks: e.target.value })}
              rows={3}
            />
          </div>
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
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed" 
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