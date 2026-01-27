export interface TimeSlot {
  id?: number;  // Make optional
  startTime: string;
  endTime: string;
  type?: "exam" | "break" | "lunch"; // Make optional
}

export interface ExamSubject {
  id: number;
  name: string;
  code: string;
  gradeId: number;
  duration: number; // in minutes
  maxMarks: number;
}

export interface ExamTimetableEntry {
  id: string;
  examId: number;
  subjectId: number;
  subjectName: string;
  paperLabel: string;
  date: string;
  day: string;
  timeSlotId: number;
  startTime: string;
  endTime: string;
  duration: number;
  gradeId: number;
  gradeName: string;
  examTypeId: number;
  venue: string;
  invigilator: string;
}

export interface ExamTimetable {
  id: number;
  name: string;
  gradeId: number;
  gradeName: string;
  examTypeId: number;
  startDate: string;
  endDate: string;
  maxPapersPerDay: number;
  timeSlots: TimeSlot[];
  entries: ExamTimetableEntry[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  totalSubjects: number;
  totalPapers: number;
}

export interface ExamTimetableFilters {
  gradeId?: number | null;
  examTypeId?: number;
  startDate?: string;
  endDate?: string;
  maxPapersPerDay?: number;
  subjectIds?: number[];
}

export interface GenerateExamTimetableRequest {
  gradeId: number;
  examTypeId: number;
  startDate: string;
  endDate: string;
  maxPapersPerDay: number;
  subjectIds: number[];
  timeSlots: TimeSlot[];
}

export interface ExamTimetableStats {
  totalExams: number;
  totalDays: number;
  papersPerDay: { [date: string]: number };
  subjectDistribution: { subject: string; count: number }[];
}