import api from './api';
import type { GradeScale, GradeFormData } from '@/types/grade';

// Backend shape
interface GradeScaleApi {
  id: string;
  name: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

// API → UI
const mapApiToUi = (grade: GradeScaleApi): GradeScale => ({
  id: grade.id,
  name: grade.name,
  status: grade.is_active ? 'active' : 'inactive',
  created_at: grade.created_at,
  updated_at: grade.updated_at,
});

// UI → API
const mapUiToApi = (data: GradeFormData) => ({
  name: data.name,
  is_active: data.status === 'active',
});

export const gradeService = {
  async getGradeScales(): Promise<GradeScale[]> {
    const response = await api.get<GradeScaleApi[]>('/grade-scales');
    return response.data.map(mapApiToUi);
  },

  async createGradeScale(data: GradeFormData): Promise<GradeScale> {
    const response = await api.post<GradeScaleApi>(
      '/grade-scales',
      mapUiToApi(data)
    );
    return mapApiToUi(response.data);
  },

  async updateGradeScale(id: string, data: GradeFormData): Promise<GradeScale> {
    const response = await api.put<GradeScaleApi>(
      `/grade-scales/${id}`,
      mapUiToApi(data)
    );
    return mapApiToUi(response.data);
  },

  async toggleGradeScaleStatus(id: string): Promise<GradeScale> {
    const response = await api.patch<GradeScaleApi>(
      `/grade-scales/${id}/toggle-status`
    );
    return mapApiToUi(response.data);
  },

  async deleteGradeScale(id: string): Promise<void> {
    await api.delete(`/grade-scales/${id}`);
  },
};
