// hooks/useExamHandlers.ts
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { assessmentService } from '@/services/assessment';
import type { Exam } from '@/types/assessment';

export const useExamHandlers = () => {
  const navigate = useNavigate();
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateExam = async (examData: {
    name: string;
    exam_type_id: number;
    class_id: number;
    subject_id: number;
    academic_year_id: number;
    term_id: number;
    exam_date: string;
    total_marks: number;
  }): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await assessmentService.createExam(examData);
      if (response.error) throw new Error(response.error);

      alert('Exam created successfully!');
      return true;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to create exam';
      setError(message);
      alert(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateExam = async (
    id: number,
    examData: { name?: string; exam_date?: string; total_marks?: number }
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await assessmentService.updateExam(id, examData);
      if (response.error) throw new Error(response.error);

      setEditingExam(null);
      alert('Exam updated successfully!');
      return true;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to update exam';
      setError(message);
      alert(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleCloseExam = async (id: string): Promise<void> => {
    alert(`Closing exam ${id} not implemented yet`);
  };

  const handleActivateExam = async (exam: Exam): Promise<void> => {
    alert(`Activating exam "${exam.name}" not implemented yet`);
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
    loading,
    error,
    handleCreateExam,
    handleUpdateExam,
    handleCloseExam,
    handleActivateExam,
    handleEditExam,
    handleViewDetails,
  };
};
