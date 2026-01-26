import { useState, useEffect } from 'react';
import type { ExamType } from '@/types/assessment';
import { assessmentService } from '@/services/assessment';

export const useExamTypes = () => {
  const [examTypes, setExamTypes] = useState<ExamType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExamTypes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await assessmentService.getExamTypes();
      if (response.error) {
        setError(response.error);
      } else {
        setExamTypes(response.data || []);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch exam types');
    } finally {
      setLoading(false);
    }
  };

  const createExamType = async (name: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await assessmentService.createExamType({ name });
      if (response.error) {
        setError(response.error);
        return false;
      } else if (response.data) {
        setExamTypes(prev => [...prev, response.data!]);
        return true;
      }
      return false;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create exam type');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateExamType = async (id: string, name: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await assessmentService.updateExamType(id, { name });
      if (response.error) {
        setError(response.error);
        return false;
      } else if (response.data) {
        setExamTypes(prev => 
          prev.map(type => type.id === id ? response.data! : type)
        );
        return true;
      }
      return false;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update exam type');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteExamType = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await assessmentService.deleteExamType(id);
      if (response.error) {
        setError(response.error);
        return false;
      } else {
        setExamTypes(prev => prev.filter(type => type.id !== id));
        return true;
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete exam type');
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExamTypes();
  }, []);

  return { 
    examTypes, 
    loading, 
    error, 
    createExamType, 
    updateExamType, 
    deleteExamType,
    refetch: fetchExamTypes 
  };
};