import type { Stream } from "@/types/stream";

interface Props {
  streams: Stream[];
  gradeName: string;
  onClose?: () => void;
  onView: (stream: Stream) => void;
  onEdit: (stream: Stream) => void;
  showGradeColumn?: boolean;
  gradeCount?: number;
  totalStreams?: number;
}

const StreamsTable = ({ 
  streams, 
  gradeName, 
  onClose, 
  onView, 
  onEdit,
  showGradeColumn = false,
  gradeCount = 0,
  totalStreams = 0
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
                Showing {streams.length} stream{streams.length !== 1 ? 's' : ''} 
                from {gradeCount} grade{gradeCount !== 1 ? 's' : ''}
                {totalStreams > 0 && ` (${totalStreams} total streams)`}
              </>
            ) : (
              `Total Streams: ${streams.length}`
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

      {streams.length === 0 ? (
        <div className="p-10 text-center text-gray-500">
          {showGradeColumn ? 
            "No streams found across all grades." : 
            "No streams found for this grade."
          }
        </div>
      ) : (
        <table className="w-full text-sm">
          <thead className="bg-blue-50">
            <tr>
              {showGradeColumn && <th className="p-3 text-left">Grade</th>}
              <th className="p-3 text-left">Stream Name</th>
              <th className="p-3 text-left">Stream Code</th>
              <th className="p-3 text-left">Display Order</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {streams.map((stream) => (
              <tr key={stream.id} className="border-t hover:bg-blue-50">
                {showGradeColumn && (
                  <td className="p-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {stream.gradeName || "Unknown Grade"}
                    </span>
                  </td>
                )}
                <td className="p-3 font-medium">{stream.name}</td>
                <td className="p-3 font-mono text-gray-600">{stream.code}</td>
                <td className="p-3">
                  {stream.display_order ? (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      {stream.display_order}
                    </span>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      stream.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {stream.status}
                  </span>
                </td>

                <td className="p-3 flex gap-4">
                  <button
                    onClick={() => onView(stream)}
                    className="text-blue-600 hover:underline hover:text-blue-800"
                  >
                    View
                  </button>
                  <button
                    onClick={() => onEdit(stream)}
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

export default StreamsTable;