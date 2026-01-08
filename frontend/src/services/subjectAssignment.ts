import api from "@/services/api";
import type { SubjectAssignment } from "@/types/subjectAssignment";

// GET all assignments
export const getSubjectAssignments = () => {
  return api.get<SubjectAssignment[]>("/subject-teachers");
};

// CREATE assignment
export const assignSubject = (data: {
  teacher_id: number;
  subject_id: number;
  grade_id: number;
  academic_year_id: number;
}) => {
  return api.post("/subject-teachers", data);
};

// DELETE assignment
export const removeSubjectAssignment = (id: number) => {
  return api.delete(`/subject-teachers/${id}`);
};
