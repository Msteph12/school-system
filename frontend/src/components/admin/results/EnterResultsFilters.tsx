import React from 'react';

interface FilterOption {
  id: string;
  name: string;
  code?: string;
}

interface EnterResultsFiltersProps {
  selectedYear: string;
  setSelectedYear: (value: string) => void;
  selectedTerm: string;
  setSelectedTerm: (value: string) => void;
  selectedGrade: string;
  setSelectedGrade: (value: string) => void;
  selectedClass: string;
  setSelectedClass: (value: string) => void;
  selectedSubject: string;
  setSelectedSubject: (value: string) => void;
  selectedExamType: string;
  setSelectedExamType: (value: string) => void;
  filterOptions: {
    years: FilterOption[];
    terms: FilterOption[];
    grades: FilterOption[];
    classes: FilterOption[];
    subjects: FilterOption[];
    examTypes: FilterOption[];
  };
}

const EnterResultsFilters: React.FC<EnterResultsFiltersProps> = ({
  selectedYear,
  setSelectedYear,
  selectedTerm,
  setSelectedTerm,
  selectedGrade,
  setSelectedGrade,
  selectedClass,
  setSelectedClass,
  selectedSubject,
  setSelectedSubject,
  selectedExamType,
  setSelectedExamType,
  filterOptions,
}) => {
  const filters = [
    {
      label: 'Year',
      id: 'year-select',
      value: selectedYear,
      onChange: setSelectedYear,
      options: filterOptions.years,
    },
    {
      label: 'Term',
      id: 'term-select',
      value: selectedTerm,
      onChange: setSelectedTerm,
      options: filterOptions.terms,
      disabled: !selectedYear,
    },
    {
      label: 'Grade',
      id: 'grade-select',
      value: selectedGrade,
      onChange: (value: string) => {
        setSelectedGrade(value);
        setSelectedClass('');
        setSelectedSubject('');
      },
      options: filterOptions.grades,
    },
    {
      label: 'Class',
      id: 'class-select',
      value: selectedClass,
      onChange: setSelectedClass,
      options: filterOptions.classes,
      disabled: !selectedGrade,
    },
    {
      label: 'Subject',
      id: 'subject-select',
      value: selectedSubject,
      onChange: setSelectedSubject,
      options: filterOptions.subjects,
      disabled: !selectedGrade || !selectedClass,
    },
    {
      label: 'Exam Type',
      id: 'exam-type-select',
      value: selectedExamType,
      onChange: setSelectedExamType,
      options: filterOptions.examTypes,
    },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Criteria</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
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
            >
              <option value="">Select {filter.label}</option>
              {filter.options.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name} {option.code && `(${option.code})`}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnterResultsFilters;