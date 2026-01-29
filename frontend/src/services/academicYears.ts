import api from '@/services/api';
import type { AcademicYear, AcademicYearFormData } from '@/types/academicyear';

export const academicYearService = {
  // Get all academic years
  async getAcademicYears(): Promise<AcademicYear[]> {
    const response = await api.get('/academic-years');
    return response.data;
  },

  // Get single academic year
  async getAcademicYear(id: string): Promise<AcademicYear> {
    const response = await api.get(`/academic-years/${id}`);
    return response.data;
  },

  // Create new academic year
  async createAcademicYear(data: AcademicYearFormData): Promise<AcademicYear> {
    const response = await api.post('/academic-years', data);
    return response.data;
  },

  // Update academic year
  async updateAcademicYear(id: string, data: AcademicYearFormData): Promise<AcademicYear> {
    const response = await api.put(`/academic-years/${id}`, data);
    return response.data;
  },

  // Activate academic year
  async activateAcademicYear(id: string): Promise<AcademicYear> {
    const year = await this.getAcademicYear(id);
    return this.updateAcademicYear(id, {
      ...year,
      status: 'active',
    });
  },

  // Close academic year
  async closeAcademicYear(id: string): Promise<AcademicYear> {
    const year = await this.getAcademicYear(id);
    return this.updateAcademicYear(id, {
      ...year,
      status: 'closed',
    });
  },
};