"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "@/components/admin/TopBar";
import QuickNavCards from "@/components/admin/results/QuickNavCards";
import FiltersSection from "@/components/admin/results/FiltersSection";
import StudentSearch from "@/components/admin/results/StudentSearch";
import ResultsTable from "@/components/admin/results/ResultsTable";
import { resultsService } from "@/services/resultsService";
import type { 
  QuickNavCard, 
  AcademicYear, 
  Term, 
  Grade, 
  Class, 
  ExamType,
  Student,
  ResultDisplay
} from "@/types/result";

const StudentResults = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ResultDisplay[]>([]);
  const [termLocked, setTermLocked] = useState(false);

  // Filter states
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedTerm, setSelectedTerm] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedExamType, setSelectedExamType] = useState("");

  // Student states
  const [admissionNo, setAdmissionNo] = useState("");
  const [studentName, setStudentName] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // API data states
  const [years, setYears] = useState<AcademicYear[]>([]);
  const [terms, setTerms] = useState<Term[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [examTypes, setExamTypes] = useState<ExamType[]>([]);

  // Quick navigation cards
  const quickNavCards: QuickNavCard[] = [
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
      title: "Enter Results",
      description: "Enter student examination results",
      gradient: "from-blue-600/80 to-blue-400/80",
      onClick: () => navigate("/admin/EnterResults"),
    },
  ];

  // Load filter data on mount
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const data = await resultsService.getFilterOptions();
        setYears(data.years || []);
        setTerms(data.terms || []);
        setGrades(data.grades || []);
        setClasses(data.classes || []);
        setExamTypes(data.exam_types || []);
        
        // Set current year as default
        const currentYear = data.years?.find((year: AcademicYear) => year.is_current);
        if (currentYear) {
          setSelectedYear(currentYear.id);
        }
      } catch (error) {
        console.error("Failed to load filter data:", error);
      }
    };

    loadFilters();
  }, []);

  // Load terms when year changes
  useEffect(() => {
    const loadTerms = async () => {
      if (selectedYear) {
        try {
          const termsData = await resultsService.getTermsByYear(selectedYear);
          setTerms(termsData || []);
          setSelectedTerm("");
        } catch (error) {
          console.error("Failed to load terms:", error);
          setTerms([]);
        }
      } else {
        setTerms([]);
      }
    };

    loadTerms();
  }, [selectedYear]);

  // Load classes when grade changes
  useEffect(() => {
    const loadClasses = async () => {
      if (selectedGrade) {
        try {
          const classesData = await resultsService.getClassesByGrade(selectedGrade);
          setClasses(classesData || []);
          setSelectedClass("");
        } catch (error) {
          console.error("Failed to load classes:", error);
          setClasses([]);
        }
      } else {
        setClasses([]);
      }
    };

    loadClasses();
  }, [selectedGrade]);

  // Validate all criteria are selected
  const allCriteriaSelected = () => {
    return selectedYear && selectedTerm && selectedGrade && selectedClass && selectedExamType;
  };

  // Handle student selection
  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student);
    setAdmissionNo(student.admission_no);
    setStudentName(student.name);
    
    // Auto-set grade and class from student data
    if (student.grade_id) setSelectedGrade(student.grade_id);
    if (student.class_id) setSelectedClass(student.class_id);
  };

  // Handle search
  const handleSearch = async () => {
    if (!selectedStudent) {
      alert("Please select a student");
      return;
    }

    if (!allCriteriaSelected()) {
      alert("Please select all criteria: Year, Term, Grade, Class, and Exam Type");
      return;
    }

    setLoading(true);

    try {
      // Check term lock status
      const lockStatus = await resultsService.checkTermLockStatus(selectedTerm);
      setTermLocked(lockStatus.is_locked);

      // Fetch results
      const data = await resultsService.getStudentResults({
        studentId: selectedStudent.id,
        academicYearId: selectedYear,
        termId: selectedTerm,
        examTypeId: selectedExamType,
      });

      setResults(data.results || []);
    } catch (error) {
      console.error("Failed to fetch results:", error);
      alert("Failed to fetch results. Please try again.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle print preview
  const handlePrintPreview = () => {
    if (!results.length || !selectedStudent) {
      alert("No results to print");
      return;
    }

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      const selectedYearObj = years.find(y => y.id === selectedYear);
      const selectedTermObj = terms.find(t => t.id === selectedTerm);
      const selectedGradeObj = grades.find(g => g.id === selectedGrade);
      const selectedClassObj = classes.find(c => c.id === selectedClass);
      const selectedExamTypeObj = examTypes.find(e => e.id === selectedExamType);

      printWindow.document.write(`
        <html>
          <head>
            <title>Student Results - ${selectedStudent.name}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              h1 { color: #333; margin: 0; }
              .student-info { margin-bottom: 20px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
              th { background-color: #f5f5f5; }
              .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Student Results Report</h1>
            </div>
            
            <div class="student-info">
              <p><strong>Student Name:</strong> ${selectedStudent.name}</p>
              <p><strong>Admission No:</strong> ${selectedStudent.admission_no}</p>
              <p><strong>Academic Year:</strong> ${selectedYearObj?.name || selectedYearObj?.year || "N/A"}</p>
              <p><strong>Term:</strong> ${selectedTermObj?.name || "N/A"}</p>
              <p><strong>Grade:</strong> ${selectedGradeObj?.name || "N/A"} (${selectedGradeObj?.code || "N/A"})</p>
              <p><strong>Class:</strong> ${selectedClassObj?.name || "N/A"}</p>
              <p><strong>Exam Type:</strong> ${selectedExamTypeObj?.name || "N/A"}</p>
            </div>
            
            <table>
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Subject Code</th>
                  <th>Marks</th>
                  <th>Grade</th>
                  <th>Grade Scale</th>
                </tr>
              </thead>
              <tbody>
                ${results.map(result => `
                  <tr>
                    <td>${result.subject_name}</td>
                    <td>${result.subject_code}</td>
                    <td>${result.marks}</td>
                    <td>${result.grade_scale || "N/A"}</td>
                    <td>${result.grade_scale_name || "N/A"}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            
            <div class="footer">
              <p>Printed on: ${new Date().toLocaleDateString()}</p>
              <p>${termLocked ? "✓ Term Locked - Results are final" : "⚠ Term Unlocked - Results may change"}</p>
            </div>
            
            <script>
              window.onload = function() {
                window.print();
                setTimeout(() => window.close(), 500);
              }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  // Handle edit result
  const handleEditResult = async (resultId: string) => {
    if (termLocked) {
      alert("Cannot edit results. Term is locked.");
      return;
    }

    const result = results.find(r => r.id === resultId);
    if (!result) return;

    const newMarks = prompt(`Enter new marks for ${result.subject_name} (Current: ${result.marks}):`);
    
    if (newMarks && !isNaN(Number(newMarks))) {
      try {
        await resultsService.updateResult(resultId, {
          marks: Number(newMarks),
          grade_scale: result.grade_scale || "",
          remarks: ""
        });
        alert("Result updated successfully");
        handleSearch();
      } catch (error) {
        console.error("Failed to update result:", error);
        alert("Failed to update result");
      }
    }
  };

  // Prepare filter options
  const filterOptions = {
    years: years.map(year => ({ id: year.id, name: year.name || year.year })),
    terms: terms.map(term => ({ id: term.id, name: term.name })),
    grades: grades.map(grade => ({ id: grade.id, name: grade.name, code: grade.code })),
    classes: classes.map(cls => ({ id: cls.id, name: cls.name })),
    examTypes: examTypes.map(exam => ({ id: exam.id, name: exam.name })),
  };

  return (
    <div className="space-y-6 p-6">
      <TopBar />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Student Results</h1>
          <p className="text-gray-600">View and manage individual student results</p>
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
      <QuickNavCards cards={quickNavCards} />

      {/* Filters Section */}
      <FiltersSection
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        selectedTerm={selectedTerm}
        setSelectedTerm={setSelectedTerm}
        selectedGrade={selectedGrade}
        setSelectedGrade={setSelectedGrade}
        selectedClass={selectedClass}
        setSelectedClass={setSelectedClass}
        selectedExamType={selectedExamType}
        setSelectedExamType={setSelectedExamType}
        years={filterOptions.years}
        terms={filterOptions.terms}
        grades={filterOptions.grades}
        classes={filterOptions.classes}
        examTypes={filterOptions.examTypes}
      />

      {/* Student Search */}
      <StudentSearch
        admissionNo={admissionNo}
        studentName={studentName}
        setAdmissionNo={setAdmissionNo}
        setStudentName={setStudentName}
        onSelectStudent={handleSelectStudent}
        onSearch={handleSearch}
        loading={loading}
      />

      {/* Results Table */}
      <ResultsTable
        results={results}
        termLocked={termLocked}
        studentName={studentName}
        onPrintPreview={handlePrintPreview}
        onEditResult={handleEditResult}
        loading={loading}
        admissionNo={admissionNo}
      />
    </div>
  );
};

export default StudentResults;