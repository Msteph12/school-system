import type { ClassTeacher } from "@/types/classTeacher";

interface Props {
  data: ClassTeacher[];
  onUnassign: (id: number) => void;
}

export default function ClassTeachersTable({ data, onUnassign }: Props) {
  return (
    <table className="w-full border text-sm">
      <thead className="bg-red-100">
        <tr>
          <th className="p-2">Teacher</th>
          <th className="p-2">Grade</th>
          <th className="p-2">Class</th>
          <th className="p-2">Status</th>
          <th className="p-2">Action</th>
        </tr>
      </thead>
      <tbody>
        {data.map(ct => (
          <tr key={ct.id} className="border-t">
            <td className="p-2">{ct.teacher_name}</td>
            <td className="p-2">{ct.grade_name}</td>
            <td className="p-2">{ct.class_name}</td>
            <td className="p-2">
              {ct.is_active ? "Active" : "Inactive"}
            </td>
            <td className="p-2">
              {ct.is_active && (
                <button
                  onClick={() => onUnassign(ct.id)}
                  className="text-red-600 hover:underline"
                >
                  Unassign
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
