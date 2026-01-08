import { useEffect, useState } from "react";
import api from "@/services/api";
import { assignSubject } from "@/services/subjectAssignment";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

type Teacher = {
  id: number;
  first_name: string;
  last_name: string;
};

type Subject = {
  id: number;
  name: string;
};

type Grade = {
  id: number;
  name: string;
};

type AcademicYear = {
  id: number;
  name: string;
};

export default function AssignSubjectModal({ onClose, onSuccess }: Props) {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [grades, setGrades] = useState<Grade[]>([]);
    const [years, setYears] = useState<AcademicYear[]>([]);


  const [form, setForm] = useState({
    teacher_id: "",
    subject_id: "",
    grade_id: "",
    academic_year_id: "",
  });

  useEffect(() => {
    api.get("/teachers").then(r => setTeachers(r.data));
    api.get("/subjects").then(r => setSubjects(r.data));
    api.get("/grades").then(r => setGrades(r.data));
    api.get("/academic-years").then(r => setYears(r.data));
  }, []);

  const submit = async () => {
    await assignSubject({
      teacher_id: Number(form.teacher_id),
      subject_id: Number(form.subject_id),
      grade_id: Number(form.grade_id),
      academic_year_id: Number(form.academic_year_id),
    });

    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[520px] p-6 space-y-4">
        <h2 className="text-lg font-semibold">Assign Subject</h2>

        <select className="w-full border p-2 rounded" onChange={e => setForm({ ...form, teacher_id: e.target.value })}>
          <option value="">Select Teacher</option>
          {teachers.map(t => (
            <option key={t.id} value={t.id}>{t.first_name} {t.last_name}</option>
          ))}
        </select>

        <select className="w-full border p-2 rounded" onChange={e => setForm({ ...form, subject_id: e.target.value })}>
          <option value="">Select Subject</option>
          {subjects.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>

        <select className="w-full border p-2 rounded" onChange={e => setForm({ ...form, grade_id: e.target.value })}>
          <option value="">Select Grade</option>
          {grades.map(g => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </select>

        <select className="w-full border p-2 rounded" onChange={e => setForm({ ...form, academic_year_id: e.target.value })}>
          <option value="">Academic Year</option>
          {years.map(y => (
            <option key={y.id} value={y.id}>{y.name}</option>
          ))}
        </select>

        <div className="flex justify-end gap-3 pt-4">
          <button onClick={onClose} className="border px-4 py-2 rounded">
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
