import React, { useState, useEffect } from 'react';
import { resultsService } from '@/services/resultsService';
import type { Student } from '@/types/result';

interface StudentSearchProps {
  admissionNo: string;
  studentName: string;
  setAdmissionNo: (value: string) => void;
  setStudentName: (value: string) => void;
  onSelectStudent: (student: Student) => void;
  onSearch: () => void;
  loading: boolean;
}

const StudentSearch: React.FC<StudentSearchProps> = ({
  admissionNo,
  studentName,
  setAdmissionNo,
  onSelectStudent,
  onSearch,
  loading,
}) => {
  const [searchResults, setSearchResults] = useState<Student[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    const searchStudents = async () => {
      if (admissionNo.trim().length >= 2) {
        setSearchLoading(true);
        try {
          const data = await resultsService.searchStudents(admissionNo);
          setSearchResults(
            data.students.map((student) => ({
              ...student,
              created_at: student.created_at ?? '',
              updated_at: student.updated_at ?? '',
            }))
          );
          setShowSuggestions(true);
        } catch (error) {
          console.error('Search failed:', error);
          setSearchResults([]);
        } finally {
          setSearchLoading(false);
        }
      } else {
        setSearchResults([]);
        setShowSuggestions(false);
      }
    };

    const timeoutId = setTimeout(searchStudents, 300);
    return () => clearTimeout(timeoutId);
  }, [admissionNo]);

  const handleSelectStudent = (student: Student) => {
    onSelectStudent(student);
    setShowSuggestions(false);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Student Search</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <label htmlFor="admission-no" className="block text-sm font-medium text-gray-700 mb-1">
            Admission Number
          </label>
          <input
            id="admission-no"
            type="text"
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            placeholder="Enter admission number or student name"
            value={admissionNo}
            onChange={(e) => setAdmissionNo(e.target.value.toUpperCase())}
            aria-label="Admission number"
            aria-describedby="admission-no-desc"
          />
          
          {searchLoading && (
            <div className="absolute right-3 top-9">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            </div>
          )}

          {showSuggestions && searchResults.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {searchResults.map((student) => (
                <div
                  key={student.id}
                  className="px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                  onClick={() => handleSelectStudent(student)}
                >
                  <div className="font-medium text-gray-900">{student.admission_no}</div>
                  <div className="text-sm text-gray-600">{student.name}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label htmlFor="student-name" className="block text-sm font-medium text-gray-700 mb-1">
            Student Name
          </label>
          <input
            id="student-name"
            type="text"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50"
            value={studentName}
            readOnly
            placeholder="Auto-filled from student selection"
            aria-label="Student name"
            aria-describedby="student-name-desc"
          />
        </div>

        <div className="flex items-end">
          <button
            onClick={onSearch}
            disabled={loading || !admissionNo.trim()}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Search student results"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                Searching...
              </span>
            ) : (
              'Search Results'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentSearch;