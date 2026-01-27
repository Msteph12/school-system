import type {
  ExamTimetable,
  GenerateExamTimetableRequest,
  ExamTimetableEntry,
} from "@/types/examTimetable";
import api from "@/services/api";

/** Laravel API shape */
interface LaravelExamTimetable {
  id: number;
  academic_year_id: number;
  term_id: number;
  exam_type_id: number;
  grade_id: number;
  start_date: string;
  end_date: string;
  max_papers_per_day: number;
  status: "draft" | "published";
  created_at: string;
  updated_at: string;
  name?: string;
  days?: Array<{
    id: number;
    exam_date: string;
    day_name: string;
    slots: Array<{
      id: number;
      slot_number: number;
      subject_id: number;
      start_time: string | null;
      end_time: string | null;
      subject?: {
        id: number;
        name: string;
      };
    }>;
  }>;
}

export const examTimetableService = {
  /** CREATE EMPTY TIMETABLE */
  create: async (
    gradeId: number,
    examTypeId: number
  ): Promise<ExamTimetable> => {
    const response = await api.post("/exam-timetables", {
      academic_year_id: 1,
      term_id: 1,
      exam_type_id: examTypeId,
      grade_id: gradeId,
      start_date: new Date().toISOString().split("T")[0],
      end_date: new Date(Date.now() + 7 * 86400000)
        .toISOString()
        .split("T")[0],
      max_papers_per_day: 2,
      created_by: 1,
    });

    const data = response.data as LaravelExamTimetable;

    return {
      id: data.id,
      name: data.name || `Grade ${data.grade_id} Exams`,
      gradeId: data.grade_id,
      gradeName: `Grade ${data.grade_id}`,
      examTypeId: data.exam_type_id,
      startDate: data.start_date,
      endDate: data.end_date,
      maxPapersPerDay: data.max_papers_per_day,
      timeSlots: [],
      entries: [],
      isPublished: data.status === "published",
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      totalSubjects: 0,
      totalPapers: 0,
    };
  },

  /** CREATE + AUTO GENERATE */
  generate: async (
    request: GenerateExamTimetableRequest
  ): Promise<ExamTimetable> => {
    const createResponse = await api.post("/exam-timetables", {
      academic_year_id: 1,
      term_id: 1,
      exam_type_id: request.examTypeId,
      grade_id: request.gradeId,
      start_date: request.startDate,
      end_date: request.endDate,
      max_papers_per_day: request.maxPapersPerDay,
      created_by: 1,
    });

    const timetableId = (createResponse.data as LaravelExamTimetable).id;

    await api.post("/exam-timetables/auto-generate", {
      timetable_id: timetableId,
      subject_ids: request.subjectIds,
    });

    const showResponse = await api.get(
      `/exam-timetables/${timetableId}`
    );
    const timetableData = showResponse.data as LaravelExamTimetable;

    const entries: ExamTimetableEntry[] = [];

    timetableData.days?.forEach(day => {
      day.slots?.forEach(slot => {
        entries.push({
          id: `slot-${slot.id}`,
          examId: timetableData.id,
          subjectId: slot.subject_id,
          subjectName: slot.subject?.name || "Unknown",
          paperLabel: `Paper ${slot.slot_number}`,
          date: day.exam_date,
          day: day.day_name,
          timeSlotId: slot.slot_number,
          startTime:
            slot.start_time ??
            examTimetableService.calculateTimeForSlot(
              slot.slot_number
            ),
          endTime:
            slot.end_time ??
            examTimetableService.calculateEndTimeForSlot(
              slot.slot_number
            ),
          duration: 120,
          gradeId: timetableData.grade_id,
          gradeName: `Grade ${timetableData.grade_id}`,
          examTypeId: timetableData.exam_type_id,
          venue: "Hall A",
          invigilator: "Invigilator 1",
        });
      });
    });

    return {
      id: timetableData.id,
      name:
        timetableData.name ||
        `Grade ${timetableData.grade_id} Exams`,
      gradeId: timetableData.grade_id,
      gradeName: `Grade ${timetableData.grade_id}`,
      examTypeId: timetableData.exam_type_id,
      startDate: timetableData.start_date,
      endDate: timetableData.end_date,
      maxPapersPerDay: timetableData.max_papers_per_day,
      timeSlots: request.timeSlots.map((s, i) => ({
        ...s,
        id: s.id ?? i + 1,
      })),
      entries,
      isPublished: timetableData.status === "published",
      createdAt: timetableData.created_at,
      updatedAt: timetableData.updated_at,
      totalSubjects: request.subjectIds.length,
      totalPapers: entries.length,
    };
  },

  /** UPDATE ENTRIES */
  updateEntries: async (
    id: number,
    entries: ExamTimetableEntry[]
  ): Promise<ExamTimetable> => {
    const response = await api.put(`/exam-timetables/${id}`, {
      updates: entries.map(e => ({
        day_name: e.day,
        subject_id: e.subjectId,
        slot_number: e.timeSlotId,
        start_time: e.startTime,
        end_time: e.endTime,
      })),
    });

    const data = response.data as LaravelExamTimetable;

    return {
      id: data.id,
      name: data.name || "Updated Timetable",
      gradeId: data.grade_id,
      gradeName: `Grade ${data.grade_id}`,
      examTypeId: data.exam_type_id,
      startDate: data.start_date,
      endDate: data.end_date,
      maxPapersPerDay: data.max_papers_per_day,
      timeSlots: [],
      entries,
      isPublished: data.status === "published",
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      totalSubjects: 0,
      totalPapers: entries.length,
    };
  },

  /** PUBLISH */
  publish: async (id: number): Promise<ExamTimetable> => {
    await api.post(`/exam-timetables/${id}/publish`);
    const { data } = await api.get(`/exam-timetables/${id}`);

    const t = data as LaravelExamTimetable;

    return {
      id: t.id,
      name: t.name || `Grade ${t.grade_id} Exams`,
      gradeId: t.grade_id,
      gradeName: `Grade ${t.grade_id}`,
      examTypeId: t.exam_type_id,
      startDate: t.start_date,
      endDate: t.end_date,
      maxPapersPerDay: t.max_papers_per_day,
      timeSlots: [],
      entries: [],
      isPublished: true,
      createdAt: t.created_at,
      updatedAt: t.updated_at,
      totalSubjects: 0,
      totalPapers: 0,
    };
  },

  /** UNPUBLISH */
  unpublish: async (id: number): Promise<ExamTimetable> => {
    const { data } = await api.put(`/exam-timetables/${id}`, {
      status: "draft",
    });

    const t = data as LaravelExamTimetable;

    return {
      id: t.id,
      name: t.name || `Grade ${t.grade_id} Exams`,
      gradeId: t.grade_id,
      gradeName: `Grade ${t.grade_id}`,
      examTypeId: t.exam_type_id,
      startDate: t.start_date,
      endDate: t.end_date,
      maxPapersPerDay: t.max_papers_per_day,
      timeSlots: [],
      entries: [],
      isPublished: false,
      createdAt: t.created_at,
      updatedAt: t.updated_at,
      totalSubjects: 0,
      totalPapers: 0,
    };
  },

  /** TIME HELPERS */
  calculateTimeForSlot: (slot: number) =>
    ["08:00", "10:30", "14:00", "16:30"][slot - 1] || "08:00",

  calculateEndTimeForSlot: (slot: number) =>
    ["10:00", "12:30", "16:00", "18:30"][slot - 1] || "10:00",
};
