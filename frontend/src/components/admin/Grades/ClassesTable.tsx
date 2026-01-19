import type { Class } from "@/types/class";

interface Props {
  classes: Class[];
  gradeName: string;
  onClose?: () => void;
  onView: (classItem: Class) => void;
  onEdit: (classItem: Class) => void;
  showGradeColumn?: boolean;
  gradeCount?: number;
  totalClasses?: number;
}

const ClassesTable = ({ 
  classes, 
  gradeName, 
  onClose, 
  onView, 
  onEdit,
  showGradeColumn = false,
  gradeCount = 0,
  totalClasses = 0
}: Props) => {
  return (
    <div className="bg-white rounded shadow-md shadow-blue-200 overflow-x-auto">
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {gradeName}
          </h3>
          <p className="text-sm text-gray-500">
            {showGradeColumn ? (
              <>
                Showing {classes.length} class{classes.length !== 1 ? 'es' : ''} 
                from {gradeCount} grade{gradeCount !== 1 ? 's' : ''}
                {totalClasses > 0 && ` (${totalClasses} total classes)`}
              </>
            ) : (
              `Total Classes: ${classes.length}`
            )}
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 rounded transition-colors"
          >
            Show All Grades
          </button>
        )}
      </div>

      {classes.length === 0 ? (
        <div className="p-10 text-center text-gray-500">
          {showGradeColumn ? 
            "No classes found across all grades." : 
            "No classes found for this grade."
          }
        </div>
      ) : (
        <table className="w-full text-sm">
          <thead className="bg-blue-50">
            <tr>
              {showGradeColumn && <th className="p-3 text-left">Grade</th>}
              <th className="p-3 text-left">Class Name</th>
              <th className="p-3 text-left">Class Code</th>
              <th className="p-3 text-left">Display Order</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {classes.map((classItem) => (
              <tr key={classItem.id} className="border-t hover:bg-blue-50">
                {showGradeColumn && (
                  <td className="p-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {classItem.gradeName || "Unknown Grade"}
                    </span>
                  </td>
                )}
                <td className="p-3 font-medium">{classItem.name}</td>
                <td className="p-3 font-mono text-gray-600">{classItem.code}</td>
                <td className="p-3">
                  {classItem.display_order ? (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      {classItem.display_order}
                    </span>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      classItem.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {classItem.status}
                  </span>
                </td>

                <td className="p-3 flex gap-4">
                  <button
                    onClick={() => onView(classItem)}
                    className="text-blue-600 hover:underline hover:text-blue-800"
                  >
                    View
                  </button>
                  <button
                    onClick={() => onEdit(classItem)}
                    className="text-blue-600 hover:underline hover:text-blue-800"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ClassesTable;