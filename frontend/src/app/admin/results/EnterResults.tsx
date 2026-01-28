"use client";

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "@/components/admin/TopBar";
import QuickNavCards from "@/components/admin/results/QuickNavCards";
import EnterResultsFilters from "@/components/admin/results/EnterResultsFilters";
import EnterResultsActions from "@/components/admin/results/EnterResultsActions";
import EnterResultsTable from "@/components/admin/results/EnterResultsTable";
import ResultsModal from "@/components/admin/results/ResultsModal";
import { resultsService } from "@/services/resultsService";
import type { 
  QuickNavCard, 
  AcademicYear, 
  Term, 
  Grade, 
  Class, 
  ExamType,
  Subject,
  Student,
  ResultEntry,
  GradeScale
} from "@/types/result";

const EnterResults = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [results, setResults] = useState<ResultEntry[]>([]);
  
  // Filter states
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedTerm, setSelectedTerm] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedExamType, setSelectedExamType] = useState("");

  // Data states
  const [years, setYears] = useState<AcademicYear[]>([]);
  const [terms, setTerms] = useState<Term[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [examTypes, setExamTypes] = useState<ExamType[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [gradeScales, setGradeScales] = useState<GradeScale[]>([]);

  // Quick navigation cards
  const quickNavCards: QuickNavCard[] = [
    {
      title: "Grade Scale",
      description: "Set and manage grade scale",
      gradient: "from-red-600/80 to-red-400/80",
      onClick: () => navigate("/admin/GradeScalePage"),
    },
    {
      title: "Term Lock Status",
      description: "Lock/unlock terms for results",
      gradient: "from-green-600/80 to-green-400/80",
      onClick: () => navigate("/admin/TermLock"),
    },
    {
      title: "Student Results",
      description: "View individual student results",
      gradient: "from-blue-600/80 to-blue-400/80",
      onClick: () => navigate("/admin/StudentResults"),
    },
  ];

  // Load all initial data
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        const [filters, scales] = await Promise.all([
          resultsService.getFilterOptions(),
          resultsService.getGradeScales()
        ]);

        setYears(filters.years || []);
        setTerms(filters.terms || []);
        setGrades(filters.grades || []);
        setClasses(filters.classes || []);
        setExamTypes(filters.exam_types || []);
        setSubjects(filters.subjects || []);
        setGradeScales(scales);

        const currentYear = filters.years?.find(year => year.is_current);
        if (currentYear) setSelectedYear(currentYear.id);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
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
          console.error("Error loading terms:", error);
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
          setSelectedSubject("");
          setSubjects([]);
        } catch (error) {
          console.error("Error loading classes:", error);
          setClasses([]);
        }
      } else {
        setClasses([]);
        setSelectedClass("");
        setSubjects([]);
      }
    };

    loadClasses();
  }, [selectedGrade]);

  // Load subjects when class is selected
  useEffect(() => {
    const loadSubjects = async () => {
      if (selectedGrade && selectedClass) {
        try {
          const subjectsData = await resultsService.getSubjectsByGradeClass(
            selectedGrade, 
            selectedClass
          );
          setSubjects(subjectsData || []);
          setSelectedSubject("");
        } catch (error) {
          console.error("Error loading subjects:", error);
          setSubjects([]);
        }
      } else {
        setSubjects([]);
        setSelectedSubject("");
      }
    };

    loadSubjects();
  }, [selectedGrade, selectedClass]);

  // Load students when grade and class are selected
  useEffect(() => {
    const loadStudents = async () => {
      if (selectedGrade && selectedClass) {
        try {
          const studentsData = await resultsService.getStudentsByClass(
            selectedGrade, 
            selectedClass
          );
          setStudents(studentsData || []);
        } catch (error) {
          console.error("Error loading students:", error);
          setStudents([]);
        }
      } else {
        setStudents([]);
      }
    };

    loadStudents();
  }, [selectedGrade, selectedClass]);

  // Load existing results - useCallback to avoid dependency issues
