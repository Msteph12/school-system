import api from './api';
import type { 
  FilterOption, 
  Student,
  StudentResultsResponse,
  FilterOptionsResponse,
  Subject,
  GradeScale,
  ResultEntry,
  BatchResultData
} from '@/types/result';

export const resultsService = {
  // ===== SHARED METHODS (Used by both EnterResults & StudentResults) =====
  
  // 1. Get all filter options
  async getFilterOptions(): Promise<FilterOptionsResponse> {
    const response = await api.get('/filter-options');
    return response.data;
  },

  // 2. Get classes for a specific grade
  async getClassesByGrade(gradeId: string): Promise<FilterOption[]> {
    const response = await api.get(`/classes?grade_id=${gradeId}`);
    return response.data;
  },

  // 3. Get terms for a specific academic year
  async getTermsByYear(yearId: string): Promise<FilterOption[]> {
    const response = await api.get(`/terms?academic_year_id=${yearId}`);
    return response.data;
  },

  // 4. Search students
  async searchStudents(query: string): Promise<{ students: Student[] }> {
    const response = await api.get(`/students/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  // 5. Check term lock status
  async checkTermLockStatus(termId: string): Promise<{ is_locked: boolean }> {
    const response = await api.get(`/terms/${termId}/lock-status`);
    return response.data;
  },

  // ===== METHODS FOR ENTER RESULTS =====
  
  // 6. Get subjects for a specific grade and class
  async getSubjectsByGradeClass(gradeId: string, classId: string): Promise<Subject[]> {
    const response = await api.get(`/subjects?grade_id=${gradeId}&class_id=${classId}`);
    return response.data;
  },

  // 7. Get students by grade and class
  async getStudentsByClass(gradeId: string, classId: string): Promise<Student[]> {
    const response = await api.get('/students', {
      params: { grade_id: gradeId, class_id: classId }
    });
    return response.data;
  },

  // 8. Get grade scales
  async getGradeScales(): Promise<GradeScale[]> {
    const response = await api.get('/grade-scales');
    return response.data;
  },

  // 9. Get existing results (for editing/viewing)
  async getResults(filters: {
    grade_id?: string;
    class_id?: string;
    subject_id?: string;
    exam_type_id?: string;
    academic_year_id?: string;
    term_id?: string;
  }): Promise<ResultEntry[]> {
    const response = await api.get('/results', { params: filters });
    return response.data;
  },

  // 10. Add single result
  async addResult(data: {
    student_id: string;
    subject_id: string;
    exam_type_id: string;
    academic_year_id: string;
    term_id: string;
    marks: number;
    grade_scale_id: string;
    remarks?: string;
  }): Promise<ResultEntry> {
    const response = await api.post('/results', data);
    return response.data;
  },

  // 11. Update result
  async updateResult(id: string, data: {
    marks: number;
    grade_scale: string; // Change from grade_scale_id
    remarks?: string;
  }): Promise<ResultEntry> {
    const response = await api.put(`/results/${id}`, data);
    return response.data;
  },

  // 12. Delete result
  async deleteResult(id: string): Promise<{ success: boolean }> {
    const response = await api.delete(`/results/${id}`);
    return response.data;
  },

  // 13. Save multiple results at once
  async saveResultsBatch(results: BatchResultData[]): Promise<{ 
    success: boolean; 
    message: string;
    processed: number;
    failed: number;
  }> {
    const response = await api.post('/results/batch', { results });
    return response.data;
  },

  // 14. Check if results already exist (prevent duplicates)
  async checkExistingResults(params: {
    academic_year_id: string;
    term_id: string;
    exam_type_id: string;
    grade_id: string;
    class_id: string;
    subject_id: string;
  }): Promise<{ exists: boolean; count: number }> {
    const response = await api.get('/results/check-existing', { params });
    return response.data;
  },

  // ===== METHODS FOR STUDENT RESULTS =====
  
  // 15. Get student results with all details
  async getStudentResults(params: {
    studentId: string;
    academicYearId: string;
    termId: string;
    examTypeId: string;
  }): Promise<StudentResultsResponse> {
    const response = await api.get('/student-results', { params });
    return response.data;
  },

  // 16. Upload results from file
  async uploadResultsFile(file: File): Promise<{
    success: boolean;
    message: string;
    processed: number;
    failed: number;
    errors?: Array<{ row: number; error: string }>
  }> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/results/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }
};

export default resultsService;