"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "@/components/admin/TopBar";
import QuickNavCards from "@/components/admin/assessments/QuickNavCards";
import ExamManagement from "@/components/admin/assessments/ExamManagement";
import CreateExamModal from "@/components/admin/assessments/CreateExamModal";
import EditExamModal from "@/components/admin/assessments/EditExamModal";
import ViewExamModal from "@/components/admin/assessments/ViewExamModal";
import { useExamStore } from "@/utils/examStore";
import { useExamTypes } from "@/hooks/useExamTypes";
import type { Exam } from "@/types/assessment";

const AssessmentsPage: React.FC = () => {
  const navigate = useNavigate();

  const {
    exams,
    fetchExams,
    addExam,
    updateExam,
    getExamsWithAutoStatus,
    loading: examsLoading,
    error: examsError,
  } = useExamStore();

  const {
    examTypes,
    loading: typesLoading,
    error: typesError,
  } = useExamTypes();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [viewingExam, setViewingExam] = useState<Exam | null>(null);

  useEffect(() => {
    fetchExams();
  }, [fetchExams]);

  const displayExams = getExamsWithAutoStatus();

  const stats = useMemo(
    () => ({
      total: exams.length,
      upcoming: displayExams.filter(e => e.status === "scheduled").length,
      ongoing: displayExams.filter(e => e.status === "active").length,
      completed: displayExams.filter(e => e.status === "completed").length,
    }),
    [exams, displayExams]
  );

  const quickNavCards = [
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
      title: "Assessment Setup",
      description: "Manage exam types and settings",
      gradient: "from-indigo-600/80 to-indigo-400/80",
      onClick: () => navigate("/admin/assessments/setup"),
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

  /* =========================
     Modal Adapters (IMPORTANT)
     ========================= */

  const handleCreateExamFromModal = (examData: {
    name: string;
    exam_type_id: number;
    class_id: number;
    subject_id: number;
    academic_year_id: number;
    term_id: number;
    exam_date: string;
    total_marks: number;
    attachment?: File;
  }) => {
    addExam(examData)
      .then(() => {
        setShowCreateModal(false);
        alert("Exam created successfully!");
      })
      .catch(error => {
        alert(
          `Error creating exam: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      });
  };

  const handleUpdateExamFromModal = async (
    id: number,
    examData: {
      name?: string;
      exam_date?: string;
      total_marks?: number;
    }
  ): Promise<boolean> => {
    try {
      await updateExam(id, examData);
      setEditingExam(null);
      alert("Exam updated successfully!");
      return true;
    } catch (error) {
      alert(
        `Error updating exam: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      return false;
    }
  };

  /* ========================= */

  const handleCloseExam = async (id: string): Promise<void> => {
    const shouldClose = window.confirm(
      "Are you sure you want to close this exam?"
    );
    if (!shouldClose) return;

    try {
      await updateExam(Number(id), {});
      alert("Exam closed successfully.");
    } catch (error) {
      alert(
        `Error closing exam: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  const handleActivateExam = async (exam: Exam): Promise<void> => {
    const shouldActivate = window.confirm("Activate this exam?");
    if (!shouldActivate) return;

    try {
      await updateExam(exam.id, {});
      alert("Exam activated successfully.");
    } catch (error) {
      alert(
        `Error activating exam: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  const handleViewDetails = (exam: Exam): void => {
    setViewingExam(exam);
  };

  return (
    <div className="space-y-6 p-6">
      <TopBar />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Assessment Management
          </h1>
          <p className="text-gray-600">
            Manage exams, track status, and view assessments
          </p>
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

      {showCreateModal && (
        <CreateExamModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSave={handleCreateExamFromModal}
          examTypes={examTypes} classes={[]} subjects={[]} academicYears={[]} terms={[]}        />
      )}

      {editingExam && (
        <EditExamModal
          isOpen
          onClose={() => setEditingExam(null)}
          onSave={handleUpdateExamFromModal}
          exam={editingExam}
          examTypes={examTypes}
        />
      )}

      {viewingExam && (
        <ViewExamModal
          exam={viewingExam}
          onClose={() => setViewingExam(null)}
          onDownload={filename =>
            alert(`Downloading ${filename}...`)
          }
        />
      )}
    </div>
  );
};

export default AssessmentsPage;
