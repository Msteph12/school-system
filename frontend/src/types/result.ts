// types/result.ts
export interface FilterOption {
  id: string;
  name: string;
  code?: string;
  grade_id?: string;
}

export interface AcademicYear extends FilterOption {
  year: string;
  is_current: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Term extends FilterOption {
  academic_year_id?: string;
  is_locked?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Grade extends FilterOption {
  created_at?: string;
  updated_at?: string;
}

export interface Class extends FilterOption {
  created_at?: string;
  updated_at?: string;
}

export interface ExamType extends FilterOption {
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Subject extends FilterOption {
  created_at?: string;
  updated_at?: string;
}

export interface Student {
  id: string;
  admission_no: string;
  name: string;
  grade_id: string;
  class_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface GradeScale {
  id: string;
  name: string;
  min_score: number;
  max_score: number;
  grade: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

// For EnterResults (display purposes)
export interface ResultEntry {
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

// For StudentResults (display purposes)
export interface ResultDisplay {
  id: string;
  subject_name: string;
  subject_code: string;
  marks: number;
  grade_scale?: string;
  grade_scale_name?: string;
  exam_type_name?: string;
}

export interface QuickNavCard {
  title: string;
  description: string;
  gradient: string;
  onClick: () => void;
}

// API Response Types
export interface FilterOptionsResponse {
  years: AcademicYear[];
  terms: Term[];
  grades: Grade[];
  classes: Class[];
  exam_types: ExamType[];
  subjects?: Subject[];
}

export interface StudentResultsResponse {
  student: Student;
  results: ResultDisplay[];
  summary: {
    total_marks: number;
    average: number;
    rank?: number;
    term_locked: boolean;
  };
}

// For batch operations in EnterResults
export interface BatchResultData {
  student_id: string;
  subject_id: string;
  exam_type_id: string;
  academic_year_id: string;
  term_id: string;
  marks: number;
  grade_scale_id: string;
  remarks?: string;
}