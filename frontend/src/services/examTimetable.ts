import type { 
  ExamTimetable, 
  GenerateExamTimetableRequest,
  ExamTimetableEntry,
  TimeSlot
} from "@/types/examTimetable";

const mockSubjects = [
  { id: 101, name: "Mathematics" },
  { id: 102, name: "English Language" },
  { id: 103, name: "Science" },
  { id: 104, name: "Social Studies" },
  { id: 105, name: "Kiswahili" },
  { id: 106, name: "Creative Arts" },
  { id: 107, name: "Physical Education" },
  { id: 108, name: "Religious Education" },
  { id: 109, name: "Computer Studies" },
  { id: 110, name: "French" },
  { id: 111, name: "Business Studies" },
];

export const examTimetableService = {
  create: async (gradeId: number): Promise<ExamTimetable> => {
    const defaultTimeSlots: TimeSlot[] = [
      { id: 1, startTime: "08:00", endTime: "10:00" },
      { id: 2, startTime: "10:30", endTime: "12:30" },
      { id: 3, startTime: "14:00", endTime: "16:00" },
    ];
    
    return Promise.resolve({
      id: Date.now(),
      name: `Grade ${gradeId} Exams`,
      gradeId,
      gradeName: `Grade ${gradeId}`,
      examType: "midterm",
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      maxPapersPerDay: 2,
      timeSlots: defaultTimeSlots,
      entries: [],
      isPublished: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      totalSubjects: 0,
      totalPapers: 0,
    });
  },

  generate: async (request: GenerateExamTimetableRequest): Promise<ExamTimetable> => {
  // Sort time slots by start time
  const sortedTimeSlots = [...request.timeSlots].sort((a, b) => 
    a.startTime.localeCompare(b.startTime)
  );
  
  // Generate actual exam entries
  const entries: ExamTimetableEntry[] = [];
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  
  let paperCount = 0;
  
  // Simple scheduling algorithm
  for (let dayIndex = 0; dayIndex < days.length && paperCount < request.subjectIds.length; dayIndex++) {
    const papersToday = Math.min(
      request.maxPapersPerDay,
      request.subjectIds.length - paperCount
    );
    
    let examSlotIndex = 0; // Track exam slots (skip breaks/lunch)
    
    for (let slotIndex = 0; slotIndex < sortedTimeSlots.length && examSlotIndex < papersToday; slotIndex++) {
      if (paperCount >= request.subjectIds.length) break;
      
      const timeSlot = sortedTimeSlots[slotIndex];
      
      // Skip break/lunch slots for exam scheduling
      if (timeSlot.type === "break" || timeSlot.type === "lunch") {
        continue;
      }
      
      const subjectId = request.subjectIds[paperCount];
      const subject = mockSubjects.find(s => s.id === subjectId);
      
      if (subject && timeSlot) {
        entries.push({
          id: `${Date.now()}-${paperCount}`,
          examId: Date.now(),
          subjectId,
          subjectName: subject.name,
          paperLabel: `Paper ${examSlotIndex + 1}`,
          date: `2024-06-${10 + dayIndex}`,
          day: days[dayIndex],
          timeSlotId: timeSlot.id || slotIndex + 1,
          startTime: timeSlot.startTime,
          endTime: timeSlot.endTime,
          duration: 120,
          gradeId: request.gradeId,
          gradeName: `Grade ${request.gradeId}`,
          examType: request.examType,
          venue: `Hall ${String.fromCharCode(65 + examSlotIndex)}`,
          invigilator: `Invigilator ${paperCount + 1}`,
        });
        paperCount++;
        examSlotIndex++;
      }
    }
  }
  
  // Add IDs to time slots if missing
  const timeSlotsWithIds = sortedTimeSlots.map((slot, index) => ({
    ...slot,
    id: slot.id || index + 1
  }));
  
  return Promise.resolve({
    id: Date.now(),
    name: `Grade ${request.gradeId} ${request.examType} Exams`,
    gradeId: request.gradeId,
    gradeName: `Grade ${request.gradeId}`,
    examType: request.examType,
    startDate: request.startDate,
    endDate: request.endDate,
    maxPapersPerDay: request.maxPapersPerDay,
    timeSlots: timeSlotsWithIds,
    entries,
    isPublished: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    totalSubjects: request.subjectIds.length,
    totalPapers: entries.length,
  });
},

  updateEntries: async (id: number, entries: ExamTimetableEntry[]): Promise<ExamTimetable> => {
    return Promise.resolve({
      id,
      name: "Updated Timetable",
      gradeId: 1,
      gradeName: "Grade 1",
      examType: "midterm",
      startDate: "",
      endDate: "",
      maxPapersPerDay: 2,
      timeSlots: [],
      entries,
      isPublished: false,
      createdAt: "",
      updatedAt: "",
      totalSubjects: 0,
      totalPapers: entries.length,
    });
  },

  publish: async (): Promise<ExamTimetable> => {
    return Promise.resolve({} as ExamTimetable);
  },
  
  unpublish: async (): Promise<ExamTimetable> => {
    return Promise.resolve({} as ExamTimetable);
  },
};