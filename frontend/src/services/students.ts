import api from "../services/api";
// or ../../lib/api depending on file location

interface StudentData {
  [key: string]: unknown;
}

interface PromoteStudentsParams {
  promoted_ids: number[];
  repeated_ids: number[];
  from_academic_year_id?: number;
  to_academic_year_id?: number;
}

export const getStudents = () => api.get("/students");

export const addStudent = (data: StudentData) =>
  api.post("/students", data);

export const updateStudent = (id: number, data: StudentData) =>
  api.put(`/students/${id}`, data);

export const promoteStudents = async (params: PromoteStudentsParams) => {
  const response = await fetch('/api/promotions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return response.json();
};


