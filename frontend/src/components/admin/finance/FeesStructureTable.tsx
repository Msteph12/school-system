import type { FeeStructureListItem } from "@/types/Fees";

interface Props {
  fees: FeeStructureListItem[];
  onView: (fee: FeeStructureListItem) => void;
  onEdit: (fee: FeeStructureListItem) => void;
}

const FeesStructureTable = ({ fees, onView, onEdit }: Props) => {
  if (fees.length === 0) {
    return (
      <div className="bg-white p-10 rounded shadow-md shadow-red-200 text-center text-gray-500">
        No fees structure found.
      </div>
    );
  }

  const printFeeStructure = async (id: number) => {
    const res = await fetch(`/api/fee-structures/${id}/print`, {
      headers: {
        Accept: "application/pdf",
      },
    });

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "fee-structure.pdf";
    a.click();

    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded shadow-md shadow-red-200 overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-red-50">
          <tr>
            <th className="p-3 text-left">Grade</th>
            <th className="p-3 text-left">Term</th>
            <th className="p-3 text-left">Academic Year</th>
            <th className="p-3 text-left">Total Amount</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {fees.map((f) => (
            <tr key={f.id} className="border-t hover:bg-red-50">
              <td className="p-3">{f.grade}</td>
              <td className="p-3">{f.term}</td>
              <td className="p-3">{f.academicYear}</td>
              <td className="p-3 font-medium">{f.totalAmount}</td>

              <td className="p-3 flex gap-4">
                <button
                  onClick={() => onView(f)}
                  className="text-blue-600 hover:underline"
                >
                  View
                </button>

                <button
                  onClick={() => onEdit(f)}
                  className="text-red-600 hover:underline"
                >
                  Edit
                </button>

                <button
                  onClick={() => printFeeStructure(f.id)}
                  className="px-3 py-1 bg-blue-600 text-white rounded"
                >
                  Print
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FeesStructureTable;
