import type { Grade } from "@/types/grade";

interface Props {
  grades: Grade[];
  onView: (grade: Grade) => void;
  onEdit: (grade: Grade) => void;
  onViewStreams?: (grade: Grade) => void;
}

const GradesTable = ({ grades, onView, onEdit, onViewStreams }: Props) => {
  if (grades.length === 0) {
    return (
      <div className="bg-white p-10 rounded shadow-md shadow-blue-200 text-center text-gray-500">
        No grades found.
      </div>
    );
  }

  const handleColumnClick = (grade: Grade) => {
    if (onViewStreams) {
      onViewStreams(grade);
    }
  };

  return (
    <div className="bg-white rounded shadow-md shadow-blue-200 overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-blue-50">
          <tr>
            <th 
              className="p-3 text-left cursor-pointer hover:bg-blue-100" 
              onClick={() => onViewStreams && onViewStreams(grades[0])}
            >
              Grade Name
            </th>
            <th 
              className="p-3 text-left cursor-pointer hover:bg-blue-100" 
              onClick={() => onViewStreams && onViewStreams(grades[0])}
            >
              Grade Code
            </th>
            <th 
              className="p-3 text-left cursor-pointer hover:bg-blue-100" 
              onClick={() => onViewStreams && onViewStreams(grades[0])}
            >
              Stream Count
            </th>
            <th 
              className="p-3 text-left cursor-pointer hover:bg-blue-100" 
              onClick={() => onViewStreams && onViewStreams(grades[0])}
            >
              Display Order
            </th>
            <th 
              className="p-3 text-left cursor-pointer hover:bg-blue-100" 
              onClick={() => onViewStreams && onViewStreams(grades[0])}
            >
              Status
            </th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {grades.map((grade) => (
            <tr key={grade.id} className="border-t hover:bg-blue-50">
              <td 
                className="p-3 cursor-pointer hover:text-blue-600 hover:underline" 
                onClick={() => handleColumnClick(grade)}
              >
                {grade.name}
              </td>
              <td 
                className="p-3 cursor-pointer hover:text-blue-600 hover:underline" 
                onClick={() => handleColumnClick(grade)}
              >
                {grade.code}
              </td>
              <td 
                className="p-3 cursor-pointer hover:text-blue-600 hover:underline" 
                onClick={() => handleColumnClick(grade)}
              >
                {grade.classCount || 0}
              </td>
              <td 
                className="p-3 cursor-pointer hover:text-blue-600 hover:underline" 
                onClick={() => handleColumnClick(grade)}
              >
                {grade.display_order || "-"}
              </td>
              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    grade.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {grade.status}
                </span>
              </td>

              <td className="p-3 flex gap-4">
                <button
                  onClick={() => onView(grade)}
                  className="text-blue-600 hover:underline"
                >
                  View
                </button>
                <button
                  onClick={() => onEdit(grade)}
                  className="text-blue-600 hover:underline"
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

export default GradesTable;