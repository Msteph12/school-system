"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";
import TopBar from "@/components/admin/TopBar";
import ResultsModal from "@/components/admin/results/ResultsModal";

interface Result {
  id: string;
  admission_no: string;
  student_name: string;
  subject: string;
  exam_type: string;
  marks: number;
  grade_scale: string;
  remarks: string;
  date_entered: string;
  grade_id: string;
  class_id: string;
}

interface Student {
  admission_no: string;
  name: string;
  grade_id: string;
  class_id: string;
}

interface FilterOption {
  id: string;
  name: string;
  code?: string;
  grade_id?: string;
}

interface GradeScaleItem {
  id: string;
  name: string;
  min_score: number;
  max_score: number;
}

interface ResultData {
  id?: string;
  admission_no: string;
  student_name: string;
  subject: string;
  marks: number;
  grade_scale: string;
  remarks: string;
}

const EnterResults = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [editingResult, setEditingResult] = useState<Result | null>(null);
  const [results, setResults] = useState<Result[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [grades, setGrades] = useState<FilterOption[]>([]);
  const [classes, setClasses] = useState<FilterOption[]>([]);
  const [subjects, setSubjects] = useState<FilterOption[]>([]);
  const [examTypes, setExamTypes] = useState<FilterOption[]>([]);
  
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedExamType, setSelectedExamType] = useState("");

  const [gradeScale, setGradeScale] = useState<GradeScaleItem[]>([]);

  // Fetch all data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
        // Fetch initial data
        const [gradesRes, classesRes, subjectsRes, examTypesRes, gradeScaleRes] = 
          await Promise.all([
            api.get("/grades"),
            api.get("/classes"),
            api.get("/subjects"),
            api.get("/exam-types"),
            api.get("/grade-scale")
          ]);

        setGrades(gradesRes.data);
        setClasses(classesRes.data);
        setSubjects(subjectsRes.data);
        setExamTypes(examTypesRes.data);
        setGradeScale(gradeScaleRes.data);

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch students when class is selected
  useEffect(() => {
    const fetchStudents = async () => {
      if (selectedGrade && selectedClass) {
        try {
          const response = await api.get(`/students`, {
            params: { grade_id: selectedGrade, class_id: selectedClass }
          });
          setStudents(response.data);
        } catch (error) {
          console.error("Error fetching students:", error);
        }
      }
    };

    fetchStudents();
  }, [selectedGrade, selectedClass]);

  // Fetch results when filters change
  useEffect(() => {
    const fetchResults = async () => {
      const params: Record<string, string> = {};
      if (selectedGrade) params.grade_id = selectedGrade;
      if (selectedClass) params.class_id = selectedClass;
      if (selectedSubject) params.subject_id = selectedSubject;
      if (selectedExamType) params.exam_type_id = selectedExamType;

      try {
        const response = await api.get("/results", { params });
        setResults(response.data);
      } catch (error) {
        console.error("Error fetching results:", error);
      }
    };

    fetchResults();
  }, [selectedGrade, selectedClass, selectedSubject, selectedExamType]);

  // Filter classes based on selected grade
  const filteredClasses = selectedGrade
    ? classes.filter(cls => cls.grade_id === selectedGrade)
    : [];

  // Quick navigation cards
  const quickNavCards = [
    {
      title: "Grade Scale",
      description: "Set and manage grade scale",
      gradient: "from-red-600/80 to-red-400/80",
      onClick: () => navigate("/admin/grade-scale"),
    },
    {
      title: "Term Lock Status",
      description: "Lock/unlock terms for results",
      gradient: "from-green-600/80 to-green-400/80",
      onClick: () => navigate("/admin/term-lock"),
    },
    {
      title: "Student Result Review",
      description: "Review student results",
      gradient: "from-blue-600/80 to-blue-400/80",
      onClick: () => navigate("/admin/result-review"),
    },
  ];

  // Handle result added from modal
  const handleResultAdded = async (newResult: ResultData) => {
    try {
      const response = await api.post("/results", {
        ...newResult,
        subject_id: selectedSubject,
        exam_type_id: selectedExamType,
        grade_id: selectedGrade,
        class_id: selectedClass
      });
      
      setResults(prev => [...prev, response.data]);
    } catch (error) {
      console.error("Error adding result:", error);
      alert("Failed to save result. Please try again.");
    }
  };

  // Handle result updated from modal
  const handleResultUpdated = async (updatedResult: ResultData) => {
    try {
      await api.put(`/results/${updatedResult.id}`, {
        marks: updatedResult.marks,
        grade_scale: updatedResult.grade_scale,
        remarks: updatedResult.remarks
      });
      
      setResults(prev => prev.map(result => 
        result.id === updatedResult.id 
          ? { 
              ...result, 
              marks: updatedResult.marks,
              grade_scale: updatedResult.grade_scale,
              remarks: updatedResult.remarks
            } 
          : result
      ));
      setEditingResult(null);
    } catch (error) {
      console.error("Error updating result:", error);
      alert("Failed to update result. Please try again.");
    }
  };

  // Handle delete result
  const handleDeleteResult = async (resultId: string) => {
    if (!confirm("Are you sure you want to delete this result?")) {
      return;
    }

    try {
      await api.delete(`/results/${resultId}`);
      setResults(prev => prev.filter(result => result.id !== resultId));
    } catch (error) {
      console.error("Error deleting result:", error);
      alert("Failed to delete result. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <TopBar />
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800">Enter Results</h1>
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:underline"
            aria-label="Go back"
          >
            ← Back
          </button>
        </div>
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>
            ))}
          </div>
          <div className="h-12 bg-gray-200 rounded w-full mb-6"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <TopBar />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Enter Results</h1>
          <p className="text-gray-600">Enter and manage student examination results</p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:underline"
          aria-label="Go back"
        >
          ← Back
        </button>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickNavCards.map((card, index) => (
          <div
            key={index}
            onClick={card.onClick}
            className="relative h-32 rounded-2xl overflow-hidden shadow-lg cursor-pointer"
            aria-label={`Navigate to ${card.title}`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                card.onClick();
              }
            }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient}`} />
            <div className="relative h-full p-5 flex flex-col justify-end text-white">
              <p className="text-lg font-bold">{card.title}</p>
              <p className="text-sm opacity-90 mt-1">{card.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters Section */}
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Criteria</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Grade Filter */}
          <div>
            <label htmlFor="grade-select" className="block text-sm font-medium text-gray-700 mb-1">
              Grade
            </label>
            <select
              id="grade-select"
              value={selectedGrade}
              onChange={(e) => {
                setSelectedGrade(e.target.value);
                setSelectedClass("");
              }}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              aria-label="Select grade"
              title="Select grade"
            >
              <option value="">Select Grade</option>
              {grades.map(grade => (
                <option key={grade.id} value={grade.id}>
                  {grade.name} {grade.code && `(${grade.code})`}
                </option>
              ))}
            </select>
          </div>

          {/* Class Filter */}
          <div>
            <label htmlFor="class-select" className="block text-sm font-medium text-gray-700 mb-1">
              Class
            </label>
            <select
              id="class-select"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              disabled={!selectedGrade}
              aria-label="Select class"
              title="Select class"
            >
              <option value="">Select Class</option>
              {filteredClasses.map(cls => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          {/* Subject Filter */}
          <div>
            <label htmlFor="subject-select" className="block text-sm font-medium text-gray-700 mb-1">
              Subject
            </label>
            <select
              id="subject-select"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              aria-label="Select subject"
              title="Select subject"
            >
              <option value="">Select Subject</option>
              {subjects.map(subject => (
                <option key={subject.id} value={subject.id}>
                  {subject.name} {subject.code && `(${subject.code})`}
                </option>
              ))}
            </select>
          </div>

          {/* Exam Type Filter */}
          <div>
            <label htmlFor="exam-type-select" className="block text-sm font-medium text-gray-700 mb-1">
              Exam Type
            </label>
            <select
              id="exam-type-select"
              value={selectedExamType}
              onChange={(e) => setSelectedExamType(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              aria-label="Select exam type"
              title="Select exam type"
            >
              <option value="">Select Exam Type</option>
              {examTypes.map(exam => (
                <option key={exam.id} value={exam.id}>
                  {exam.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Results Entry</h3>
            <p className="text-gray-600 text-sm">
              {selectedGrade && selectedClass && selectedSubject && selectedExamType
                ? `Ready to enter results for ${subjects.find(s => s.id === selectedSubject)?.name} - ${examTypes.find(e => e.id === selectedExamType)?.name}`
                : "Select all criteria to enter results"
              }
            </p>
          </div>
          <button
            onClick={() => {
              setEditingResult(null);
              setShowModal(true);
            }}
            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
            disabled={!selectedGrade || !selectedClass || !selectedSubject || !selectedExamType}
            aria-label="Add new results"
          >
            <span className="text-xl">+</span>
            <span>Add Results</span>
          </button>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Entered Results</h3>
              <p className="text-gray-600 text-sm">
                {results.length} result{results.length !== 1 ? 's' : ''} found
              </p>
            </div>
          </div>
        </div>

        {results.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Admission No.
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Exam Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Marks
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Remarks
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.map((result) => (
                  <tr key={result.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {result.admission_no}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {result.student_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {result.subject}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {result.exam_type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {result.marks}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        result.grade_scale?.startsWith('A') ? 'bg-green-100 text-green-800' :
                        result.grade_scale?.startsWith('B') ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {result.grade_scale}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                      {result.remarks || "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => {
                          setEditingResult(result);
                          setShowModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                        aria-label={`Edit result for ${result.student_name}`}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteResult(result.id)}
                        className="text-red-600 hover:text-red-900"
                        aria-label={`Delete result for ${result.student_name}`}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-5xl mb-4">📊</div>
            <p className="text-gray-500 text-lg mb-2">No results found</p>
            <p className="text-gray-400 text-sm mb-6">
              {selectedGrade && selectedClass && selectedSubject && selectedExamType
                ? `No results entered for selected criteria`
                : "Select filters to view results"
              }
            </p>
          </div>
        )}
      </div>

      {/* Results Modal */}
      {showModal && (
        <ResultsModal
          onClose={() => {
            setShowModal(false);
            setEditingResult(null);
          }}
          onResultAdded={handleResultAdded}
          onResultUpdated={handleResultUpdated}
          gradeScale={gradeScale}
          currentSubject={subjects.find(s => s.id === selectedSubject)?.name || ""}
          selectedGrade={selectedGrade}
          selectedClass={selectedClass}
          students={students}
          editingResult={editingResult}
        />
      )}
    </div>
  );
};

export default EnterResults;