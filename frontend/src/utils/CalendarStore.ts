import { create } from "zustand";

interface CalendarStore {
  currentDate: Date;
  view: 'month' | 'week';
  modalOpen: boolean;
  selectedDate: string | null;
  setCurrentDate: (date: Date) => void;
  setView: (view: 'month' | 'week') => void;
  openModal: (date: string) => void;
  closeModal: () => void;
  nextMonth: () => void;
  prevMonth: () => void;
  nextWeek: () => void;
  prevWeek: () => void;
  goToToday: () => void;
}


export const useCalendarStore = create<CalendarStore>((set) => ({
  currentDate: new Date(),
  view: 'month',
  modalOpen: false,
  selectedDate: null,
  
  setCurrentDate: (date) => set({ currentDate: date }),
  setView: (view) => set({ view }),
  openModal: (date) => set({ modalOpen: true, selectedDate: date }),
  closeModal: () => set({ modalOpen: false, selectedDate: null }),
  
  nextMonth: () => set((state) => {
    const newDate = new Date(state.currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    return { currentDate: newDate };
  }),
  
  prevMonth: () => set((state) => {
    const newDate = new Date(state.currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    return { currentDate: newDate };
  }),
  
  nextWeek: () => set((state) => {
    const newDate = new Date(state.currentDate);
    newDate.setDate(newDate.getDate() + 7);
    return { currentDate: newDate };
  }),
  
  prevWeek: () => set((state) => {
    const newDate = new Date(state.currentDate);
    newDate.setDate(newDate.getDate() - 7);
    return { currentDate: newDate };
  }),
  
  goToToday: () => set({ currentDate: new Date() }),
}));