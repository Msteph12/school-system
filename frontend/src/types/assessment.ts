// types/assessment.ts - UPDATED
export interface Exam {
  id: number;
  name: string;
  exam_type_id: number;       // Changed from 'type'
  class_id: number;
  subject_id: number;
  academic_year_id: number;
  term_id: number;
  exam_date: string;          // Changed from startDate/endDate
  total_marks: number;
  status?: 'scheduled' | 'active' | 'completed';

  attachment?: string;
  
  // Optional relationships (from ->with()) 
  grade?: {
      id: number;
      name: string;
  };
  class?: {
    id: number;
    name: string;
  };
  subject?: {
    id: number;
    name: string;
  };
  academicYear?: {
    id: number;
    name: string;
  };
  term?: {
    id: number;
    name: string;
  };
  examType?: {
    id: number;
    name: string;
  };
}

// Add supporting types
export interface SchoolClass {
  id: number;
  name: string;
  grade_id: number;
}

export interface Subject {
  id: number;
  name: string;
  code?: string;
}

export interface AcademicYear {
  id: number;
  name: string;
  is_active: boolean;
}

export interface Term {
  id: number;
  name: string;
  is_closed: boolean;
}

export interface ExamType {
  id: number;
  name: string;
}