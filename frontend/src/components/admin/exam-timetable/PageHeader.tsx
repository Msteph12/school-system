"use client";

import { useEffect, useState } from "react";
import { assessmentService } from "@/services/assessment";
import type { ExamType } from "@/types/assessment";

interface Props {
  onGradeChange?: (gradeId: number | null) => void;
  onExamTypeChange?: (examTypeId: number | null) => void; // Changed from string to number | null
  onStartDateChange?: (date: string) => void;
  onEndDateChange?: (date: string) => void;
  onMaxPapersChange?: (max: number) => void;
  isPublished?: boolean;
}

const PageHeader = ({
  onGradeChange,
  onExamTypeChange,
  onStartDateChange,
  onEndDateChange,
  onMaxPapersChange,
  isPublished = false,
}: Props) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [maxPapers, setMaxPapers] = useState(2);
  const [examTypes, setExamTypes] = useState<ExamType[]>([]);

  useEffect(() => {
    const loadExamTypes = async () => {
      const res = await assessmentService.getExamTypes();
      if (res.data) setExamTypes(res.data);
    };

    loadExamTypes();
  }, []);

  const grades = [
    { id: 1, name: "Grade 1" },
    { id: 2, name: "Grade 2" },
    { id: 3, name: "Grade 3" },
    { id: 4, name: "Grade 4" },
    { id: 5, name: "Grade 5" },
  ];

  const handleExamTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    // Pass number ID or null
    onExamTypeChange?.(value ? Number(value) : null);
  };

  return (
    <div className="flex items-center justify-between bg-white p-4 rounded shadow-sm">
      <div className="flex flex-wrap gap-4 items-center">
        {/* Grade */}
        <select
          onChange={(e) =>
            onGradeChange?.(e.target.value ? Number(e.target.value) : null)
          }
          className="border rounded px-3 py-2 text-sm min-w-[140px]"
        >
          <option value="">Select Grade</option>
          {grades.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>

        {/* Exam Type (FROM API) */}
        <select
          onChange={handleExamTypeChange}
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
        <input
          type="date"
          value={startDate}
          onChange={(e) => {
            setStartDate(e.target.value);
            onStartDateChange?.(e.target.value);
          }}
          className="border rounded px-3 py-2 text-sm"
        />

        {/* End Date */}
        <input
          type="date"
          value={endDate}
          onChange={(e) => {
            setEndDate(e.target.value);
            onEndDateChange?.(e.target.value);
          }}
          className="border rounded px-3 py-2 text-sm"
        />

        {/* Max Papers */}
        <select
          value={maxPapers}
          onChange={(e) => {
            const val = Number(e.target.value);
            setMaxPapers(val);
            onMaxPapersChange?.(val);
          }}
          className="border rounded px-3 py-2 text-sm"
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>

      <span
        className={`px-3 py-1 text-sm rounded-full ${
          isPublished
            ? "bg-green-100 text-green-700"
            : "bg-yellow-100 text-yellow-700"
        }`}
      >
        {isPublished ? "Published" : "Draft"}
      </span>
    </div>
  );
};

export default PageHeader;