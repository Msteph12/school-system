import type { TeacherListItem } from "@/types/teacher";

interface Props {
  teachers: TeacherListItem[];
  onView: (teacher: TeacherListItem) => void;
  onEdit: (teacher: TeacherListItem) => void;
}

const TeachersTable = ({ teachers, onView, onEdit }: Props) => {
  if (teachers.length === 0) {
    return (
      <div className="bg-white p-10 rounded shadow-md shadow-red-200 text-center text-gray-500">
        No teachers found.
      </div>
    );
  }

  return (
    <div className="bg-white rounded shadow-md shadow-red-200 overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-red-50">
          <tr>
            <th className="p-3 text-left">Staff No</th>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Department</th>
            <th className="p-3 text-left">Phone</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {teachers.map((t) => (
            <tr key={t.id} className="border-t hover:bg-red-50">
              <td className="p-3">{t.staffNo}</td>
              <td className="p-3">{t.name}</td>
              <td className="p-3">{t.department}</td>
              <td className="p-3">{t.phone}</td>

              <td className="p-3 flex gap-4">
                <button
                  onClick={() => onView(t)}
                  className="text-blue-600 hover:underline"
                >
                  View
                </button>
                <button
                  onClick={() => onEdit(t)}
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

export default TeachersTable;
