import api from "./api";
import type {
  FilterOption,
  Student,
  FilterOptionsResponse,
  Subject,
  GradeScale,
  ResultEntry,
} from "@/types/result";

export const resultsService = {
  // ================= FILTERS & SHARED =================

  // Get all filter options (years, terms, grades, classes, exam types, subjects)
  async getFilterOptions(): Promise<FilterOptionsResponse> {
    const response = await api.get("/filter-options");
    return response.data;
  },

  // Get classes by grade
  async getClassesByGrade(gradeId: string): Promise<FilterOption[]> {
    const response = await api.get("/classes", {
      params: { grade_id: gradeId },
    });
    return response.data;
  },

  // Get terms by academic year
  async getTermsByYear(yearId: string): Promise<FilterOption[]> {
    const response = await api.get("/terms", {
      params: { academic_year_id: yearId },
    });
    return response.data;
  },

  // Get subjects by grade & class
  async getSubjectsByGradeClass(
    gradeId: string,
    classId: string
  ): Promise<Subject[]> {
    const response = await api.get("/subjects", {
      params: { grade_id: gradeId, class_id: classId },
    });
    return response.data;
  },

  // Get students by class
  async getStudentsByClass(
    gradeId: string,
    classId: string
  ): Promise<Student[]> {
    const response = await api.get("/students", {
      params: { grade_id: gradeId, class_id: classId },
    });
    return response.data;
  },

  // Get grade scales
  async getGradeScales(): Promise<GradeScale[]> {
    const response = await api.get("/grade-scales");
    return response.data;
  },

  // ================= MARKS (CORE) =================

  // Get marks (results)
  async getResults(params: {
    exam_id: string;
  }): Promise<ResultEntry[]> {
    const response = await api.get("/marks", { params });
    return response.data;
  },

  // Add / save a mark
  async addResult(data: {
    student_id: string;
    exam_id: string;
    grade_scale_id: string;
    marks_obtained: number;
    remarks?: string;
  }): Promise<ResultEntry> {
    const response = await api.post("/marks", data);
    return response.data;
  },

  // Update a mark
  async updateResult(
    id: string,
    data: {
      marks_obtained: number;
      grade_scale_id: string;
      remarks?: string;
    }
  ): Promise<ResultEntry> {
    const response = await api.put(`/marks/${id}`, data);
    return response.data;
  },

  // Delete a mark
  async deleteResult(id: string): Promise<void> {
    await api.delete(`/marks/${id}`);
  },
};

export default resultsService;
