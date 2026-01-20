// types/result.ts
export interface Result {
  id: string;
  student_id: string;
  subject_id: string;
  exam_type_id: string;
  academic_year_id: string;
  term_id: string;
  marks: number;
  grade_scale_id: string;
  remarks?: string;
  created_at: string;
  updated_at: string;
}

export interface ExamType {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface GradeScale {
  id: string;
  name: string;
  min_score: number;
  max_score: number;
  grade: string;
  description?: string;
  created_at: string;
  updated_at: string;
}