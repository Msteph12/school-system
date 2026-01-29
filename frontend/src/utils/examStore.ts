// utils/examStore.ts
import { create } from 'zustand';
import { assessmentService } from '@/services/assessment';
import type { Exam } from '@/types/assessment';

interface ExamStore {
  exams: Exam[];
  loading: boolean;
  error: string | null;

  fetchExams: () => Promise<void>;

  getExamsWithAutoStatus: () => (Exam & {
    status: 'scheduled' | 'active' | 'completed';
  })[];

  addExam: (exam: {
    name: string;
    exam_type_id: number;
    class_id: number;
    subject_id: number;
    academic_year_id: number;
    term_id: number;
    exam_date: string;
    total_marks: number;
  }) => Promise<void>;

  updateExam: (
    id: number,
    updates: {
      name?: string;
      exam_date?: string;
      total_marks?: number;
    }
  ) => Promise<void>;
}

export const useExamStore = create<ExamStore>((set, get) => ({
  exams: [],
  loading: false,
  error: null,

  fetchExams: async () => {
    set({ loading: true, error: null });
    try {
      const res = await assessmentService.getExams();
      set({ exams: res.data ?? [], loading: false });
    } catch {
      set({ error: 'Failed to fetch exams', loading: false });
    }
  },

  getExamsWithAutoStatus: () => {
  const today = new Date().toDateString();

  return get().exams.map((exam) => {
    // If backend already sent status, trust it
    if (exam.status) return exam as Exam & { status: 'scheduled' | 'active' | 'completed' };

    // Fallback ONLY if status is missing
    const examDate = new Date(exam.exam_date).toDateString();

    let status: 'scheduled' | 'active' | 'completed';
    if (examDate > today) status = 'scheduled';
    else if (examDate === today) status = 'active';
    else status = 'completed';

    return { ...exam, status };
  });
  },

  addExam: async (examData) => {
    set({ loading: true, error: null });
    try {
      const res = await assessmentService.createExam(examData);
      if (res.data) {
        set((s) => ({
          exams: [...s.exams, res.data as Exam],
          loading: false,
        }));
      } else {
        set({ error: res.error || 'Failed to create exam', loading: false });
      }
    } catch {
      set({ error: 'Failed to create exam', loading: false });
    }
  },

  updateExam: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const res = await assessmentService.updateExam(id, updates);
      if (res.data) {
        set((s) => ({
          exams: s.exams.map((e) => (e.id === id ? res.data! : e)),
          loading: false,
        }));
      } else {
        set({ error: res.error || 'Failed to update exam', loading: false });
      }
    } catch {
      set({ error: 'Failed to update exam', loading: false });
    }
  },
}));
