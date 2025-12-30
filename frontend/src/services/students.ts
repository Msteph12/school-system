import api from "./api";

interface StudentData {
  [key: string]: unknown;
}

export const getStudents = () => api.get("/students");

export const addStudent = (data: StudentData) =>
  api.post("/students", data);

export const updateStudent = (id: number, data: StudentData) =>
  api.put(`/students/${id}`, data);
