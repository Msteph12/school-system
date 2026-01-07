import api from "@/services/api";
import type { TeacherListItem, TeacherFull } from "@/types/teacher";

// GET all teachers (table)
export const getTeachers = () => {
  return api.get<TeacherListItem[]>("/teachers");
};

// GET single teacher (view / edit)
export const getTeacher = (id: number) => {
  return api.get<TeacherFull>(`/teachers/${id}`);
};

// CREATE teacher
export const createTeacher = (data: Partial<TeacherFull>) => {
  return api.post("/teachers", data);
};

// UPDATE teacher
export const updateTeacher = (id: number, data: Partial<TeacherFull>) => {
  return api.put(`/teachers/${id}`, data);
};
