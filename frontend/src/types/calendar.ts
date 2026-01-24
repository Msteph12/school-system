// src/types/calendar.types.ts

export type CalendarEventType =
  | "academic"
  | "exam"
  | "holiday"
  | "meeting"
  | "general"
  | "other";

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // ISO date: YYYY-MM-DD
  startTime?: string; // HH:mm
  endTime?: string;   // HH:mm
  meetingLink?: string;
  type: CalendarEventType;
  color?: string; // optional UI override
  description?: string;
}

export interface CalendarCellProps {
  date: Date;
  events: CalendarEvent[];
  isCurrentMonth: boolean;
  onEventClick?: (event: CalendarEvent) => void;
}