const loadResults = useCallback(async () => {
  if (
    !selectedYear ||
    !selectedTerm ||
    !selectedGrade ||
    !selectedClass ||
    !selectedSubject ||
    !selectedExamType
  ) {
    setResults([]);
    return;
  }

  try {
    const resultsData = await resultsService.getResults({
      exam_id: selectedExamType,
    });

    setResults(resultsData || []);
  } catch (error) {
    console.error(error);
    setResults([]);
  }
  }, [selectedExamType, selectedYear, selectedTerm, selectedGrade, selectedClass, selectedSubject]);

  useEffect(() => {
    loadResults();
  }, [loadResults]);

  // Check if all criteria are selected
  const allCriteriaSelected = (): boolean => {
    return Boolean(
      selectedYear && 
      selectedTerm && 
      selectedGrade && 
      selectedClass && 
      selectedSubject && 
      selectedExamType
    );
  };

  const handleEditResult = (result: ResultEntry) => {
  console.log(result);
  };


  // Handle delete result
  const handleDeleteResult = async (id: string) => {
    if (!confirm("Are you sure you want to delete this result?")) return;

    try {
      await resultsService.deleteResult(id);
      setResults(prev => prev.filter(result => result.id !== id));
      alert("Result deleted successfully!");
    } catch (error) {
      console.error("Error deleting result:", error);
      alert("Failed to delete result.");
    }
  };

  // Handle save result
 const handleSaveResult = async (data: {
  studentId: string;
  marks: number;
  gradeScaleId: string;
  remarks?: string;
}) => {
  if (!allCriteriaSelected()) return;

  try {
    await resultsService.addResult({
      student_id: data.studentId,
      exam_id: selectedExamType, // exam already created from exam type
      grade_scale_id: data.gradeScaleId,
      marks_obtained: data.marks,
      remarks: data.remarks
    });

    await loadResults();
    setShowModal(false);
    alert("Result saved successfully!");
  } catch (error) {
    console.error("Error saving result:", error);
    alert("Failed to save result.");
  }
};


  const filterOptions = {
    years: years.map(year => ({ id: year.id, name: year.name || year.year })),
    terms: terms.map(term => ({ id: term.id, name: term.name })),
    grades: grades.map(grade => ({ id: grade.id, name: grade.name, code: grade.code })),
    classes: classes.map(cls => ({ id: cls.id, name: cls.name })),
    subjects: subjects.map(subject => ({ id: subject.id, name: subject.name, code: subject.code })),
    examTypes: examTypes.map(exam => ({ id: exam.id, name: exam.name })),
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

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Enter Results</h1>
          <p className="text-gray-600">Enter and manage student examination results</p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:underline"
        >
          ← Back
        </button>
      </div>

      <QuickNavCards cards={quickNavCards} />

      <EnterResultsFilters
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        selectedTerm={selectedTerm}
        setSelectedTerm={setSelectedTerm}
        selectedGrade={selectedGrade}
        setSelectedGrade={setSelectedGrade}
        selectedClass={selectedClass}
        setSelectedClass={setSelectedClass}
        selectedSubject={selectedSubject}
        setSelectedSubject={setSelectedSubject}
        selectedExamType={selectedExamType}
        setSelectedExamType={setSelectedExamType}
        filterOptions={filterOptions}
      />

      <EnterResultsActions
        allCriteriaSelected={allCriteriaSelected()}
        selectedSubject={selectedSubject}
        subjects={subjects}
        examTypes={examTypes}
        selectedExamType={selectedExamType}
        onAddResult={() => setShowModal(true)}
      />

      <EnterResultsTable
        results={results}
        onEditResult={handleEditResult}
        onDeleteResult={handleDeleteResult}
        allCriteriaSelected={allCriteriaSelected()}
      />

      {showModal && (
        <ResultsModal
          students={students}
          gradeScales={gradeScales}
          onSave={handleSaveResult}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default EnterResults;