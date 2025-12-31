import api from "../services/api";
// or ../../lib/api depending on file location

interface StudentData {
  [key: string]: unknown;
}

export const getStudents = () => api.get("/students");

export const addStudent = (data: StudentData) =>
  api.post("/students", data);

export const updateStudent = (id: number, data: StudentData) =>
  api.put(`/students/${id}`, data);

export const promoteStudents = (payload: {
  student_ids: number[];
  from_academic_year_id?: number;
  to_academic_year_id?: number;
}) => {
  return api.post("/promotions", payload);
};


