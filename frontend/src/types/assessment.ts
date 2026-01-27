// types/assessment.ts
export interface Exam {
  id: string;
  name: string;
  term: string;
  grade: string;
  startDate: string;
  endDate: string;
  status: 'scheduled' | 'active' | 'completed';
  type: string; // Changed from specific types to string to support dynamic exam types
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

