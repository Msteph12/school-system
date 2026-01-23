"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '@/components/admin/TopBar';
import QuickNavCards from '@/components/admin/results/QuickNavCards';
import { FaExclamationTriangle } from 'react-icons/fa';
import TermDropdown from '@/components/admin/results/TermDropdown';
import StatusCard from '@/components/admin/results/StatusCard';
import InfoCard from '@/components/admin/results/InfoCard';
import LockConfirmationModal from '@/components/admin/results/LockConfirmationModal';
import type { Term } from '@/types/term';
import { termService } from '@/services/termService';

const TermLock: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTerm, setSelectedTerm] = useState<Term | null>(null);
  const [terms, setTerms] = useState<Term[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Quick navigation cards
  const quickNavCards = [
    {
      title: "Grade Scale",
      description: "Set and manage grade scale",
      gradient: "from-red-600/80 to-red-400/80",
      onClick: () => navigate("/admin/grade-scale"),
    },
    {
      title: "Enter Results",
      description: "Enter student examination results",
      gradient: "from-blue-600/80 to-blue-400/80",
      onClick: () => navigate("/admin/EnterResults"),
    },
    {
      title: "Student Results",
      description: "View individual student results",
      gradient: "from-green-600/80 to-green-400/80",
      onClick: () => navigate("/admin/StudentResults"),
    },
  ];

  // Load terms from API
  const loadTerms = useCallback(async () => {
    setIsLoading(true);
    try {
      const termsData = await termService.getTerms();
      setTerms(termsData);
      
      // Select first term by default
      if (termsData.length > 0 && !selectedTerm) {
        setSelectedTerm(termsData[0]);
      }
    } catch (err) {
      console.error('Failed to load terms:', err);
      alert('Failed to load term data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedTerm]);

  // Initialize terms on mount
  useEffect(() => {
    loadTerms();
  }, [loadTerms]);

  // Memoize the update function
  const updateTermsDisabledState = useCallback((currentTerms: Term[]) => {
    return currentTerms.map(term => ({
      ...term,
      disabled: term.order > 1 && !currentTerms.find(t => t.order === term.order - 1)?.isLocked
    }));
  }, []);

  // Update terms with disabled state
  useEffect(() => {
    if (terms.length > 0) {
      const updatedTerms = updateTermsDisabledState(terms);
      setTerms(updatedTerms);
    }
  }, [terms, updateTermsDisabledState]);

  const handleTermSelect = (term: Term) => {
    setSelectedTerm(term);
  };

  const handleLockToggle = async () => {
    if (!selectedTerm) return;
    
    if (!selectedTerm.isLocked) {
      // Validate before showing confirmation
      try {
        const validation = await termService.validateTermLock(selectedTerm.id);
        if (!validation.isValid) {
          alert(validation.message || 'Cannot lock this term');
          return;
        }
        setShowConfirmation(true);
      } catch (err) {
        console.error('Validation error:', err);
        alert('Failed to validate term lock');
      }
    } else {
      await unlockTerm();
    }
  };

  const confirmLock = async () => {
    setShowConfirmation(false);
    await lockTerm();
  };

  const lockTerm = async () => {
    if (!selectedTerm) return;
    
    setIsProcessing(true);
    try {
      const updatedTerm = await termService.lockTerm(selectedTerm.id);
      
      // Update selected term
      setSelectedTerm(updatedTerm);
      
      // Reload terms to get updated data
      await loadTerms();
      
      alert(`Term ${updatedTerm.name} locked successfully`);
    } catch (err) {
      console.error('Failed to lock term:', err);
      alert('Failed to lock term. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const unlockTerm = async () => {
    if (!selectedTerm) return;
    
    setIsProcessing(true);
    try {
      const updatedTerm = await termService.unlockTerm(selectedTerm.id);
      
      // Update selected term
      setSelectedTerm(updatedTerm);
      
      // Reload terms to get updated data
      await loadTerms();
      
      alert(`Term ${updatedTerm.name} unlocked successfully`);
    } catch (err) {
      console.error('Failed to unlock term:', err);
      alert('Failed to unlock term. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <TopBar />
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Term Lock Management</h1>
            <p className="text-gray-600">Control term access for result entry and editing</p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:underline"
          >
            ← Back
          </button>
        </div>
        
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-gray-200 rounded-2xl"></div>
          <div className="h-24 bg-gray-200 rounded-xl"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-200 rounded-xl"></div>
            <div className="h-64 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (terms.length === 0) {
    return (
      <div className="space-y-6 p-6">
        <TopBar />
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Term Lock Management</h1>
            <p className="text-gray-600">Control term access for result entry and editing</p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:underline"
          >
            ← Back
          </button>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <FaExclamationTriangle className="w-6 h-6 text-yellow-600" />
            <div>
              <h3 className="font-semibold text-yellow-800">No Terms Found</h3>
              <p className="text-yellow-700 mt-1">
                No terms are currently configured. Please contact your administrator.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <TopBar />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Term Lock Management</h1>
          <p className="text-gray-600">Control term access for result entry and editing</p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:underline"
        >
          ← Back
        </button>
      </div>

      {/* Quick Navigation Cards */}
      <QuickNavCards cards={quickNavCards} />

      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-1">Select Term</h2>
              <p className="text-sm text-gray-500">Terms must be locked sequentially</p>
            </div>
            {selectedTerm && (
              <TermDropdown
                terms={terms}
                selectedTerm={selectedTerm}
                onSelectTerm={handleTermSelect}
              />
            )}
          </div>
        </div>

        {selectedTerm && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <StatusCard
                term={selectedTerm}
                onLockToggle={handleLockToggle}
                isProcessing={isProcessing}
              />
              <InfoCard term={selectedTerm} />
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <FaExclamationTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-amber-800 mb-1">Important Notice</h3>
                  <p className="text-amber-700 text-sm">
                    Locking a term makes all results read-only across the system. 
                    Teachers cannot edit or enter new results. 
                    This action should only be performed after term completion and verification.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {selectedTerm && (
        <LockConfirmationModal
          isOpen={showConfirmation}
          term={selectedTerm}
          onConfirm={confirmLock}
          onCancel={() => setShowConfirmation(false)}
        />
      )}
    </div>
  );
};

export default TermLock;