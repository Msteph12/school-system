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
    const entries: TimetableEntry[] = [];
    
    defaultTimeSlots.forEach(slot => {
      days.forEach(day => {
        const timeSlotString = `${slot.startTime} - ${slot.endTime}`;
        
        entries.push({
          id: `${day}-${slot.id}-${Date.now()}-${Math.random()}`,
          day,
          timeSlot: timeSlotString,
          timeSlotId: slot.id,
          subject: "",
          teacher: undefined,
          room: undefined,
          classId: undefined,
          gradeId: gradeId || undefined,
        });
      });
    });

    return {
      id: Date.now(),
      gradeId,
      isPublished: false,
      timeSlots: defaultTimeSlots,
      entries,
    };
  },

  autoGenerate: async (gradeId: number | null): Promise<Timetable> => {
    const entries: TimetableEntry[] = [];
    const sampleSubjects = ["Math", "Science", "English", "History", "Art", "PE"];
    const sampleTeachers = ["Mr. Smith", "Ms. Johnson", "Dr. Brown", "Mrs. Wilson", "Mr. Davis"];
    const sampleRooms = ["101", "202", "303", "404", "505"];
    
    defaultTimeSlots.forEach(slot => {
      days.forEach(day => {
        const timeSlotString = `${slot.startTime} - ${slot.endTime}`;
        
        if (slot.type === "break" || slot.type === "lunch") {
          entries.push({
            id: `${day}-${slot.id}-${Date.now()}-${Math.random()}`,
            day,
            timeSlot: timeSlotString,
            timeSlotId: slot.id,
            subject: slot.type === "break" ? "Break" : "Lunch",
            teacher: undefined,
            room: undefined,
            classId: undefined,
            gradeId: gradeId || undefined,
          });
        } else {
          const randomSubject = sampleSubjects[Math.floor(Math.random() * sampleSubjects.length)];
          const randomTeacher = sampleTeachers[Math.floor(Math.random() * sampleTeachers.length)];
          const randomRoom = sampleRooms[Math.floor(Math.random() * sampleRooms.length)];
          
          entries.push({
            id: `${day}-${slot.id}-${Date.now()}-${Math.random()}`,
            day,
            timeSlot: timeSlotString,
            timeSlotId: slot.id,
            subject: randomSubject,
            teacher: randomTeacher,
            room: randomRoom,
            classId: undefined,
            gradeId: gradeId || undefined,
          });
        }
      });
    });

    return {
      id: Date.now(),
      gradeId,
      isPublished: false,
      timeSlots: defaultTimeSlots,
      entries,
    };
  },

  getByGrade: async (gradeId: number | null): Promise<Timetable | null> => {
    console.log("Fetching timetable for grade:", gradeId);
    return null;
  },

  saveTimeSlots: async (gradeId: number | null, slots: TimeSlot[]): Promise<boolean> => {
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

  update: async (timetableId: number, data: Timetable): Promise<Timetable> => {
    console.log("Updating timetable", timetableId, data);
    return data;
  },
};