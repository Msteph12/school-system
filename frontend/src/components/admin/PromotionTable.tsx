import type { Student } from "@/types/student";

interface Props {
  students: Student[];
  selected: number[];
  setSelected: (ids: number[]) => void;
}

const PromotionTable = ({ students, selected, setSelected }: Props) => {
  const allSelected =
    students.length > 0 && selected.length === students.length;

  const toggle = (id: number) => {
    setSelected(
      selected.includes(id)
        ? selected.filter(x => x !== id)
        : [...selected, id]
    );
  };

  const toggleAll = () => {
    setSelected(allSelected ? [] : students.map(s => s.id));
  };

  return (
    <div className="bg-white rounded shadow-md shadow-red-200">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <h2 className="text-lg font-semibold text-gray-800">Students List</h2>

        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={allSelected} onChange={toggleAll} />
          Promote All
        </label>
      </div>

      <table className="w-full text-sm">
        <thead className="bg-red-50">
          <tr>
            <th className="p-3 text-center w-16">Promote</th>
            <th className="p-3 text-left">Student Name</th>
          </tr>
        </thead>

        <tbody>
          {students.map(s => (
            <tr key={s.id} className="border-t hover:bg-red-50">
              <td className="p-3 text-center">
                <input
                  type="checkbox"
                  checked={selected.includes(s.id)}
                  onChange={() => toggle(s.id)}
                  disabled={s.is_promoted} 
                />
              </td>
              <td className="p-3">
                {s.name}
                {s.is_promoted && (
                    <span className="ml-2 text-xs text-green-600">(Promoted)</span>
                )}
                </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PromotionTable;
