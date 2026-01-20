"use client";

import { useState } from "react";
import TimeSlotsModal from "@/components/admin/timetable/TimeSlotsModal";
import type { TimeSlot } from "@/types/timetable";

interface Props {
  onCreate: () => void;
  onAutoGenerate: () => void;
  onDuplicate: () => void;
  onPublishToggle: () => void; 
  timeSlots: TimeSlot[];
  onSaveTimeSlots: (slots: TimeSlot[]) => void;
  onToggleEditMode: () => void; // New prop to toggle edit mode
  isEditMode: boolean; // New prop to track edit mode
  loading?: "create" | "auto" | null;
  canDuplicate?: boolean; // Optional: to disable if no timetable exists
  isDuplicating?: boolean; // New prop to track duplicating state
  isPublishing?: boolean;
  isPublished?: boolean;
  canPublish?: boolean;
  onPrint?: () => void;
  onExport?: () => void;
  canPrintExport?: boolean;
}

const TimetableControls = ({
  onCreate,
  onAutoGenerate,
  onDuplicate,
  onPublishToggle, 
  timeSlots,
  onSaveTimeSlots,
  onToggleEditMode,
  isEditMode, 
  loading = null,
  canDuplicate = true, // Default to true
  isDuplicating = false, // Default to false
  isPublished, 
  canPublish = true,
 isPublishing = false,
  onPrint,
  onExport,
  canPrintExport = true,
}: Props) => {
  const [showTimeSlotsModal, setShowTimeSlotsModal] = useState(false);

  return (
    <>
      <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded shadow-sm">
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

        <button
          onClick={onAutoGenerate}
          disabled={loading === "auto" || isEditMode}
          className="px-4 py-2 text-sm bg-indigo-500 hover:bg-indigo-300 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading === "auto" ? (
            <span className="flex items-center gap-2">
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

        <button
          onClick={() => setShowTimeSlotsModal(true)}
          disabled={isEditMode}
          className="px-4 py-2 text-sm bg-emerald-600 hover:bg-emerald-400 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          + Time Slots
        </button>

        {/* Edit Button with Toggle Functionality */}
        <button
          onClick={onToggleEditMode}
          className={`px-4 py-2 text-sm text-white rounded transition-colors ${
            isEditMode 
              ? "bg-red-500 hover:bg-red-600" 
              : "bg-blue-500 hover:bg-red-400"
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

        {/* Duplicate Button - Fixed */}
        <button
            onClick={onDuplicate}
            disabled={isEditMode || !canDuplicate || isDuplicating}
            className="px-4 py-2 text-sm bg-purple-500 hover:bg-purple-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
            {isDuplicating ? (
                <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Duplicating...
                </span>
            ) : (
                <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Duplicate
                </span>
            )}
        </button>

        {/* Publish/Unpublish Button */}
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

        {/* RIGHT SIDE ACTIONS */}
        <div className="ml-auto flex items-center gap-3">
        {/* Print Button */}
            <button
                onClick={onPrint}
                disabled={!canPrintExport || isEditMode}
                className="px-4 py-2 text-sm bg-gray-500 hover:bg-gray-600 text-white rounded"
            >
                🖨️ Print
            </button>

            {/* Export Button */}
            <button
                onClick={onExport}
                disabled={!canPrintExport || isEditMode}
                className="px-4 py-2 text-sm bg-red-400 hover:bg-red-600 text-white rounded"
            >
                📤 Export
            </button>
        </div>

      </div>

      <TimeSlotsModal
        key={showTimeSlotsModal ? "open" : "closed"}
        isOpen={showTimeSlotsModal}
        onClose={() => setShowTimeSlotsModal(false)}
        initialSlots={timeSlots}
        onSave={onSaveTimeSlots}
      />
    </>
  );
};

export default TimetableControls;