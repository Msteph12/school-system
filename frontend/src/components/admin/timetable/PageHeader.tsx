"use client";

const PageHeader = () => {
  return (
    <div className="flex items-center justify-between bg-white p-4 rounded shadow-sm">
      {/* Filters */}
      <div className="flex gap-4">
        {/* Grade Select */}
        <select className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Select Grade</option>
          {/* grades go here */}
        </select>

        {/* Class Select */}
        <select className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Select Class</option>
          {/* classes go here */}
        </select>
      </div>

      {/* Status Badge */}
      <span className="px-3 py-1 text-sm font-medium rounded-full bg-yellow-100 text-yellow-700">
        Draft
        {/* change to Published when needed */}
      </span>
    </div>
  );
};

export default PageHeader;
