import type { Class } from "@/types/class";

interface Props {
  classes: Class[];
  gradeName: string;
  onClose?: () => void;
  onToggleStatus: (id: string) => Promise<void>;
  showGradeColumn?: boolean;
  gradeCount?: number;
  totalClasses?: number;
}

const ClassesTable = ({
  classes,
  gradeName,
  onClose,
  onToggleStatus,
  showGradeColumn = false,
  gradeCount = 0,
  totalClasses = 0,
}: Props) => {
  const confirmToggle = async (classItem: Class) => {
    if (
      classItem.status === "Active" &&
      !confirm(
        `Deactivate "${classItem.name}"?\n\nStudents and records will be preserved.`
      )
    ) {
      return;
    }

    await onToggleStatus(classItem.id);
  };

  return (
    <div className="bg-white rounded shadow-md overflow-x-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h3 className="text-lg font-semibold">{gradeName}</h3>
          <p className="text-sm text-gray-500">
            {showGradeColumn
              ? `${classes.length} classes across ${gradeCount} grades (${totalClasses} total)`
              : `Total Classes: ${classes.length}`}
          </p>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-gray-100 rounded"
          >
            Show All Grades
          </button>
        )}
      </div>

      {classes.length === 0 ? (
        <div className="p-10 text-center text-gray-500">
          No classes found
        </div>
      ) : (
        <table className="w-full text-sm">
          <thead className="bg-blue-50">
            <tr>
              {showGradeColumn && <th className="p-3 text-left">Grade</th>}
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Code</th>
              <th className="p-3 text-left">Order</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {classes.map((c) => (
              <tr key={c.id} className="border-t hover:bg-blue-50">
                {showGradeColumn && (
                  <td className="p-3">{c.gradeName}</td>
                )}
                <td className="p-3 font-medium">{c.name}</td>
                <td className="p-3 font-mono">{c.code}</td>
                <td className="p-3">{c.display_order ?? "-"}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      c.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {c.status}
                  </span>
                </td>
                <td className="p-3">
                  <button
                    onClick={() => confirmToggle(c)}
                    className={`text-sm hover:underline ${
                      c.status === "Active"
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {c.status === "Active" ? "Deactivate" : "Activate"}
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
