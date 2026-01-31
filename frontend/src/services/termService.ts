import type { Term } from '@/types/term';
import api from '@/services/api';

export const termService = {
  async getTerms(): Promise<Term[]> {
    try {
      const response = await api.get('/terms');
      return response.data;
    } catch (error) {
      console.error('Error fetching terms:', error);
      throw error;
    }
  },

    async activateTerm(termId: string) {
    return api.post(`/terms/${termId}/activate`);
  },

  async lockTerm(termId: string): Promise<Term> {
    try {
      const response = await api.post(`/terms/${termId}/lock`);
      return response.data;
    } catch (error) {
      console.error('Error locking term:', error);
      throw error;
    }
  },

  async unlockTerm(termId: string): Promise<Term> {
    try {
      const response = await api.post(`/terms/${termId}/unlock`);
      return response.data;
    } catch (error) {
      console.error('Error unlocking term:', error);
      throw error;
    }
  },
};

