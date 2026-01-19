"use client";

import { useEffect, useState } from "react";
import { getGrades } from "@/services/grades";
import { getClasses } from "@/services/classes";
import type { Grade } from "@/types/grade";
import type { Class } from "@/types/class";

interface Props {
  onGradeChange?: (gradeId: number | null) => void;
}

const PageHeader = ({ onGradeChange }: Props) => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const [gradesRes, classesRes] = await Promise.all([
        getGrades(),
        getClasses(),
      ]);
      setGrades(gradesRes.data);
      setClasses(classesRes.data);
    };
    fetchData();
  }, []);

  const filteredClasses = selectedGrade
    ? classes.filter((c) => Number(c.gradeId) === selectedGrade)
    : [];

  const handleGradeChange = (value: string) => {
    const id = value ? Number(value) : null;
    setSelectedGrade(id);
    onGradeChange?.(id);
  };

  return (
    <div className="flex items-center justify-between bg-white p-4 rounded shadow-sm">
      <div className="flex gap-4">
        <select
          onChange={(e) => handleGradeChange(e.target.value)}
          className="border rounded px-3 py-2 text-sm"
        >
          <option value="">Select Grade</option>
          {grades.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>

        <select
          disabled={!selectedGrade}
          className="border rounded px-3 py-2 text-sm"
        >
          <option value="">Select Class</option>
          {filteredClasses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <span className="px-3 py-1 text-sm rounded-full bg-yellow-100 text-yellow-700">
        Draft
      </span>
    </div>
  );
};

export default PageHeader;
