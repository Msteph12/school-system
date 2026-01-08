import type { SubjectAssignment } from "@/types/subjectAssignment";

interface Props {
  data: SubjectAssignment[];
  onDelete: (id: number) => void;
}

export default function SubjectAssignmentsTable({ data, onDelete }: Props) {
  if (data.length === 0) {
    return (
      <div className="bg-white p-8 rounded shadow text-center text-gray-500">
        No subject assignments found.
      </div>
    );
  }

  return (
    <div className="bg-white rounded shadow overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-red-50">
          <tr>
            <th className="p-3 text-left">Teacher</th>
            <th className="p-3 text-left">Subject</th>
            <th className="p-3 text-left">Grade</th>
            <th className="p-3 text-left">Academic Year</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map(a => (
            <tr key={a.id} className="border-t hover:bg-red-50">
              <td className="p-3">{a.teacher_name}</td>
              <td className="p-3">{a.subject_name}</td>
              <td className="p-3">{a.grade_name}</td>
              <td className="p-3">{a.academic_year_name}</td>
              <td className="p-3">
                <button
                  onClick={() => onDelete(a.id)}
                  className="text-red-600 hover:underline"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
