import { FiSearch } from "react-icons/fi";
import { useSystemContext } from "@/context/UseSystemContext";

interface TopBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
}

const TopBar = ({ searchValue, onSearchChange }: TopBarProps) => {
  const { academicYear, term, loading } = useSystemContext();

  return (
    <div className="flex items-center justify-between bg-white p-4 rounded shadow-md shadow-red-200">
      {/* Academic Year */}
      <div className="font-medium text-lg">
        Academic Year:{" "}
        <span className="font-semibold">
          {loading ? "—" : academicYear ?? "N/A"}
        </span>
      </div>

      {/* Term */}
      <div className="font-medium text-lg">
        Term:{" "}
        <span className="font-semibold">
          {loading ? "—" : term ?? "N/A"}
        </span>
      </div>

      {/* Search */}
      <div className="flex items-center border rounded px-4 py-1 text-sm bg-white w-64">
        <FiSearch className="text-gray-400 mr-2" />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search..."
          className="outline-none w-full"
        />
      </div>
    </div>
  );
};

export default TopBar;
