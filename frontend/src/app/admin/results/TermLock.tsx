"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "@/components/admin/TopBar";
import QuickNavCards from "@/components/admin/results/QuickNavCards";
import { FaExclamationTriangle } from "react-icons/fa";
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

  /** ---------------- Quick Nav ---------------- */
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

  /** ---------------- Load Terms ---------------- */
  const loadTerms = useCallback(async () => {
    setIsLoading(true);
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
      alert("Failed to load term data.");
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
      alert("You must lock the previous term first.");
      return;
    }

    setIsProcessing(true);
    try {
      const updated = await termService.lockTerm(selectedTerm.id);
      setSelectedTerm(updated);
      await loadTerms();
    } catch {
      alert("Failed to lock term.");
    } finally {
      setIsProcessing(false);
    }
  };

  const unlockTerm = async () => {
    if (!selectedTerm) return;

    setIsProcessing(true);
    try {
      const updated = await termService.unlockTerm(selectedTerm.id);
      setSelectedTerm(updated);
      await loadTerms();
    } catch {
      alert("Failed to unlock term.");
    } finally {
      setIsProcessing(false);
    }
  };

  /** ---------------- UI States ---------------- */
  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <TopBar />
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-gray-200 rounded-2xl" />
          <div className="h-24 bg-gray-200 rounded-xl" />
        </div>
      </div>
    );
  }

  if (terms.length === 0) {
    return (
      <div className="space-y-6 p-6">
        <TopBar />
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 flex gap-3">
          <FaExclamationTriangle className="text-yellow-600 w-6 h-6" />
          <div>
            <h3 className="font-semibold text-yellow-800">No Terms Found</h3>
            <p className="text-yellow-700 text-sm">
              No academic terms are configured.
            </p>
          </div>
        </div>
      </div>
    );
  }

  /** ---------------- Main ---------------- */
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

      <div className="bg-white rounded-xl shadow-sm p-6">
        {selectedTerm && (
          <TermDropdown
            terms={computedTerms}
            selectedTerm={selectedTerm}
            onSelectTerm={handleTermSelect}
          />
        )}
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

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex gap-3">
            <FaExclamationTriangle className="text-amber-600 w-5 h-5 mt-1" />
            <p className="text-amber-700 text-sm">
              Locking a term makes all results read-only across the system.
            </p>
          </div>
        </>
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
