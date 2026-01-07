import api from "../services/api";

export const getPromotionHistory = async () => {
  const response = await api.get("/promotions/history");
  return response.data;
};