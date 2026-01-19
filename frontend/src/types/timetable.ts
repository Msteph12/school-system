export type TimeSlotType = "lesson" | "break" | "lunch";

export interface TimeSlot {
  id: number;
  startTime: string;
  endTime: string;
  type: TimeSlotType;
  label?: string;
}


export interface TimetableCellData {
  subject: string;
  teacher?: string | null;
  room?: string | null;
}

export type DayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday";

export interface TimetableEntry {
  day: DayOfWeek;
  timeSlotId: number;
  data: TimetableCellData | null; // null for break/lunch
}

export interface Timetable {
  id: number;
  gradeId: number | null;
  isPublished: boolean;
  timeSlots: TimeSlot[];
  entries: TimetableEntry[];
}
