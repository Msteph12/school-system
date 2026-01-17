import type { Stream } from "@/types/stream";

interface Props {
  streams: Stream[];
  gradeName: string;
  onClose: () => void;
  onView: (stream: Stream) => void;
  onEdit: (stream: Stream) => void;
}

const StreamsTable = ({ streams, gradeName, onClose, onView, onEdit }: Props) => {
  return (
    <div className="bg-white rounded shadow-md shadow-blue-200 overflow-x-auto mt-6">
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Streams for {gradeName}
          </h3>
          <p className="text-sm text-gray-500">
            Total Streams: {streams.length}
          </p>
        </div>
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 rounded transition-colors"
        >
          Close
        </button>
      </div>

      {streams.length === 0 ? (
        <div className="p-10 text-center text-gray-500">
          No streams found for this grade.
        </div>
      ) : (
        <table className="w-full text-sm">
          <thead className="bg-blue-50">
            <tr>
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
                <td className="p-3">{stream.name}</td>
                <td className="p-3">{stream.code}</td>
                <td className="p-3">{stream.display_order || "-"}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
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
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </button>
                  <button
                    onClick={() => onEdit(stream)}
                    className="text-blue-600 hover:underline"
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