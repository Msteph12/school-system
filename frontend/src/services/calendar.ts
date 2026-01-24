// src/services/calendar.service.ts
import api from "@/services/api";
import type { CalendarEvent, CalendarEventType } from "@/types/calendar";

// Define backend event interface
interface BackendCalendarEvent {
  id: number;
  title: string;
  description: string | null;
  start_datetime: string;
  end_datetime: string;
  event_type: string;
  meeting_link: string | null;
  academic_year_id: number;
  term_id: number;
  grade_id: number | null;
  class_id: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Map backend event_type to CalendarEventType
const eventTypeMap: Record<string, CalendarEventType> = {
  academic: "academic",
  exam: "exam",
  holiday: "holiday",
  meeting: "meeting",
  general: "general",
  other: "other",
};

const toFrontendFormat = (backendEvent: BackendCalendarEvent): CalendarEvent => {
  const startDate = new Date(backendEvent.start_datetime);
  const endDate = new Date(backendEvent.end_datetime);
  
  const type = eventTypeMap[backendEvent.event_type] || "general";
  
  return {
    id: backendEvent.id.toString(),
    title: backendEvent.title,
    date: startDate.toLocaleDateString("en-CA"), // YYYY-MM-DD
    startTime: startDate.toTimeString().slice(0, 5), // HH:mm
    endTime: endDate.toTimeString().slice(0, 5), // HH:mm
    type: type,
    meetingLink: backendEvent.meeting_link || undefined,
    description: backendEvent.description || undefined,
  };
};

const toBackendFormat = (event: CalendarEvent) => {
  // Convert date + time to datetime strings
  const start_datetime = `${event.date}T${event.startTime || "00:00"}:00`;
  const end_datetime = `${event.date}T${event.endTime || "23:59"}:00`;
  
  return {
    title: event.title,
    description: event.description || "",
    start_datetime,
    end_datetime,
    event_type: event.type,
    meeting_link: event.meetingLink || null,
    // TODO: Get these from app context/store
    academic_year_id: 1, // Current academic year
    term_id: 1, // Current term
    grade_id: null,
    class_id: null,
  };
};

export const calendarService = {
  async getEventsByMonth(year: number, month: number): Promise<CalendarEvent[]> {
    const startDate = `${year}-${String(month + 1).padStart(2, "0")}-01`;
    const endDate = new Date(year, month + 1, 0).toLocaleDateString("en-CA");
    
    try {
      const response = await api.get<BackendCalendarEvent[]>("/calendar-events", {
        params: {
          start_date: startDate,
          end_date: endDate,
        },
      });
      
      return response.data.map(toFrontendFormat);
    } catch (error) {
      console.error("Failed to fetch events:", error);
      return [];
    }
  },

  async getEventsByDate(date: string): Promise<CalendarEvent[]> {
    try {
      const response = await api.get<BackendCalendarEvent[]>("/calendar-events", {
        params: { date },
      });
      
      return response.data.map(toFrontendFormat);
    } catch (error) {
      console.error("Failed to fetch events:", error);
      return [];
    }
  },

  async createEvent(event: CalendarEvent): Promise<CalendarEvent> {
    try {
      const backendData = toBackendFormat(event);
      const response = await api.post<BackendCalendarEvent>("/calendar-events", backendData);
      
      return toFrontendFormat(response.data);
    } catch (error) {
      console.error("Failed to create event:", error);
      throw error;
    }
  },

  async updateEvent(event: CalendarEvent): Promise<CalendarEvent> {
    try {
      const backendData = toBackendFormat(event);
      const response = await api.put<BackendCalendarEvent>(`/calendar-events/${event.id}`, backendData);
      
      return toFrontendFormat(response.data);
    } catch (error) {
      console.error("Failed to update event:", error);
      throw error;
    }
  },

  async deleteEvent(eventId: string): Promise<void> {
    try {
      await api.delete(`/calendar-events/${eventId}`);
    } catch (error) {
      console.error("Failed to delete event:", error);
      throw error;
    }
  },
};