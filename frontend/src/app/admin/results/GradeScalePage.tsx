"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '@/components/admin/TopBar';
import QuickNavCards from '@/components/admin/results/QuickNavCards';
import AddGradeButton from '@/components/admin/results/AddGradeButton';
import GradesTable from '@/components/admin/results/GradeScaleTable';
import GradeModal from '@/components/admin/results/GradeScaleModal';
import type { GradeScale } from '@/types/grade';
import { gradeService } from '@/services/gradeScale';
import type { GradeFormData } from "@/types/grade";

const GradeScalePage: React.FC = () => {
  const navigate = useNavigate();
  const [grades, setGrades] = useState<GradeScale[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingGrade, setEditingGrade] = useState<GradeScale | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Quick navigation cards
  const quickNavCards = [
    {
      title: "Enter Results",
      description: "Enter student examination results",
      gradient: "from-blue-600/80 to-blue-400/80",
      onClick: () => navigate("/admin/EnterResults"),
    },
    {
      title: "Term Lock Status",
      description: "Lock/unlock terms for results",
      gradient: "from-green-600/80 to-green-400/80",
      onClick: () => navigate("/admin/TermLock"),
    },
    {
      title: "Student Results",
      description: "View individual student results",
      gradient: "from-red-600/80 to-red-400/80",
      onClick: () => navigate("/admin/StudentResults"),
    },
  ];

  // Load grades from API
  const loadGrades = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const gradesData = await gradeService.getGradeScales(); // CHANGED: getGrades → getGradeScales
      setGrades(gradesData);
    } catch (err) {
      console.error('Failed to load grade scale:', err);
      setError('Failed to load grade scale data. Please try again.');
      setGrades([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize grades on mount
  useEffect(() => {
    loadGrades();
  }, [loadGrades]);

  const handleAddGrade = () => {
    setEditingGrade(null);
    setShowModal(true);
  };

  const handleEditGrade = (grade: GradeScale) => {
    setEditingGrade(grade);
    setShowModal(true);
  };

 const handleSaveGrade = async (gradeData: GradeFormData) => {
    try {
      if (editingGrade) {
        // Update existing grade
        const updatedGrade = await gradeService.updateGradeScale(editingGrade.id, gradeData); // CHANGED: updateGrade → updateGradeScale
        setGrades(prev => prev.map(grade => 
          grade.id === editingGrade.id ? updatedGrade : grade
        ));
        alert('Grade Scale updated successfully!');
      } else {
        // Add new grade
        const newGrade = await gradeService.createGradeScale(gradeData); // CHANGED: createGrade → createGradeScale
        setGrades(prev => [...prev, newGrade]);
        alert('Grade Scale added successfully!');
      }
      setShowModal(false);
      setEditingGrade(null);
    } catch (err) {
      console.error('Failed to save grade scale:', err);
      alert('Failed to save grade scale. Please try again.');
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      const updatedGrade = await gradeService.toggleGradeScaleStatus(id); // CHANGED: toggleGradeStatus → toggleGradeScaleStatus
      setGrades(prev => prev.map(grade => 
        grade.id === id ? updatedGrade : grade
      ));
    } catch (err) {
      console.error('Failed to toggle grade scale status:', err);
      alert('Failed to update grade scale status. Please try again.');
    }
  };

  const handleDeleteGrade = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this grade scale?')) return;
    
    try {
      await gradeService.deleteGradeScale(id); // CHANGED: deleteGrade → deleteGradeScale
      setGrades(prev => prev.filter(grade => grade.id !== id));
      alert('Grade Scale deleted successfully!');
    } catch (err) {
      console.error('Failed to delete grade scale:', err);
      alert('Failed to delete grade scale. Please try again.');
    }
  };

  return (
    <div className="space-y-6 p-6">
      <TopBar />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Grade Scale Management</h1>
          <p className="text-gray-600">Define and manage grade scales for result evaluation</p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:underline"
        >
          ← Back
        </button>
      </div>

      <QuickNavCards cards={quickNavCards} />

      <AddGradeButton onClick={handleAddGrade} />

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <GradesTable
          grades={grades}
          onEdit={handleEditGrade}
          onToggleStatus={handleToggleStatus}
          onDelete={handleDeleteGrade}
          isLoading={isLoading}
          error={error}
          onRetry={loadGrades}
        />
      </div>

      {showModal && (
        <GradeModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setEditingGrade(null);
          }}
          onSave={handleSaveGrade}
          initialData={editingGrade}
        />
      )}
    </div>
  );
};

export default GradeScalePage;