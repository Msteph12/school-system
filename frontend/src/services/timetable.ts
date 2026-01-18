import type { Timetable, TimeSlot } from "@/types/timetable";

const emptyTimetable: Timetable = {
  id: 0,
  gradeId: 0,
  isPublished: false,
  timeSlots: [],
  entries: [],
};

export const timetableService = {
  create: async (gradeId: number): Promise<Timetable> => {
    return {
      ...emptyTimetable,
      gradeId,
    };
  },

  autoGenerate: async (gradeId: number): Promise<Timetable> => {
    return {
      ...emptyTimetable,
      gradeId,
    };
  },

  getByGrade: async (gradeId: number): Promise<Timetable | null> => {
    return {
      ...emptyTimetable,
      gradeId,
    };
  },

  saveTimeSlots: async (gradeId: number, slots: TimeSlot[]) => {
    // explicitly mark as used
    void gradeId;
    void slots;
    return true;
  },

  publish: async (timetableId: number) => {
    void timetableId;
    return true;
  },

  unpublish: async (timetableId: number) => {
    void timetableId;
    return true;
  },
};
