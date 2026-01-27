"use client";

import { useState } from "react";

interface Props {
  onGradeChange?: (gradeId: number | null) => void;
  onExamTypeChange?: (type: string) => void;
  onStartDateChange?: (date: string) => void;
  onEndDateChange?: (date: string) => void;
  onMaxPapersChange?: (max: number) => void;
}

const PageHeader = ({
  onGradeChange,
  onExamTypeChange,
  onStartDateChange,
  onEndDateChange,
  onMaxPapersChange,
}: Props) => {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [maxPapers, setMaxPapers] = useState<number>(2);

  const examTypes = [
    { id: "midterm", name: "Mid-Term Exam" },
    { id: "final", name: "Final Exam" },
    { id: "quarterly", name: "Quarterly Exam" },
    { id: "unit_test", name: "Unit Test" },
  ];

  const grades = [
    { id: 1, name: "Grade 1" },
    { id: 2, name: "Grade 2" },
    { id: 3, name: "Grade 3" },
    { id: 4, name: "Grade 4" },
    { id: 5, name: "Grade 5" },
  ];

  const handleStartDateChange = (value: string) => {
    setStartDate(value);
    onStartDateChange?.(value);
  };

  const handleEndDateChange = (value: string) => {
    setEndDate(value);
    onEndDateChange?.(value);
  };

  const handleMaxPapersChange = (value: string) => {
    const num = Number(value);
    setMaxPapers(num);
    onMaxPapersChange?.(num);
  };

  return (
    <div className="flex items-center justify-between bg-white p-4 rounded shadow-sm">
      <div className="flex flex-wrap gap-4 items-center">
        {/* Grade Select */}
        <select
          onChange={(e) => onGradeChange?.(e.target.value ? Number(e.target.value) : null)}
          className="border rounded px-3 py-2 text-sm min-w-[140px]"
        >
          <option value="">Select Grade</option>
          {grades.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>

        {/* Exam Type Select */}
        <select
          onChange={(e) => onExamTypeChange?.(e.target.value)}
          className="border rounded px-3 py-2 text-sm min-w-[160px]"
        >
          <option value="">Exam Type</option>
          {examTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>

        {/* Start Date */}
        <div className="flex flex-col">
          <label className="text-xs text-gray-500 mb-1">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => handleStartDateChange(e.target.value)}
            className="border rounded px-3 py-2 text-sm"
          />
        </div>

        {/* End Date */}
        <div className="flex flex-col">
          <label className="text-xs text-gray-500 mb-1">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => handleEndDateChange(e.target.value)}
            className="border rounded px-3 py-2 text-sm"
          />
        </div>

        {/* Max Papers Per Day */}
        <div className="flex flex-col">
          <label className="text-xs text-gray-500 mb-1">Max Papers/Day</label>
          <select
            value={maxPapers}
            onChange={(e) => handleMaxPapersChange(e.target.value)}
            className="border rounded px-3 py-2 text-sm"
          >
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>
      </div>

      <span className="px-3 py-1 text-sm rounded-full bg-yellow-100 text-yellow-700">
        Draft
      </span>
    </div>
  );
};

export default PageHeader;