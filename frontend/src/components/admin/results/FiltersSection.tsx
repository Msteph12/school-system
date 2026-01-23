import React from 'react';

interface FilterOption {
  id: string;
  name: string;
  code?: string;
}

interface FiltersSectionProps {
  selectedYear: string;
  setSelectedYear: (value: string) => void;
  selectedTerm: string;
  setSelectedTerm: (value: string) => void;
  selectedGrade: string;
  setSelectedGrade: (value: string) => void;
  selectedClass: string; // Changed from selectedStream
  setSelectedClass: (value: string) => void; // Changed from setSelectedStream
  selectedExamType: string;
  setSelectedExamType: (value: string) => void;
  years: FilterOption[];
  terms: FilterOption[];
  grades: FilterOption[];
  classes: FilterOption[]; // Changed from streams
  examTypes: FilterOption[];
}

const FiltersSection: React.FC<FiltersSectionProps> = ({
  selectedYear,
  setSelectedYear,
  selectedTerm,
  setSelectedTerm,
  selectedGrade,
  setSelectedGrade,
  selectedClass,
  setSelectedClass,
  selectedExamType,
  setSelectedExamType,
  years,
  terms,
  grades,
  classes,
  examTypes,
}) => {
  const filters = [
    {
      label: 'Year',
      id: 'year-select',
      value: selectedYear,
      onChange: setSelectedYear,
      options: years,
    },
    {
      label: 'Term',
      id: 'term-select',
      value: selectedTerm,
      onChange: setSelectedTerm,
      options: terms,
    },
    {
      label: 'Grade',
      id: 'grade-select',
      value: selectedGrade,
      onChange: (value: string) => {
        setSelectedGrade(value);
        setSelectedClass(''); // Reset class when grade changes
      },
      options: grades,
    },
    {
      label: 'Class',
      id: 'class-select', // Changed from stream-select
      value: selectedClass,
      onChange: setSelectedClass,
      options: classes,
      disabled: !selectedGrade,
    },
    {
      label: 'Exam Type',
      id: 'exam-type-select',
      value: selectedExamType,
      onChange: setSelectedExamType,
      options: examTypes,
    },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Criteria</h3>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {filters.map((filter) => (
          <div key={filter.id}>
            <label htmlFor={filter.id} className="block text-sm font-medium text-gray-700 mb-1">
              {filter.label}
            </label>
            <select
              id={filter.id}
              value={filter.value}
              onChange={(e) => filter.onChange(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              disabled={filter.disabled}
              aria-label={`Select ${filter.label.toLowerCase()}`}
            >
              <option value="">Select {filter.label}</option>
              {filter.options.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name} {option.code ? `(${option.code})` : ''}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FiltersSection;