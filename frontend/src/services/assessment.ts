// services/assessments.ts
import type { Exam, ExamType } from '@/types/assessment';
import api from '@/services/api';
import type { AxiosError } from 'axios';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

type FormDataValue = string | Blob;

class AssessmentService {
  private async fetchApi<T>(
    endpoint: string,
    options: {
      method?: 'GET' | 'POST' | 'PUT';
      data?: unknown;
    } = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await api({
        url: endpoint,
        method: options.method ?? 'GET',
        data: options.data,
      });

      return { data: response.data as T };
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      return {
        error:
          axiosError.response?.data?.message ||
          axiosError.message ||
          'An unknown error occurred',
      };
    }
  }


 /* =======================
     Exams 
  ======================== */

  getExams(): Promise<ApiResponse<Exam[]>> {
    return this.fetchApi<Exam[]>('/exams');
  }

  getExam(id: number): Promise<ApiResponse<Exam>> {
    return this.fetchApi<Exam>(`/exams/${id}`);
  }

  createExam(exam: {
    name: string;
    exam_type_id: number;
    class_id: number;
    subject_id: number;
    academic_year_id: number;
    term_id: number;
    exam_date: string;
    total_marks: number;
    attachment?: File;
  }): Promise<ApiResponse<Exam>> {
    const formData = new FormData();

    (Object.entries(exam) as [string, FormDataValue | number | undefined][])
      .forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, value instanceof Blob ? value : String(value));
        }
      });

    return this.fetchApi<Exam>('/exams', {
      method: 'POST',
      data: formData,
    });
  }

  updateExam(
    id: number,
    exam: {
      name?: string;
      exam_date?: string;
      total_marks?: number;
      status?: 'scheduled' | 'active' | 'completed';
      attachment?: File;
    }
  ): Promise<ApiResponse<Exam>> {
    const formData = new FormData();

    (Object.entries(exam) as [string, FormDataValue | number | undefined][])
      .forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, value instanceof Blob ? value : String(value));
        }
      });

    return this.fetchApi<Exam>(`/exams/${id}`, {
      method: 'PUT',
      data: formData,
    });
  }


  /* =======================
     Exam Types
  ======================== */

  getExamTypes(): Promise<ApiResponse<ExamType[]>> {
    return this.fetchApi<ExamType[]>('/exam-types');
  }

  createExamType(
    examType: Omit<ExamType, 'id'>
  ): Promise<ApiResponse<ExamType>> {
    return this.fetchApi<ExamType>('/exam-types', {
      method: 'POST',
      data: examType,
    });
  }

  updateExamType(
    id: number,
    examType: Partial<ExamType>
  ): Promise<ApiResponse<ExamType>> {
    return this.fetchApi<ExamType>(`/exam-types/${id}`, {
      method: 'PUT',
      data: examType,
    });
  }

  async deleteExamType(id: number) {
  try {
    const response = await api.delete(`/exam-types/${id}`);
    return response.data;
  } catch  {
    return {
      error: 'Failed to delete exam type',
    };
  }
  }
}

export const assessmentService = new AssessmentService();
