"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '@/components/admin/TopBar';
import ExamManagement from '@/components/admin/assessments/ExamManagement';
import EditExamModal from '@/components/admin/assessments/EditExamModal';
import ViewExamModal from '@/components/admin/assessments/ViewExamModal';
import { useExamStore } from '@/utils/examStore';
import { useExamHandlers } from '@/hooks/useExamHandlers';
import { useExamTypes } from '@/hooks/useExamTypes';
import type { Exam } from '@/types/assessment';

const TotalAssessmentsPage: React.FC = () => {
  const navigate = useNavigate();
  const { getExamsWithAutoStatus, loading: examsLoading, error: examsError, fetchExams } = useExamStore();
  const {
    editingExam,
    setEditingExam,
    handleUpdateExam,
    handleCloseExam,
    handleEditExam,
    handleActivateExam,
    loading: handlersLoading,
    error: handlersError,
  } = useExamHandlers();
  
  const { examTypes, loading: typesLoading, error: typesError } = useExamTypes();

  const [viewingExam, setViewingExam] = useState<Exam | null>(null);
  
  useEffect(() => {
    fetchExams();
  }, [fetchExams]);

  const allExams = getExamsWithAutoStatus();

  const handleViewDetailsModal = (exam: Exam) => {
    setViewingExam(exam);
  };

  const handleDownload = (filename: string) => {
    alert(`Downloading ${filename}...`);
  };

  const stats = useMemo(() => {
    return {
      total: allExams.length,
      upcoming: allExams.filter(exam => exam.status === 'scheduled').length,
      ongoing: allExams.filter(exam => exam.status === 'active').length,
      completed: allExams.filter(exam => exam.status === 'completed').length,
    };
  }, [allExams]);

  const loading = examsLoading || typesLoading || handlersLoading;
  const error = examsError || typesError || handlersError;

  // DON'T show full page loading/error states - table handles them internally

  return (
    <div className="space-y-6 p-6">
      <TopBar />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">All Assessments</h1>
          <p className="text-gray-600">
            Total: {stats.total} | Upcoming: {stats.upcoming} | Ongoing: {stats.ongoing} | Completed: {stats.completed}
          </p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:underline"
        >
          ← Back to Assessments
        </button>
      </div>

      <ExamManagement
        exams={allExams}
        onCreateExam={() => navigate('/admin/assessments')}
        onCloseExam={handleCloseExam}
        onEditExam={handleEditExam}
        onViewDetails={handleViewDetailsModal}
        onActivateExam={handleActivateExam}
        loading={loading}
        error={error}
      />

      {editingExam && (
        <EditExamModal
          isOpen={!!editingExam}
          onClose={() => setEditingExam(null)}
          onSave={handleUpdateExam}
          exam={editingExam}
          examTypes={examTypes}
        />
      )}

      {viewingExam && (
        <ViewExamModal
          exam={viewingExam}
          onClose={() => setViewingExam(null)}
          onDownload={handleDownload}
        />
      )}
    </div>
  );
};

export default TotalAssessmentsPage;