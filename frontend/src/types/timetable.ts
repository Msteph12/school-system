export type TimeSlotType = "lesson" | "break" | "lunch";

export interface TimeSlot {
  id: number;
  startTime: string; // "08:00"
  endTime: string;   // "08:40"
  label: string;     // "08:00 - 08:40"
  type: TimeSlotType;
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
  gradeId: number;
  isPublished: boolean;
  timeSlots: TimeSlot[];
  entries: TimetableEntry[];
}
