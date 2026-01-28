// types/assessment.ts
export interface Exam {
  id: number;
  name: string;
  term: string;
  grade: string;
  startDate: string;
  endDate: string;
  status: 'scheduled' | 'active' | 'completed';
  type: string; // exam type name or slug
  attachment?: string;
}

export interface AssessmentStats {
  total: number;
  upcoming: number;
  ongoing: number;
  completed: number;
}

export interface ExamType {
  id: number;
  name: string;
}
