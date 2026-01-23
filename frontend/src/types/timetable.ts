import type { ReactNode } from "react";

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
  // For drag-and-drop, we need these properties
  id: string;                    // Unique ID for each entry (required for DnD)
  day: DayOfWeek;               // Day of the week
  timeSlot: string;             // Time slot string (e.g., "9:00 - 10:00")
  timeSlotId?: number;          // Optional: reference to TimeSlot ID
  subject: string;              // Subject name (e.g., "Mathematics")
  teacher?: string;             // Teacher's name
  room?: string;                // Room number
  classId?: string;             // Optional class ID
  gradeId?: number;             // Optional grade ID
  // Keep backward compatibility
  data?: TimetableCellData | null; // For compatibility with existing code
}

export interface Timetable {
  gradeName: ReactNode;
  className: ReactNode;
  id: number;
  gradeId: number | null;
  isPublished: boolean;
  timeSlots: TimeSlot[];
  entries: TimetableEntry[];
}

// Additional types for drag-and-drop
export interface DragCellData {
  id: string;
  day: DayOfWeek;
  timeSlot: string;
  subject: string;
  teacher?: string;
  room?: string;
  isDraggable: boolean;
  isEmpty: boolean;
}

// For cell editing
export interface CellUpdateData {
  id: string;
  updates: Partial<TimetableEntry>;
}

// For drag events
export interface DragResult {
  sourceId: string;
  destinationId: string;
  sourceDay: DayOfWeek;
  sourceTimeSlot: string;
  destinationDay: DayOfWeek;
  destinationTimeSlot: string;
}