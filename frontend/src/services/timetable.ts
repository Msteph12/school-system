import type { Timetable, TimeSlot, DayOfWeek, TimetableEntry } from "@/types/timetable";

const defaultTimeSlots: TimeSlot[] = [
  { id: 1, startTime: "08:00", endTime: "08:45", type: "lesson" },
  { id: 2, startTime: "08:45", endTime: "09:30", type: "lesson" },
  { id: 3, startTime: "09:30", endTime: "09:45", type: "break" },
  { id: 4, startTime: "09:45", endTime: "10:30", type: "lesson" },
  { id: 5, startTime: "10:30", endTime: "11:15", type: "lesson" },
  { id: 6, startTime: "11:15", endTime: "11:30", type: "break" },
  { id: 7, startTime: "11:30", endTime: "12:15", type: "lesson" },
  { id: 8, startTime: "12:15", endTime: "13:00", type: "lunch" },
  { id: 9, startTime: "13:00", endTime: "13:45", type: "lesson" },
  { id: 10, startTime: "13:45", endTime: "14:30", type: "lesson" },
];

const days: DayOfWeek[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export const timetableService = {
  create: async (gradeId: number | null): Promise<Timetable> => {
    // Create empty timetable entries for all time slots and days
    const entries: TimetableEntry[] = [];
    
    defaultTimeSlots.forEach(slot => {
      days.forEach(day => {
        entries.push({
          day,
          timeSlotId: slot.id,
          data: slot.type === "lesson" ? null : null // All empty initially
        });
      });
    });

    return {
      id: Date.now(), // Temporary ID
      gradeId,
      isPublished: false,
      timeSlots: defaultTimeSlots,
      entries,
    };
  },

  autoGenerate: async (gradeId: number | null): Promise<Timetable> => {
    // Create sample data for auto-generation
    const entries: TimetableEntry[] = [];
    const sampleSubjects = ["Math", "Science", "English", "History", "Art", "PE"];
    
    defaultTimeSlots.forEach(slot => {
      days.forEach(day => {
        // For breaks and lunch, leave data as null
        if (slot.type === "break" || slot.type === "lunch") {
          entries.push({
            day,
            timeSlotId: slot.id,
            data: null
          });
        } else {
          // For lessons, generate random sample data
          const randomSubject = sampleSubjects[Math.floor(Math.random() * sampleSubjects.length)];
          
          entries.push({
            day,
            timeSlotId: slot.id,
            data: {
              subject: randomSubject,
            }
          });
        }
      });
    });

    return {
      id: Date.now(), // Temporary ID
      gradeId,
      isPublished: false,
      timeSlots: defaultTimeSlots,
      entries,
    };
  },

  getByGrade: async (gradeId: number | null): Promise<Timetable | null> => {
    // Use the parameter to avoid the "unused" warning
    console.log("Fetching timetable for grade:", gradeId);
    return null; // Return null for now, could implement later
  },

  saveTimeSlots: async (
    gradeId: number | null,
    slots: TimeSlot[]
  ): Promise<boolean> => {
    console.log("Saving time slots for grade", gradeId, slots);
    return true;
  },

  publish: async (timetableId: number): Promise<boolean> => {
    console.log("Publishing timetable", timetableId);
    return true;
  },

  unpublish: async (timetableId: number): Promise<boolean> => {
    console.log("Unpublishing timetable", timetableId);
    return true;
  },
};