import api from "@/services/api";

export const getAcademicYears = () => api.get("/academic-years");
