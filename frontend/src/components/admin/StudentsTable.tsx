import type { StudentListItem } from "@/types/student";

interface Props {
  students: StudentListItem[];
  onView: (student: StudentListItem) => void;
  onEdit: (student: StudentListItem) => void;
}

const StudentsTable = ({ students, onView, onEdit }: Props) => {
  if (students.length === 0) {
    return (
      <div className="bg-white p-10 rounded shadow-md shadow-red-200 text-center text-gray-500">
        No students found.
      </div>
    );
  }

  return (
    <div className="bg-white rounded shadow-md shadow-red-200 overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-red-50">
          <tr>
            <th className="p-3 text-left">Admission No</th>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Grade</th>
            <th className="p-3 text-left">Class</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {students.map((s) => (
            <tr key={s.id} className="border-t hover:bg-red-50">
              <td className="p-3">{s.admissionNo}</td>
              <td className="p-3">{s.name}</td>
              <td className="p-3">{s.grade}</td>
              <td className="p-3">{s.class}</td>

              <td className="p-3 flex gap-4">
                <button
                  onClick={() => onView(s)}
                  className="text-blue-600 hover:underline"
                >
                  View
                </button>
                <button
                  onClick={() => onEdit(s)}
                  className="text-red-600 hover:underline"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentsTable;
