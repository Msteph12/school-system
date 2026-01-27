import { create } from 'zustand';
import { assessmentService } from '@/services/assessment';
import type { Exam } from '@/types/assessment';

interface ExamStore {
  exams: Exam[];
  loading: boolean;
  error: string | null;
  fetchExams: () => Promise<void>;
  addExam: (exam: Omit<Exam, 'id'>) => Promise<void>;
  updateExam: (id: string, exam: Partial<Exam>) => Promise<void>;
  deleteExam: (id: string) => Promise<void>;
  getExamsWithAutoStatus: () => Exam[];
  getCompletedExams: () => Exam[];
}

// Function to determine status based on current date
const getAutoStatus = (exam: Omit<Exam, 'id'> | Exam): Exam['status'] => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // Date only, no time
  
  const startDate = new Date(exam.startDate);
  const startDateOnly = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  
  const endDate = new Date(exam.endDate);
  const endDateOnly = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
  
  // If end date has passed, exam should be completed
  if (endDateOnly < today) {
    return 'completed';
  }
  
  // If today is between start and end dates (inclusive), exam should be active
  if (startDateOnly <= today && endDateOnly >= today) {
    return 'active';
  }
  
  // If start date is in the future, exam should be scheduled
  if (startDateOnly > today) {
    return 'scheduled';
  }
  
  // Default fallback
  return 'completed';
};

export const useExamStore = create<ExamStore>((set, get) => ({
  exams: [],
  loading: false,
  error: null,
  
  fetchExams: async () => {
    set({ loading: true, error: null });
    try {
      const response = await assessmentService.getExams();
      if (response.error) {
        set({ error: response.error, loading: false });
      } else {
        set({ exams: response.data || [], loading: false });
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch exams', 
        loading: false 
      });
    }
  },
  
  addExam: async (exam: Omit<Exam, 'id'>) => {
    set({ loading: true, error: null });
    try {
      const autoStatus = getAutoStatus(exam);
      const examWithStatus = { ...exam, status: autoStatus };
      
      const response = await assessmentService.createExam(examWithStatus);
      if (response.error) {
        set({ error: response.error, loading: false });
        throw new Error(response.error);
      } else if (response.data) {
        set((state) => ({ 
          exams: [...state.exams, response.data!], 
          loading: false 
        }));
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create exam', 
        loading: false 
      });
      throw error;
    }
  },
  
  updateExam: async (id, updatedExam) => {
    set({ loading: true, error: null });
    try {
      // If explicitly closing an exam
      if (updatedExam.status === 'completed') {
        const today = new Date().toISOString().split('T')[0];
        updatedExam = {
          ...updatedExam,
          status: 'completed',
          endDate: today,
          startDate: new Date(updatedExam.startDate || '') > new Date() ? today : updatedExam.startDate
        };
      }
      
      // If no status provided in update, calculate it
      if (!updatedExam.status) {
        const existingExam = get().exams.find(exam => exam.id === id);
        if (existingExam) {
          const mergedExam = { ...existingExam, ...updatedExam };
          const autoStatus = getAutoStatus(mergedExam);
          updatedExam = { ...updatedExam, status: autoStatus };
        }
      }
      
      const response = await assessmentService.updateExam(id, updatedExam);
      if (response.error) {
        set({ error: response.error, loading: false });
        throw new Error(response.error);
      } else if (response.data) {
        set((state) => ({
          exams: state.exams.map((exam) => {
            if (exam.id !== id) return exam;
            return response.data!;
          }),
          loading: false
        }));
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update exam', 
        loading: false 
      });
      throw error;
    }
  },
  
  deleteExam: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await assessmentService.deleteExam(id);
      if (response.error) {
        set({ error: response.error, loading: false });
        throw new Error(response.error);
      } else {
        set((state) => ({
          exams: state.exams.filter((exam) => exam.id !== id),
          loading: false
        }));
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete exam', 
        loading: false 
      });
      throw error;
    }
  },
  
  // Get exams with auto-calculated statuses (for display)
  getExamsWithAutoStatus: () => {
    const { exams } = get();
    return exams.map(exam => {
      // For display, use the stored status if it's 'completed' (manually closed)
      if (exam.status === 'completed') {
        return exam;
      }
      
      // Otherwise, calculate status based on dates
      const autoStatus = getAutoStatus(exam);
      return { ...exam, status: autoStatus };
    });
  },
  
  // Get only completed exams
  getCompletedExams: () => {
    const { exams } = get();
    return exams.filter(exam => exam.status === 'completed');
  },
}));