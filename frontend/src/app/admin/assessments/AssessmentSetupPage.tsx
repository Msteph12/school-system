import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '@/components/admin/TopBar';
import ExamTypeTable from '@/components/admin/assessments/ExamTypeTable';
import QuickNavCards from '@/components/common/QuickNavCards';
import { useExamTypes } from '@/hooks/useExamTypes';
import type { QuickNavCard } from '@/types/result';

const AssessmentSetupPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    examTypes, 
    loading, 
    error, 
    createExamType, 
    updateExamType, 
    deleteExamType,
  } = useExamTypes();

  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Quick navigation cards data
  const quickNavCards: QuickNavCard[] = [
    {
      title: "Exam Management",
      description: "Manage all exams",
      onClick: () => navigate("/admin/AssessmentsPage"),
      gradient: "from-blue-500 to-blue-700",
    },
    {
      title: "Exam Timetable",
      description: "View exam schedule",
      onClick: () => navigate("/admin/exam-timetable"),
      gradient: "from-green-500 to-green-700",
    },
  ];

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCreateExamType = async (name: string): Promise<boolean> => {
    const success = await createExamType(name);
    if (success) {
      showNotification('success', 'Exam type created successfully!');
      return true;
    } else {
      showNotification('error', error || 'Failed to create exam type');
      return false;
    }
  };

  const handleUpdateExamType = async (id: number, name: string): Promise<boolean> => {
    const success = await updateExamType(id, name);
    if (success) {
      showNotification('success', 'Exam type updated successfully!');
      return true;
    } else {
      showNotification('error', error || 'Failed to update exam type');
      return false;
    }
  };

  const handleDeleteExamType = async (id: number): Promise<boolean> => {
    const success = await deleteExamType(id);
    if (success) {
      showNotification('success', 'Exam type deleted successfully!');
      return true;
    } else {
      showNotification('error', error || 'Failed to delete exam type');
      return false;
    }
  };

  return (
    <div className="space-y-6 p-6">
      <TopBar />

      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 ${
            notification.type === 'success'
              ? 'bg-green-50 border-green-200'
              : 'bg-red-50 border-red-200'
          } border rounded-lg p-4 shadow-lg`}
        >
          <div className="flex items-center gap-2">
            <span
              className={`font-semibold ${
                notification.type === 'success'
                  ? 'text-green-800'
                  : 'text-red-800'
              }`}
            >
              {notification.type === 'success' ? '✓ Success' : '✗ Error'}
            </span>
            <span
              className={
                notification.type === 'success'
                  ? 'text-green-600'
                  : 'text-red-600'
              }
            >
              {notification.message}
            </span>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Assessment Setup
          </h1>
          <p className="text-gray-600">
            Manage exam types and assessment settings
          </p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:underline"
          title="Go back"
        >
          ← Back
        </button>
      </div>

      {/* Quick navigation cards */}
      <QuickNavCards cards={quickNavCards} />

      <ExamTypeTable
        examTypes={examTypes}
        onCreate={handleCreateExamType}
        onUpdate={handleUpdateExamType}
        onDelete={handleDeleteExamType}
        loading={loading}
        error={error}
      />
    </div>
  );
};

export default AssessmentSetupPage;