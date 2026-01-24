import { create } from "zustand";
import type { CalendarEvent } from "@/types/calendar";
import { calendarService } from "@/services/calendar"; // Add this import

interface CalendarStore {
  currentDate: Date;
  view: "month" | "week";
  modalOpen: boolean;
  selectedDate: string | null;
  events: CalendarEvent[];
  isLoading: boolean; // Add loading state

  setCurrentDate: (date: Date) => void;
  setView: (view: "month" | "week") => void;

  viewModalOpen: boolean;
  selectedEvent: CalendarEvent | null;
  openViewModal: (event: CalendarEvent) => void;
  closeViewModal: () => void;

  openModal: (date: string) => void;
  closeModal: () => void;

  addEvent: (event: CalendarEvent) => void;
  removeEvent: (eventId: string) => void;

  lastDeletedEvent: CalendarEvent | null;
  undoDelete: () => void;

  updateEvent: (event: CalendarEvent) => void;

  eventFilters: string[]; 
  toggleEventFilter: (type: string) => void;

  // Add these new functions
  fetchEvents: () => Promise<void>;
  syncEvent: (event: CalendarEvent) => Promise<void>;
  deleteEventFromApi: (eventId: string) => Promise<void>;

  nextMonth: () => void;
  prevMonth: () => void;
  nextWeek: () => void;
  prevWeek: () => void;
  goToToday: () => void;
}

export const useCalendarStore = create<CalendarStore>((set, get) => ({
  currentDate: new Date(),
  view: "month",
  modalOpen: false,
  selectedDate: null,
  events: [],
  isLoading: false, // Initialize
  viewModalOpen: false,
  selectedEvent: null,
  lastDeletedEvent: null,
  eventFilters: ["exam", "meeting", "holiday", "academic", "general", "other"],

  /* =====================
     Event actions (API)
  ===================== */
  fetchEvents: async () => {
    set({ isLoading: true });
    try {
      const { currentDate } = get();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      
      const events = await calendarService.getEventsByMonth(year, month);
      set({ events, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch events:", error);
      set({ isLoading: false });
    }
  },

  addEvent: async (event) => {
    try {
      const savedEvent = await calendarService.createEvent(event);
      set((state) => ({
        events: [...state.events, savedEvent],
      }));
    } catch (error) {
      console.error("Failed to save event:", error);
      throw error;
    }
  },

  removeEvent: async (eventId) => {
    try {
      await calendarService.deleteEvent(eventId);
      set((state) => {
        const deleted = state.events.find((e) => e.id === eventId);
        return {
          events: state.events.filter((e) => e.id !== eventId),
          lastDeletedEvent: deleted ?? null,
        };
      });
    } catch (error) {
      console.error("Failed to delete event:", error);
      throw error;
    }
  },

  updateEvent: async (updatedEvent) => {
    try {
      const savedEvent = await calendarService.updateEvent(updatedEvent);
      set((state) => ({
        events: state.events.map((e) =>
          e.id === savedEvent.id ? savedEvent : e
        ),
        selectedEvent: savedEvent,
      }));
    } catch (error) {
      console.error("Failed to update event:", error);
      throw error;
    }
  },

  // Keep undoDelete as local only
  undoDelete: () =>
    set((state) =>
      state.lastDeletedEvent
        ? {
            events: [...state.events, state.lastDeletedEvent],
            lastDeletedEvent: null,
          }
        : {}
    ),

  syncEvent: async (event) => {
    try {
      const savedEvent = await calendarService.updateEvent(event);
      set((state) => ({
        events: state.events.map((e) =>
          e.id === savedEvent.id ? savedEvent : e
        ),
      }));
    } catch (error) {
      console.error("Failed to sync event:", error);
    }
  },

  deleteEventFromApi: async (eventId) => {
    try {
      await calendarService.deleteEvent(eventId);
    } catch (error) {
      console.error("Failed to delete from API:", error);
    }
  },

  /* =====================
     UI / Navigation
  ===================== */
  setCurrentDate: (date) => {
    set({ currentDate: date });
    get().fetchEvents(); // Fetch events when date changes
  },

  setView: (view) => set({ view }),

  openViewModal: (event) =>
    set({
      viewModalOpen: true,
      selectedEvent: event,
    }),

  closeViewModal: () =>
    set({
      viewModalOpen: false,
      selectedEvent: null,
    }),

  openModal: (date) => set({ modalOpen: true, selectedDate: date }),
  closeModal: () => set({ modalOpen: false, selectedDate: null }),

  toggleEventFilter: (type) =>
  set((state) => {
    if (type === "all") {
      // Toggle "all" means toggle all event types
      const allTypes = ["exam", "meeting", "holiday", "academic", "general", "other"];
      const hasAll = state.eventFilters.includes("all");
      
      if (hasAll) {
        // Remove all types
        return {
          eventFilters: state.eventFilters.filter(t => t !== "all")
        };
      } else {
        // Add all types
        return {
          eventFilters: [...new Set([...state.eventFilters, "all", ...allTypes])]
        };
      }
    } else {
      // Normal type toggle
      const newFilters = state.eventFilters.includes(type)
        ? state.eventFilters.filter((t) => t !== type)
        : [...state.eventFilters, type];
      
      // Remove "all" if it exists when toggling individual types
      const filtersWithoutAll = newFilters.filter(t => t !== "all");
      
      return { eventFilters: filtersWithoutAll };
    }
  }),

  nextMonth: () =>
    set((state) => {
      const newDate = new Date(state.currentDate);
      newDate.setMonth(newDate.getMonth() + 1);
      return { currentDate: newDate };
    }),

  prevMonth: () =>
    set((state) => {
      const newDate = new Date(state.currentDate);
      newDate.setMonth(newDate.getMonth() - 1);
      return { currentDate: newDate };
    }),

  nextWeek: () =>
    set((state) => {
      const newDate = new Date(state.currentDate);
      newDate.setDate(newDate.getDate() + 7);
      return { currentDate: newDate };
    }),

  prevWeek: () =>
    set((state) => {
      const newDate = new Date(state.currentDate);
      newDate.setDate(newDate.getDate() - 7);
      return { currentDate: newDate };
    }),

  goToToday: () => {
    const today = new Date();
    set({ currentDate: today });
    get().fetchEvents();
  },
}));