import api from "@/services/api";
import type { ClassTeacher, AssignClassTeacherPayload } from "@/types/classTeacher";

export const getClassTeachers = async () => {
  const res = await api.get<{ data: ClassTeacher[] }>("/class-teachers");
  return res.data;
};

export const assignClassTeacher = async (
  payload: AssignClassTeacherPayload
) => {
  return api.post("/class-teachers", payload);
};

export const unassignClassTeacher = async (id: number) => {
  return api.patch(`/class-teachers/${id}/unassign`);
};
