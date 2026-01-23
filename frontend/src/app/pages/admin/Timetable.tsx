"use client";

import { useState, useEffect } from "react";
import TopBar from "@/components/admin/TopBar";
import PageHeader from "@/components/admin/timetable/PageHeader";
import TimetableControls from "@/components/admin/timetable/TimetableControls";
import TimetableGrid from "@/components/admin/timetable/TimetableGrid";
import EditableTimetable from "@/components/admin/timetable/EditTimetable";
import type { Timetable, TimeSlot, TimetableEntry } from "@/types/timetable";
import type { CellData } from "@/components/admin/timetable/EditTimetable";
import { timetableService } from "@/services/timetable";

const TimetablePage = () => {
  const [timetable, setTimetable] = useState<Timetable | null>(null);
  const [loading, setLoading] = useState<"create" | "auto" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedData, setEditedData] = useState<TimetableEntry[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  // Load initial timetable data
  useEffect(() => {
    const loadTimetable = async () => {
      try {
        // Load first available class timetable (you might want to select class)
        const data = await timetableService.getByClass(1);
        if (data) {
          setTimetable(data);
          setEditedData(data.entries);
        }
      } catch (err) {
        console.error("Failed to load timetable:", err);
      }
    };
    
    loadTimetable();
  }, []);

  const handleCreate = async () => {
    setError(null);
    setLoading("create");
    try {
      // Create new timetable via API
      const data = await timetableService.create(0);
      setTimetable(data);
      setEditedData(data.entries);
      setSuccessMessage("Timetable created successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError("Failed to create timetable. Please try again.");
      console.error("Create timetable error:", err);
    } finally {
      setLoading(null);
    }
  };

  const handleAutoGenerate = async () => {
    setError(null);
    setLoading("auto");
    try {
      // Auto-generate timetable via API
      const data = await timetableService.autoGenerate(0);
      setTimetable(data);
      setEditedData(data.entries);
      setSuccessMessage("Timetable auto-generated successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError("Failed to auto-generate timetable. Please try again.");
      console.error("Auto-generate error:", err);
    } finally {
      setLoading(null);
    }
  };

  const handleSaveTimeSlots = (slots: TimeSlot[]) => {
    setTimetable((prev) =>
      prev ? { ...prev, timeSlots: slots } : prev
    );
  };

  const handleToggleEditMode = () => {
    if (isEditMode) {
      handleSaveChanges();
    }
    setIsEditMode(!isEditMode);
  };

  const handleDataChange = (updatedData: CellData[]) => {
    setEditedData(updatedData as TimetableEntry[]);
  };

  const handleSaveChanges = async () => {
    if (!timetable) return;
    
    try {
      const updatedTimetable = {
        ...timetable,
        entries: editedData
      };
      
      await timetableService.update(timetable.id, updatedTimetable);
      setTimetable(updatedTimetable);
      
      setSuccessMessage("Changes saved successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError("Failed to save changes. Please try again.");
      console.error("Save error:", err);
    }
  };

  const handleDuplicate = async () => {
    if (!timetable) return;
    
    setError(null);
    setIsDuplicating(true);
    
    try {
      const duplicatedTimetable = {
        ...timetable,
        id: Date.now(),
        isPublished: false,
        entries: timetable.entries.map(entry => ({
          ...entry,
          id: `${entry.day}-${entry.timeSlotId}-${Date.now()}-${Math.random()}`
        }))
      };
      
      setTimetable(duplicatedTimetable);
      setEditedData(duplicatedTimetable.entries);
      setSuccessMessage("Timetable duplicated successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError("Failed to duplicate timetable. Please try again.");
      console.error("Duplicate error:", err);
    } finally {
      setIsDuplicating(false);
    }
  };

  const handlePublishToggle = async () => {
    if (!timetable) return;
    
    setError(null);
    setIsPublishing(true);
    
    try {
      const newPublishedState = !timetable.isPublished;
      
      if (newPublishedState) {
        await timetableService.publish(timetable.id);
      } else {
        await timetableService.unpublish(timetable.id);
      }
      
      setTimetable(prev => prev ? { ...prev, isPublished: newPublishedState } : prev);
      
      setSuccessMessage(
        newPublishedState 
          ? "Timetable published successfully! It can now be viewed." 
          : "Timetable unpublished successfully. Hidden from users."
      );
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(`Failed to ${timetable.isPublished ? 'unpublish' : 'publish'} timetable. Please try again.`);
      console.error("Publish error:", err);
    } finally {
      setIsPublishing(false);
    }
  };

  const handlePrint = () => {
    if (!timetable) return;
    window.print();
  };

  const handleExport = async () => {
    if (!timetable) return;
    
    try {
      const classId = parseInt(timetable.entries[0]?.classId as string) || 1;
      await timetableService.export(classId);
      setSuccessMessage("Timetable exported successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError("Failed to export timetable. Please try again.");
      console.error("Export error:", err);
    }
  };

  useEffect(() => {
    if (timetable?.entries) {
      setEditedData(timetable.entries);
    }
  }, [timetable]);

  // Prepare days and timeSlots for the grid
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const formattedTimeSlots = timetable?.timeSlots?.map(slot => 
    `${slot.startTime} - ${slot.endTime}`
  ) || [];

  return (
    <div className="space-y-6">
      <TopBar />

      <div className="flex items-center justify-between px-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          School Timetable
        </h1>
        {isEditMode && (
          <div className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium">
            Edit Mode Active
          </div>
        )}
      </div>

      <div className="px-6 py-4 space-y-4">
        <PageHeader />

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded">
            ✓ {successMessage}
          </div>
        )}

        <TimetableControls
          onCreate={handleCreate}
          onAutoGenerate={handleAutoGenerate}
          onDuplicate={handleDuplicate}
          isPublishing={isPublishing}
          onPublishToggle={handlePublishToggle}
          isPublished={timetable?.isPublished || false}
          timeSlots={timetable?.timeSlots ?? []}
          onSaveTimeSlots={handleSaveTimeSlots}
          loading={loading}
          isEditMode={isEditMode}
          onToggleEditMode={handleToggleEditMode}
          canDuplicate={!!timetable}
          isDuplicating={isDuplicating}
          canPublish={!!timetable}
          onPrint={handlePrint}
          onExport={handleExport}
          canPrintExport={!!timetable}
        />

        <div id="timetable-print-area">
          {timetable && (
            <div className="mb-4 text-center">
              <h2 className="text-xl font-bold text-gray-800">
                {timetable.gradeName} – {timetable.className} Timetable
              </h2>
            </div>
          )}

          {isEditMode ? (
            <EditableTimetable
              initialData={editedData}
              days={days}
              timeSlots={formattedTimeSlots}
              isEditMode={isEditMode}
              onDataChange={handleDataChange}
            />
          ) : (
            <TimetableGrid timetable={timetable} />
          )}
        </div>

        {isEditMode && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
            <h3 className="font-medium text-blue-800 mb-2">Edit Mode Instructions</h3>
            <ul className="text-sm text-blue-600 space-y-1">
              <li>• Double-click any cell to edit its content</li>
              <li>• Drag cells using the handle (≡) to rearrange</li>
              <li>• Drop cells in empty slots or swap with existing cells</li>
              <li>• Click "Save Changes" when finished editing</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimetablePage;