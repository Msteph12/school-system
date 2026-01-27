"use client";

import { useState } from "react";
import TopBar from "@/components/admin/TopBar";
import PageHeader from "@/components/admin/exam-timetable/PageHeader";
import ExamTimetableControls from "@/components/admin/exam-timetable/ExamTimetableControls";
import ExamTimetableGrid from "@/components/admin/exam-timetable/ExamTimetableGrid";
import EditableExamTimetable from "@/components/admin/exam-timetable/EditExamTimetable";
import type { TimeSlot, ExamTimetable, ExamTimetableEntry } from "@/types/examTimetable";
import { examTimetableService } from "@/services/examTimetable";

const ExamTimetablePage = () => {
  const [loading, setLoading] = useState<"create" | "auto" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    { id: 1, startTime: "08:00", endTime: "10:00" },
    { id: 2, startTime: "10:30", endTime: "12:30" },
    { id: 3, startTime: "14:00", endTime: "16:00" },
  ]);
  const [timetable, setTimetable] = useState<ExamTimetable | null>(null);

  const handleGradeChange = (gradeId: number | null) => {
    console.log("Selected Grade:", gradeId);
  };

  const handleExamTypeChange = (type: string) => {
    console.log("Selected Exam Type:", type);
  };

  const handleStartDateChange = (date: string) => {
    console.log("Start Date:", date);
  };

  const handleEndDateChange = (date: string) => {
    console.log("End Date:", date);
  };

  const handleMaxPapersChange = (max: number) => {
    console.log("Max Papers per Day:", max);
  };

  const handleCreate = async () => {
    setError(null);
    setLoading("create");
    
    try {
      const newTimetable = await examTimetableService.create(1);
      setTimetable(newTimetable);
      setSuccessMessage("Exam timetable created successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
      setIsPublished(false);
      setIsEditMode(false);
    } catch {
      setError("Failed to create timetable");
    } finally {
      setLoading(null);
    }
  };

  const handleAutoGenerate = async (selectedSubjects: string[]) => {
    setError(null);
    setLoading("auto");
    
    try {
      const subjectIdMap: { [key: string]: number } = {
        "Mathematics": 101,
        "English Language": 102,
        "Science": 103,
        "Social Studies": 104,
        "Kiswahili": 105,
        "Creative Arts": 106,
        "Physical Education": 107,
        "Religious Education": 108,
        "Computer Studies": 109,
        "French": 110,
        "Business Studies": 111,
      };
      
      const subjectIds = selectedSubjects.map(subject => subjectIdMap[subject] || 101);
      
      const request = {
        gradeId: 1,
        examType: "midterm",
        startDate: "2024-06-10",
        endDate: "2024-06-15",
        maxPapersPerDay: 2,
        subjectIds: subjectIds,
        timeSlots: timeSlots,
      };
      
      const generatedTimetable = await examTimetableService.generate(request);
      setTimetable(generatedTimetable);
      setSuccessMessage(`Exam schedule generated for ${selectedSubjects.length} subjects!`);
      setTimeout(() => setSuccessMessage(null), 3000);
      setIsEditMode(false);
    } catch {
      setError("Failed to generate timetable");
    } finally {
      setLoading(null);
    }
  };

  const handleSaveTimeSlots = (slots: TimeSlot[]) => {
    const slotsWithIds = slots.map((slot, index) => ({
      ...slot,
      id: slot.id || index + 1
    }));
    setTimeSlots(slotsWithIds);
    setSuccessMessage("Time slots saved successfully!");
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleToggleEditMode = () => {
    if (isEditMode && timetable) {
      setSuccessMessage("Changes saved successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
      setTimetable({...timetable, entries: [...timetable.entries]});
    }
    setIsEditMode(!isEditMode);
  };

  const handlePublishToggle = async () => {
    if (!timetable) return;
    
    setError(null);
    setIsPublishing(true);
    
    try {
      if (isPublished) {
        await examTimetableService.unpublish();
      } else {
        await examTimetableService.publish(); 
      }
      
      setIsPublished(!isPublished);
      setSuccessMessage(
        isPublished 
          ? "Exam timetable unpublished successfully" 
          : "Exam timetable published successfully!"
      );
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch  {
      setError("Failed to update publish status");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDataChange = async (updatedData: ExamTimetableEntry[]) => {
    if (timetable) {
      try {
        const updatedTimetable = {
          ...timetable,
          entries: updatedData,
          totalPapers: updatedData.length,
          updatedAt: new Date().toISOString()
        };
        setTimetable(updatedTimetable);
        
        await examTimetableService.updateEntries(timetable.id, updatedData);
        
        setSuccessMessage("Changes saved successfully!");
        setTimeout(() => setSuccessMessage(null), 3000);
      } catch {
        setError("Failed to save changes");
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    setSuccessMessage("Export feature will be implemented soon!");
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const getDaysFromDateRange = () => {
    if (!timetable?.startDate || !timetable?.endDate) {
      return ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    }
    
    const start = new Date(timetable.startDate);
    const end = new Date(timetable.endDate);
    const days = [];
    
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dayName = dayNames[d.getDay()];
      if (dayName !== "Sunday" && dayName !== "Saturday") {
        days.push(dayName);
      }
    }
    
    return days.length > 0 ? days : ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  };

  const days = getDaysFromDateRange();

  const formattedTimeSlots = timeSlots.map(slot => 
    `${slot.startTime} - ${slot.endTime}${slot.type === 'break' ? ' (Break)' : ''}${slot.type === 'lunch' ? ' (Lunch)' : ''}`
  );
  
  const showGrid = timetable && timeSlots.length > 0;

  return (
    <div className="space-y-6">
      <TopBar />

      <div className="flex items-center justify-between px-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Exam Timetable
        </h1>
        <div className={`px-3 py-1 text-sm rounded-full font-medium ${
          isPublished 
            ? "bg-green-100 text-green-700" 
            : "bg-blue-100 text-blue-800"
        }`}>
          {isPublished ? "Published" : "Draft Mode"}
        </div>
      </div>

      <div className="px-6 py-4 space-y-4">
        <PageHeader
          onGradeChange={handleGradeChange}
          onExamTypeChange={handleExamTypeChange}
          onStartDateChange={handleStartDateChange}
          onEndDateChange={handleEndDateChange}
          onMaxPapersChange={handleMaxPapersChange}
        />

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

        <ExamTimetableControls
          onCreate={handleCreate}
          onAutoGenerate={handleAutoGenerate}
          onSaveTimeSlots={handleSaveTimeSlots}
          onPublishToggle={handlePublishToggle}
          onToggleEditMode={handleToggleEditMode}
          onPrint={handlePrint}
          onExport={handleExport}
          loading={loading}
          isEditMode={isEditMode}
          isPublished={isPublished}
          isPublishing={isPublishing}
          canPublish={true}
          canPrintExport={true}
          timeSlots={timeSlots}
        />

        {showGrid && isEditMode ? (
          <EditableExamTimetable
            initialData={timetable.entries || []}
            days={days as string[]}
            timeSlots={formattedTimeSlots}
            isEditMode={isEditMode}
            onDataChange={handleDataChange}
          />
        ) : showGrid ? (
          <ExamTimetableGrid timetable={timetable} />
        ) : (
          <div className="mt-8 p-8 bg-gray-50 border border-dashed border-gray-300 rounded text-center">
            <div className="text-gray-500 mb-2">
              {timetable ? "No time slots configured" : "No exam timetable created yet"}
            </div>
            <div className="text-sm text-gray-400">
              {timetable 
                ? 'Click "+ Time Slots" to add time slots' 
                : 'Click "Create Timetable" to start'}
            </div>
          </div>
        )}

        {isEditMode && showGrid && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
            <h3 className="font-medium text-blue-800 mb-2">Edit Mode Active</h3>
            <ul className="text-sm text-blue-600 space-y-1">
              <li>• Click on any cell to edit exam details</li>
              <li>• Drag and drop to rearrange exam slots</li>
              <li>• Click "Save Changes" when finished editing</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamTimetablePage;