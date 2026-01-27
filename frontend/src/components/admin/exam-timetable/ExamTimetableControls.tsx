"use client";

import { useState } from "react";
import ExamTimeSlotsModal from "./ExamTimeSlotsModal";
import type { TimeSlot } from "@/types/examTimetable";

interface Props {
  onCreate: () => void;
  onAutoGenerate: (selectedSubjects: string[]) => void;
  onPublishToggle: () => void;
  onToggleEditMode: () => void;
  onSaveTimeSlots: (slots: TimeSlot[]) => void;
  onPrint?: () => void;
  onExport?: () => void;
  loading?: "create" | "auto" | null;
  isEditMode: boolean;
  isPublishing?: boolean;
  isPublished?: boolean;
  canPublish?: boolean;
  canPrintExport?: boolean;
  timeSlots?: TimeSlot[];
}

const ExamTimetableControls = ({
  onCreate,
  onAutoGenerate,
  onPublishToggle,
  onToggleEditMode,
  onSaveTimeSlots,
  onPrint,
  onExport,
  loading = null,
  isEditMode,
  isPublished,
  canPublish = true,
  isPublishing = false,
  canPrintExport = true,
  timeSlots = [],
}: Props) => {
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [showSubjectsDropdown, setShowSubjectsDropdown] = useState(false);
  const [showTimeSlotsModal, setShowTimeSlotsModal] = useState(false);

  const subjects = [
    "Mathematics",
    "English Language",
    "Science",
    "Social Studies",
    "Kiswahili",
    "Creative Arts",
    "Physical Education",
    "Religious Education",
    "Computer Studies",
    "French",
    "Business Studies",
  ];

  const toggleSubject = (subject: string) => {
    setSelectedSubjects(prev =>
      prev.includes(subject)
        ? prev.filter(s => s !== subject)
        : [...prev, subject]
    );
  };

  const handleAutoGenerate = () => {
    if (selectedSubjects.length === 0) {
      alert("Please select at least one subject for auto-generation");
      return;
    }
    setShowSubjectsDropdown(false); 
    onAutoGenerate(selectedSubjects);
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded shadow-sm">
        {/* Create Button */}
        <button
          onClick={onCreate}
          disabled={loading === "create" || isEditMode}
          className="px-4 py-2 text-sm bg-red-600 hover:bg-red-400 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading === "create" ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating...
            </span>
          ) : (
            "+ Create Timetable"
          )}
        </button>

        {/* Auto Generate with Subjects Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowSubjectsDropdown(!showSubjectsDropdown)}
            className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              Subjects ({selectedSubjects.length})
            </span>
          </button>

          {showSubjectsDropdown && (
            <div className="absolute z-10 mt-1 w-64 bg-white border border-gray-200 rounded shadow-lg">
              <div className="p-3 max-h-60 overflow-y-auto">
                {subjects.map(subject => (
                  <label
                    key={subject}
                    className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedSubjects.includes(subject)}
                      onChange={() => toggleSubject(subject)}
                      className="rounded text-blue-600"
                    />
                    <span className="text-sm text-gray-700">{subject}</span>
                  </label>
                ))}
              </div>
              <div className="p-3 border-t border-gray-200">
                <div className="text-xs text-gray-500 mb-2">
                  Selected: {selectedSubjects.length} subjects = {selectedSubjects.length} exam papers
                </div>
                <button
                  onClick={handleAutoGenerate}
                  disabled={loading === "auto" || isEditMode}
                  className="w-full px-4 py-2 text-sm bg-indigo-500 hover:bg-indigo-300 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading === "auto" ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating...
                    </span>
                  ) : (
                    "Auto Generate"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Time Slots Button */}
        <button
          onClick={() => setShowTimeSlotsModal(true)}
          disabled={isEditMode}
          className="px-4 py-2 text-sm bg-emerald-600 hover:bg-emerald-400 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          + Time Slots
        </button>

        {/* Edit Button */}
        <button
          onClick={onToggleEditMode}
          className={`px-4 py-2 text-sm text-white rounded transition-colors ${
            isEditMode 
              ? "bg-red-500 hover:bg-red-600" 
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {isEditMode ? (
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Save Changes
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Timetable
            </span>
          )}
        </button>

        {isEditMode && (
          <div className="ml-4 px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
            Edit Mode Active
          </div>
        )}

        {/* Publish Button */}
        <button
          onClick={onPublishToggle}
          disabled={!canPublish || isEditMode || loading !== null || isPublishing}
          className={`px-4 py-2 text-sm text-white rounded transition-colors ${
            isPublished 
              ? "bg-yellow-500 hover:bg-yellow-600" 
              : "bg-green-500 hover:bg-green-600"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isPublishing ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {isPublished ? "Unpublishing..." : "Publishing..."}
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isPublished ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                )}
              </svg>
              {isPublished ? "Unpublish" : "Publish"}
            </span>
          )}
        </button>

        {/* Right Side Actions */}
        <div className="ml-auto flex items-center gap-3">
          {/* Print Button */}
          <button
            onClick={() => {
              setShowTimeSlotsModal(false);

              setTimeout(() => {
                if (onPrint) {
                  onPrint();
                }
              }, 100);
            }}
            disabled={!canPrintExport || isEditMode}
            className="px-4 py-2 text-sm bg-gray-500 hover:bg-gray-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🖨️ Print
          </button>

          {/* Export Button */}
          <button
            onClick={onExport}
            disabled={!canPrintExport || isEditMode}
            className="px-4 py-2 text-sm bg-red-400 hover:bg-red-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            📤 Export
          </button>
          
        </div>
      </div>

      <ExamTimeSlotsModal
        key={showTimeSlotsModal ? "open" : "closed"}
        isOpen={showTimeSlotsModal}
        onClose={() => setShowTimeSlotsModal(false)}
        initialSlots={timeSlots}
        onSave={onSaveTimeSlots}
      />
    </>
  );
};

export default ExamTimetableControls;