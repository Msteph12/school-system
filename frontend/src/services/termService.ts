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

  async validateTermLock(termId: string): Promise<{ isValid: boolean; message?: string }> {
    try {
      const response = await api.get(`/terms/${termId}/validate-lock`);
      return response.data;
    } catch (error) {
      console.error('Error validating term lock:', error);
      // Return a default validation error if API fails
      return { 
        isValid: false, 
        message: 'Unable to validate term lock. Please try again.' 
      };
    }
  },

  async getTermHistory(): Promise<Array<{
    action: string;
    date: string;
    user: string;
    note: string;
  }>> {
    try {
      const response = await api.get('/terms/history');
      return response.data;
    } catch (error) {
      console.error('Error fetching term history:', error);
      throw error;
    }
  }
};