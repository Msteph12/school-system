"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "@/components/admin/TopBar";
import QuickNavCards from "@/components/admin/results/QuickNavCards";
import { FaExclamationTriangle, FaInfoCircle } from "react-icons/fa";
import TermDropdown from "@/components/admin/results/TermDropdown";
import StatusCard from "@/components/admin/results/StatusCard";
import InfoCard from "@/components/admin/results/InfoCard";
import LockConfirmationModal from "@/components/admin/results/LockConfirmationModal";
import type { Term } from "@/types/term";
import { termService } from "@/services/termService";

const TermLock: React.FC = () => {
  const navigate = useNavigate();

  const [terms, setTerms] = useState<Term[]>([]);
  const [selectedTerm, setSelectedTerm] = useState<Term | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /** ---------------- Quick Nav ---------------- */
  const quickNavCards = [
    {
      title: "Grade Scale",
      description: "Set and manage grade scale",
      gradient: "from-red-600/80 to-red-400/80",
      onClick: () => navigate("/admin/GradeScalePage"),
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

  /** ---------------- Load Terms ---------------- */
  const loadTerms = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await termService.getTerms();
      setTerms(data);

      // Ensure a selected term always exists if data exists
      if (data.length > 0) {
        setSelectedTerm(prev =>
          prev ? data.find(t => t.id === prev.id) ?? data[0] : data[0]
        );
      }
    } catch (error) {
      console.error("Failed to load terms:", error);
      setError("Unable to load academic terms. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTerms();
  }, [loadTerms]);

  /** ---------------- Derived Disabled State ---------------- */
  const computedTerms = useMemo(() => {
    return terms.map(term => {
      const previousTerm = terms.find(t => t.order === term.order - 1);

      return {
        ...term,
        disabled:
          term.order > 1 &&
          (!previousTerm || !previousTerm.isLocked),
      };
    });
  }, [terms]);

  /** ---------------- Actions ---------------- */
  const handleTermSelect = (term: Term) => {
    const computedTerm = computedTerms.find(t => t.id === term.id);

    if (computedTerm?.disabled) return;

    setSelectedTerm(term);
  };

  const handleLockToggle = async () => {
    if (!selectedTerm || isProcessing) return;

    if (!selectedTerm.isLocked) {
      setShowConfirmation(true);
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

    // Enforce sequencing rule before API call
    const previousTerm = terms.find(
      t => t.order === selectedTerm.order - 1
    );

    if (selectedTerm.order > 1 && !previousTerm?.isLocked) {
      setError("You must lock the previous term first. Please lock Term " + previousTerm?.name + " before proceeding.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    try {
      const updated = await termService.lockTerm(selectedTerm.id);
      setSelectedTerm(updated);
      await loadTerms();
    } catch (err) {
      setError("Failed to lock term. Please try again or contact support if the issue persists.");
      console.error("Lock term error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const unlockTerm = async () => {
    if (!selectedTerm) return;

    setIsProcessing(true);
    setError(null);
    try {
      const updated = await termService.unlockTerm(selectedTerm.id);
      setSelectedTerm(updated);
      await loadTerms();
    } catch (err) {
      setError("Failed to unlock term. Please try again or contact support if the issue persists.");
      console.error("Unlock term error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  /** ---------------- Loading State ---------------- */
  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <TopBar />
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              Term Lock Management
            </h1>
            <p className="text-gray-600">
              Control term access for result entry and editing
            </p>
          </div>
          <button onClick={() => navigate(-1)} className="text-blue-600">
            ← Back
          </button>
        </div>
        
        <QuickNavCards cards={quickNavCards} />
        
        <div className="animate-pulse space-y-6">
          <div className="h-24 bg-gray-200 rounded-xl" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-48 bg-gray-200 rounded-xl" />
            <div className="h-48 bg-gray-200 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  /** ---------------- Main Render ---------------- */
  return (
    <div className="space-y-6 p-6">
      <TopBar />

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Term Lock Management
          </h1>
          <p className="text-gray-600">
            Control term access for result entry and editing
          </p>
        </div>
        <button onClick={() => navigate(-1)} className="text-blue-600">
          ← Back
        </button>
      </div>

      <QuickNavCards cards={quickNavCards} />

      {/* Error Display - Shows where actual data is missing */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3 items-start">
          <FaExclamationTriangle className="text-red-600 w-5 h-5 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-red-800">Action Required</h3>
            <p className="text-red-700 text-sm">{error}</p>
            <button 
              onClick={() => setError(null)}
              className="text-red-600 text-xs mt-2 hover:text-red-800"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Data Status Indicator */}
      {terms.length === 0 && !isLoading && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex gap-3 items-start">
          <FaInfoCircle className="text-yellow-600 w-5 h-5 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-yellow-800">No Academic Terms Found</h3>
            <p className="text-yellow-700 text-sm">
              Academic terms data is currently unavailable. Please check if terms have been configured in the system settings.
            </p>
          </div>
        </div>
      )}

      {terms.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <TermDropdown
            terms={computedTerms}
            selectedTerm={selectedTerm!}
            onSelectTerm={handleTermSelect}
          />
        </div>
      )}

      {selectedTerm && terms.length > 0 && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <StatusCard
              term={selectedTerm}
              onLockToggle={handleLockToggle}
              isProcessing={isProcessing}
            />
            <InfoCard term={selectedTerm} />
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex gap-3">
            <FaExclamationTriangle className="text-amber-600 w-5 h-5 mt-1" />
            <p className="text-amber-700 text-sm">
              Locking a term makes all results read-only across the system.
            </p>
          </div>
        </>
      )}

      {/* Term Cards Placeholder when no terms are loaded but UI is still visible */}
      {terms.length === 0 && !isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-dashed border-gray-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 rounded-full bg-gray-300"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
            <div className="h-8 bg-gray-200 rounded w-32 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-dashed border-gray-300">
            <div className="h-4 bg-gray-200 rounded w-32 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      )}

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