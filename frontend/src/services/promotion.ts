import api from "./api";

export const promoteStudents = (payload: {
  from_academic_year_id: number;
  to_academic_year_id: number;
}) => {
  return api.post("/promotions", payload);
};
