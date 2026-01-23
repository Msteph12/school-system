// src/services/calendar.service.ts
import type { CalendarEvent } from "@/types/calendar";

/**
 * TEMP: Mock service.
 * Replace with API calls when calendar endpoints are ready.
 */

const mockEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Staff Meeting",
    date: "2026-01-12",
    startTime: "10:00",
    endTime: "11:00",
    type: "meeting",
  },
  {
    id: "2",
    title: "Mid-Term Exams",
    date: "2026-01-18",
    type: "exam",
  },
];

export const calendarService = {
  async getEventsByMonth(year: number, month: number): Promise<CalendarEvent[]> {
    // month: 0–11
    return Promise.resolve(
      mockEvents.filter(e => {
        const d = new Date(e.date);
        return d.getFullYear() === year && d.getMonth() === month;
      })
    );
  },

  async getEventsByDate(date: string): Promise<CalendarEvent[]> {
    return Promise.resolve(mockEvents.filter(e => e.date === date));
  },

  async createEvent(event: CalendarEvent): Promise<CalendarEvent> {
    return Promise.resolve(event);
  },

  async updateEvent(event: CalendarEvent): Promise<CalendarEvent> {
    return Promise.resolve(event);
  },

  async deleteEvent(): Promise<void> {
  return Promise.resolve();
  },
};
