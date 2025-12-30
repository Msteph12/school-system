import { FiSearch } from "react-icons/fi";

const TopBar = () => {
  return (
    <div className="flex items-center justify-between bg-white p-4 rounded shadow-md shadow-red-200">
      {/* Academic Year */}
      <div className="font-medium text-lg">
        Academic Year: <span className="font-semibold">2025</span>
      </div>

      {/* Term */}
      <div className="font-medium text-lg">
        Term: <span className="font-semibold">Term 2</span>
      </div>

      {/* Search */}
      <div className="flex items-center border rounded px-4 py-1 text-sm bg-white">
        <FiSearch className="text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Search..."
          className="outline-none w-full"
        />
      </div>
    </div>
  );
};

export default TopBar;
