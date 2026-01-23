import api from "@/services/api";
import type { Timetable, TimeSlot, DayOfWeek, TimetableEntry } from "@/types/timetable";

interface TimetableApiRow {
  id: number;
  day_of_week: string;
  start_time: string;
  end_time: string;
  class_id: number;
  room?: string | null;
  subject?: { name: string } | null;
  teacher?: { name: string } | null;
  school_class?: {
    name: string;
    grade?: { name: string };
  };
  is_published?: boolean;
}

export const timetableService = {
  /* ---------- CREATE NEW TIMETABLE ---------- */
  create: async (gradeId: number | null): Promise<Timetable> => {
    // You need to implement your actual create endpoint
    // This should call your Laravel API to create a new timetable
    const { data } = await api.post("/timetables/create", {
      grade_id: gradeId,
    });

    return data;
  },

  /* ---------- AUTO GENERATE TIMETABLE ---------- */
  autoGenerate: async (gradeId: number | null): Promise<Timetable> => {
    // You need to implement your actual auto-generate endpoint
    // This should call your Laravel API to auto-generate timetable
    const { data } = await api.post("/timetables/auto-generate", {
      grade_id: gradeId,
    });

    return data;
  },

  /* ---------- FETCH TIMETABLE BY CLASS ---------- */
  getByClass: async (classId: number): Promise<Timetable | null> => {
    const { data } = await api.get("/timetables", {
      params: { class_id: classId },
    });

    if (!data.length) return null;

    const entries: TimetableEntry[] = data.map((row: TimetableApiRow) => ({
      id: String(row.id),
      day: row.day_of_week as DayOfWeek,
      timeSlot: `${row.start_time} - ${row.end_time}`,
      subject: row.subject?.name ?? "",
      teacher: row.teacher?.name ?? undefined,
      room: row.room ?? undefined,
      classId: String(row.class_id),
    }));

    // Extract unique time slots from the data
    const timeSlotMap = new Map<string, TimeSlot>();
    data.forEach((row: TimetableApiRow) => {
      const key = `${row.start_time}-${row.end_time}`;
      if (!timeSlotMap.has(key)) {
        timeSlotMap.set(key, {
          id: row.id,
          startTime: row.start_time,
          endTime: row.end_time,
          type: "lesson", // You might want to determine this from your data
        });
      }
    });

    const timeSlots: TimeSlot[] = Array.from(timeSlotMap.values());

    return {
      id: data[0]?.id || Date.now(),
      gradeId: null,
      gradeName: data[0]?.school_class?.grade?.name ?? "",
      className: data[0]?.school_class?.name ?? "",
      isPublished: data[0]?.is_published || false,
      timeSlots,
      entries,
    };
  },

  /* ---------- SAVE / UPDATE TIMETABLE ---------- */
  update: async (timetableId: number, timetable: Timetable): Promise<Timetable> => {
    // Clear existing timetable for this class
    const classId = parseInt(timetable.entries[0]?.classId || "1");
    await api.delete("/timetables", {
      data: { class_id: classId }
    });

    // Save new entries
    for (const entry of timetable.entries) {
      if (!entry.subject || entry.subject === "Break" || entry.subject === "Lunch") {
        continue; // Skip empty, break, and lunch cells
      }

      // TODO: Implement actual subject/teacher ID lookup
      // For now, you need to add these API calls or use placeholder IDs
      await api.post("/timetables", {
        class_id: classId,
        subject_id: 1, // Replace with actual subject ID lookup
        teacher_id: 1, // Replace with actual teacher ID lookup
        day_of_week: entry.day,
        start_time: entry.timeSlot.split(" - ")[0],
        end_time: entry.timeSlot.split(" - ")[1],
        room: entry.room || null,
        academic_year_id: 1,
        date: "2025-01-01",
      });
    }

    return timetable;
  },

  /* ---------- EXPORT TIMETABLE ---------- */
  export: async (classId: number | string): Promise<void> => {
    const response = await api.get(`/timetables/export/${classId}`, {
      responseType: 'blob',
    });
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `timetable_class_${classId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },

  /* ---------- PUBLISH TIMETABLE ---------- */
  publish: async (id: number): Promise<boolean> => {
    await api.post(`/timetables/${id}/publish`);
    return true;
  },

  /* ---------- UNPUBLISH TIMETABLE ---------- */
  unpublish: async (id: number): Promise<boolean> => {
    await api.post(`/timetables/${id}/unpublish`);
    return true;
  },
};