"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '@/components/admin/TopBar';
import QuickNavCards from '@/components/admin/assessments/QuickNavCards';
import ExamManagement from '@/components/admin/assessments/ExamManagement';
import CreateExamModal from '@/components/admin/assessments/CreateExamModal';
import EditExamModal from '@/components/admin/assessments/EditExamModal';
import ViewExamModal from '@/components/admin/assessments/ViewExamModal';
import { useExamStore } from '@/utils/examStore';
import { useExamTypes } from '@/hooks/useExamTypes';
import type { Exam } from '@/types/assessment';

const AssessmentsPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    exams, 
    fetchExams, 
    addExam, 
    updateExam, 
    getExamsWithAutoStatus,
    loading: examsLoading,
    error: examsError 
  } = useExamStore();
  
  const { examTypes, loading: typesLoading, error: typesError } = useExamTypes();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [viewingExam, setViewingExam] = useState<Exam | null>(null);

  useEffect(() => {
    fetchExams();
  }, [fetchExams]);

  // Get exams for display - use auto-status calculation
  const displayExams = getExamsWithAutoStatus();
  
  // Calculate stats for quick nav cards
  const stats = useMemo(() => {
    return {
      total: exams.length,
      upcoming: displayExams.filter(exam => exam.status === 'scheduled').length,
      ongoing: displayExams.filter(exam => exam.status === 'active').length,
      completed: displayExams.filter(exam => exam.status === 'completed').length,
    };
  }, [exams, displayExams]);

  const quickNavCards = [
    {
      title: "Assessment Setup",
      description: "Manage exam types and settings",
      gradient: "from-indigo-600/80 to-indigo-400/80",
      onClick: () => navigate("/admin/assessments/setup"),
    },
    {
      title: "Exam Management",
      description: "Manage all exams",
      gradient: "from-red-600/80 to-red-400/80",
      onClick: () => navigate("/admin/AssessmentsPage"), 
    },
    {
      title: "Exam Timetable",
      description: "View exam schedule",
      gradient: "from-orange-600/80 to-orange-400/80",
      onClick: () => navigate("/admin/exam-timetable"),
    },
    {
      title: "Total Assessments",
      description: `${stats.total} total exams`,
      gradient: "from-blue-600/80 to-blue-400/80",
      onClick: () => navigate("/admin/assessments/total"),
    },
    {
      title: "Upcoming Exams",
      description: `${stats.upcoming} scheduled`,
      gradient: "from-purple-600/80 to-purple-400/80",
      onClick: () => navigate("/admin/assessments/upcoming"),
    },
    {
      title: "Ongoing Exams",
      description: `${stats.ongoing} in progress`,
      gradient: "from-green-600/80 to-green-400/80",
      onClick: () => navigate("/admin/assessments/ongoing"),
    },
    {
      title: "Completed Exams",
      description: `${stats.completed} finished`,
      gradient: "from-emerald-600/80 to-emerald-400/80",
      onClick: () => navigate("/admin/assessments/completed"),
    },
  ];

  const handleCreateExam = async (examData: Omit<Exam, 'id'>) => {
    try {
      await addExam(examData);
      setShowCreateModal(false);
      alert('Exam created successfully!');
    } catch (error) {
      alert(`Error creating exam: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleUpdateExam = async (updatedExam: Exam) => {
    try {
      await updateExam(updatedExam.id, updatedExam);
      setEditingExam(null);
      alert('Exam updated successfully!');
    } catch (error) {
      alert(`Error updating exam: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleCloseExam = async (id: string, startDate?: string) => {
    const today = new Date().toISOString().split('T')[0];
    
    const shouldClose = window.confirm(
      `Are you sure you want to close this exam? This will mark it as "completed" and set the end date to today (${today}).`
    );
    
    if (shouldClose) {
      try {
        await updateExam(id, {
          status: 'completed',
          endDate: today,
          startDate: startDate && new Date(startDate) > new Date() ? today : startDate
        });
        alert('Exam closed successfully! It will now appear in the completed exams section.');
      } catch (error) {
        alert(`Error closing exam: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  };

  const handleActivateExam = async (exam: Exam) => {
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
      try {
        await updateExam(exam.id, {
          startDate: today,
          endDate: formattedEndDate
        });
        alert('Exam activated successfully! It is now ongoing.');
      } catch (error) {
        alert(`Error activating exam: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  };

  const handleViewDetails = (exam: Exam) => {
    setViewingExam(exam);
  };

  // DON'T show full page loading/error states anymore
  // The table will handle these internally

  return (
    <div className="space-y-6 p-6">
      <TopBar />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Assessment Management</h1>
          <p className="text-gray-600">Manage exams, track status, and view assessments</p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:underline"
        >
          ← Back
        </button>
      </div>

      <QuickNavCards cards={quickNavCards} />

      <ExamManagement
        exams={displayExams}
        onCreateExam={() => setShowCreateModal(true)}
        onCloseExam={handleCloseExam}
        onEditExam={setEditingExam}
        onViewDetails={handleViewDetails}
        onActivateExam={handleActivateExam}
        loading={examsLoading || typesLoading}
        error={examsError || typesError}
      />

      {/* Modals */}
      {showCreateModal && (
        <CreateExamModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSave={handleCreateExam}
          examTypes={examTypes}
        />
      )}

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
          onDownload={(filename) => alert(`Downloading ${filename}...`)}
        />
      )}
    </div>
  );
};

export default AssessmentsPage;