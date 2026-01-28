import type { Exam, ExamType } from '@/types/assessment';
import api from '@/services/api';
import type { AxiosError } from 'axios';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

class AssessmentService {
  private async fetchApi<T>(
    endpoint: string,
    options: {
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
      data?: unknown;
    } = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await api({
        url: endpoint,
        method: options.method || 'GET',
        data: options.data,
      });

      return { data: response.data as T };
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);

      const axiosError = error as AxiosError<{ message?: string }>;
      const errorMessage =
        axiosError.response?.data?.message ||
        axiosError.message ||
        'An unknown error occurred';

      return { error: errorMessage };
    }
  }

  // Exams
  async getExams(): Promise<ApiResponse<Exam[]>> {
    return this.fetchApi<Exam[]>('/exams');
  }

  async getExam(id: number): Promise<ApiResponse<Exam>> {
    return this.fetchApi<Exam>(`/exams/${id}`);
  }

  async createExam(exam: Omit<Exam, 'id'>): Promise<ApiResponse<Exam>> {
    return this.fetchApi<Exam>('/exams', {
      method: 'POST',
      data: exam,
    });
  }

  async updateExam(id: number, exam: Partial<Exam>): Promise<ApiResponse<Exam>> {
    return this.fetchApi<Exam>(`/exams/${id}`, {
      method: 'PUT',
      data: exam,
    });
  }

  async deleteExam(id: number): Promise<ApiResponse<void>> {
    return this.fetchApi<void>(`/exams/${id}`, {
      method: 'DELETE',
    });
  }

  // Exam Types
  async getExamTypes(): Promise<ApiResponse<ExamType[]>> {
    return this.fetchApi<ExamType[]>('/exam-types');
  }

  async createExamType(
    examType: Omit<ExamType, 'id'>
  ): Promise<ApiResponse<ExamType>> {
    return this.fetchApi<ExamType>('/exam-types', {
      method: 'POST',
      data: examType,
    });
  }

  async updateExamType(
    id: number,
    examType: Partial<ExamType>
  ): Promise<ApiResponse<ExamType>> {
    return this.fetchApi<ExamType>(`/exam-types/${id}`, {
      method: 'PUT',
      data: examType,
    });
  }

  async deleteExamType(id: number): Promise<ApiResponse<void>> {
    return this.fetchApi<void>(`/exam-types/${id}`, {
      method: 'DELETE',
    });
  }
}

export const assessmentService = new AssessmentService();
