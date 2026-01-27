"use client";

import { useState } from "react";
import TopBar from "@/components/admin/TopBar";
import PageHeader from "@/components/admin/exam-timetable/PageHeader";
import ExamTimetableControls from "@/components/admin/exam-timetable/ExamTimetableControls";
import ExamTimetableGrid from "@/components/admin/exam-timetable/ExamTimetableGrid";
import EditableExamTimetable from "@/components/admin/exam-timetable/EditExamTimetable";
import type { TimeSlot, ExamTimetable, ExamTimetableEntry } from "@/types/examTimetable";
import { examTimetableService } from "@/services/examTimetable";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

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
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [selectedExamTypeId, setSelectedExamTypeId] = useState<number | null>(null);
  const [selectedExamTypeDisplay, setSelectedExamTypeDisplay] = useState<string>("");
  const [selectedStartDate, setSelectedStartDate] = useState<string>("");
  const [selectedEndDate, setSelectedEndDate] = useState<string>("");
  const [selectedMaxPapers, setSelectedMaxPapers] = useState<number>(2);

  const handleGradeChange = (gradeId: number | null) => {
    console.log("Selected Grade:", gradeId);
    setSelectedGrade(gradeId);
  };

  const handleExamTypeChange = (examTypeId: number | null) => {
    console.log("Selected Exam Type ID:", examTypeId);
    
    // Map IDs to display names for UI only
    const examTypeMap: Record<number, string> = {
      1: "Mid-Term Exam",
      2: "Final Exam", 
      3: "Quarterly Exam",
      4: "Test"
    };
    
    setSelectedExamTypeId(examTypeId);
    setSelectedExamTypeDisplay(examTypeId ? examTypeMap[examTypeId] || "" : "");
  };

  const handleStartDateChange = (date: string) => {
    console.log("Start Date string:", date);
    console.log("Parsed Date:", new Date(date));
    setSelectedStartDate(date);
  };

  const handleEndDateChange = (date: string) => {
    console.log("End Date string:", date);
    console.log("Parsed Date:", new Date(date));
    setSelectedEndDate(date);
  };

  const handleMaxPapersChange = (max: number) => {
    console.log("Max Papers per Day:", max);
    setSelectedMaxPapers(max);
  };

  const handleCreate = async () => {
    if (!selectedGrade || !selectedExamTypeId) {
      setError("Please select both grade and exam type");
      return;
    }
    
    setError(null);
    setLoading("create");
    
    try {
      const newTimetable = await examTimetableService.create(selectedGrade, selectedExamTypeId);
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
    if (!selectedGrade || !selectedExamTypeId) {
      setError("Please select both grade and exam type");
      return;
    }
    
    setError(null);
    setLoading("auto");
    
    const startDate = selectedStartDate || "2024-06-10";
    const endDate = selectedEndDate || "2024-06-15";
    const maxPapersPerDay = selectedMaxPapers || 2;
    
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
        gradeId: selectedGrade,
        examTypeId: selectedExamTypeId,
        startDate,
        endDate,
        maxPapersPerDay,
        subjectIds,
        timeSlots,
      };
      
      const generatedTimetable = await examTimetableService.generate(request);
      
      // Get the actual days from selected dates
      const actualDays = getDaysFromDateRange(startDate, endDate);

      // Map entries to correct days
      const updatedEntries: ExamTimetableEntry[] = [];
      let dayIndex = 0;
      let papersToday = 0;

      generatedTimetable.entries.forEach((entry) => {
        // Move to next day if reached max papers per day
        if (papersToday >= maxPapersPerDay) {
          dayIndex++;
          papersToday = 0;
        }
        
        // Assign entry to current day
        updatedEntries.push({
          ...entry,
          day: actualDays[dayIndex] || actualDays[0]
        });
        
        papersToday++;
      });

      const timetableWithDates = {
        ...generatedTimetable,
        startDate: startDate,
        endDate: endDate,
        entries: updatedEntries,
      };

      setTimetable(timetableWithDates);
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
    if (!timetable) {
      setError("No timetable to publish. Please create a timetable first.");
      return;
    }
    
    // Validation checks
    if (!selectedGrade) {
      setError("Please select a grade before publishing.");
      return;
    }
    
    if (!selectedExamTypeId) {
      setError("Please select an exam type before publishing.");
      return;
    }
    
    if (!timetable.entries || timetable.entries.length === 0) {
      setError("Cannot publish empty timetable. Add exam entries first.");
      return;
    }
    
    if (timeSlots.length === 0) {
      setError("Cannot publish without time slots. Add time slots first.");
      return;
    }
    
    setError(null);
    setIsPublishing(true);
    
    try {
      if (isPublished) {
        await examTimetableService.unpublish(timetable.id);
      } else {
        await examTimetableService.publish(timetable.id);
      }
      
      setIsPublished(!isPublished);
      setSuccessMessage(
        isPublished 
          ? "Exam timetable unpublished successfully!" 
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

  const handleExport = async () => {
    const element = document.getElementById("timetable-print-area");
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);

    if (imgHeight > pageHeight) {
      let heightLeft = imgHeight - pageHeight;
      while (heightLeft > 0) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
    }

    pdf.save("exam-timetable.pdf");
  };

  const getDaysFromDateRange = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const days = [];
    
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dayName = dayNames[d.getDay()];
      if (dayName !== "Sunday" && dayName !== "Saturday") {
        days.push(dayName);
      }
    }
    
    return days.length > 0 ? days : ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  };

  const days = getDaysFromDateRange(selectedStartDate || timetable?.startDate || "", selectedEndDate || timetable?.endDate || "");

  const formattedTimeSlots = timeSlots.map(slot => 
    `${slot.startTime} - ${slot.endTime}${slot.type === 'break' ? ' (Break)' : ''}${slot.type === 'lunch' ? ' (Lunch)' : ''}`
  );
  
  const showGrid = timetable && timeSlots.length > 0;

  return (
    <div className="space-y-6">
      <TopBar />

      <div className="flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => window.history.back()}
            className="text-blue-600 hover:underline flex items-center gap-1"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-semibold text-gray-800 print:hidden">
            Exam Timetable
          </h1>
        </div>
        
        <div className={`px-3 py-1 text-sm rounded-full font-medium ${
          isPublished 
            ? "bg-green-100 text-green-700" 
            : "bg-blue-100 text-blue-800"
        } print:hidden`}>
          {isPublished ? "Published" : "Draft Mode"}
        </div>
      </div>

      <div className="px-6 py-4 space-y-4 print:p-0 print:space-y-0">
        <PageHeader
          onGradeChange={handleGradeChange}
          onExamTypeChange={handleExamTypeChange}
          onStartDateChange={handleStartDateChange}
          onEndDateChange={handleEndDateChange}
          onMaxPapersChange={handleMaxPapersChange}
          isPublished={isPublished}
        />

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded print:hidden">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded print:hidden">
            ✓ {successMessage}
          </div>
        )}

        <div className="print:hidden">
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
        </div>

        {showGrid && isEditMode ? (
          <div className="print:hidden">
            <EditableExamTimetable
              initialData={timetable.entries || []}
              days={days as string[]}
              timeSlots={formattedTimeSlots}
              isEditMode={isEditMode}
              onDataChange={handleDataChange}
            />
          </div>
        ) : showGrid ? (
          <ExamTimetableGrid 
            timetable={timetable}
            grade={selectedGrade ? `Grade ${selectedGrade}` : ""}
            examType={selectedExamTypeDisplay}
            calculatedDays={days} />
        ) : (
          <div className="mt-8 p-8 bg-gray-50 border border-dashed border-gray-300 rounded text-center print:hidden">
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
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded print:hidden">
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