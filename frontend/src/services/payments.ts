import api from "@/services/api";

export const getPayments = () => {
  return api.get("/payments");
};

export const getStudentPayments = (studentId: number) => {
  return api.get(`/students/${studentId}/payments`);
};
