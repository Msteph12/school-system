import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExamStore } from '@/utils/examStore';
import type { Exam } from '@/types/assessment';

export const useExamHandlers = () => {
  const navigate = useNavigate();
  const { addExam, updateExam, deleteExam } = useExamStore();
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [forceUpdate, setForceUpdate] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateExam = async (examData: Omit<Exam, 'id'>) => {
    setLoading(true);
    setError(null);
    try {
      await addExam(examData);
      alert('Exam created successfully!');
      setForceUpdate(prev => prev + 1);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create exam';
      setError(message);
      alert(`Error: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateExam = async (updatedExam: Exam) => {
    setLoading(true);
    setError(null);
    try {
      await updateExam(updatedExam.id, updatedExam);
      setEditingExam(null);
      alert('Exam updated successfully!');
      setForceUpdate(prev => prev + 1);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update exam';
      setError(message);
      alert(`Error: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExam = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const shouldDelete = window.confirm('Are you sure you want to delete this exam?');
      if (shouldDelete) {
        await deleteExam(id);
        alert('Exam deleted successfully!');
        setForceUpdate(prev => prev + 1);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete exam';
      setError(message);
      alert(`Error: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseExam = async (id: string, startDate?: string) => {
    setLoading(true);
    setError(null);
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const shouldClose = window.confirm(
        `Are you sure you want to close this exam? This will mark it as "completed" and set the end date to today (${today}).`
      );
      
      if (shouldClose) {
        await updateExam(id, {
          status: 'completed',
          endDate: today,
          startDate: startDate && new Date(startDate) > new Date() ? today : startDate
        });
        
        alert('Exam closed successfully! It will now appear in the completed exams section.');
        setForceUpdate(prev => prev + 1);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to close exam';
      setError(message);
      alert(`Error: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleActivateExam = async (exam: Exam) => {
    setLoading(true);
    setError(null);
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const startDate = new Date(exam.startDate);
      const endDate = new Date(exam.endDate);
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const durationDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      
      const newEndDate = new Date();
      newEndDate.setDate(newEndDate.getDate() + (durationDays - 1));
      const formattedEndDate = newEndDate.toISOString().split('T')[0];
      
      const shouldActivate = window.confirm(
        `Activate this exam? It will start today (${today}) and end on ${formattedEndDate}, maintaining the original ${durationDays} day duration.`
      );
      
      if (shouldActivate) {
        await updateExam(exam.id, {
          startDate: today,
          endDate: formattedEndDate
        });
        alert('Exam activated successfully! It is now ongoing.');
        setForceUpdate(prev => prev + 1);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to activate exam';
      setError(message);
      alert(`Error: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditExam = (exam: Exam) => {
    setEditingExam(exam);
  };

  const handleViewDetails = (exam: Exam) => {
    navigate(`/admin/assessments/${exam.id}`, { state: { exam } });
  };

  return {
    editingExam,
    setEditingExam,
    forceUpdate,
    loading,
    error,
    handleCreateExam,
    handleUpdateExam,
    handleDeleteExam,
    handleCloseExam,
    handleActivateExam,
    handleEditExam,
    handleViewDetails,
  };
};