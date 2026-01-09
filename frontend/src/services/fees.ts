import api from "@/services/api";
import type { CreateFeeStructurePayload } from "@/types/Fees";

export const getFeeStructures = () => {
  return api.get("/fee-structures");
};

export const getFeeStructure = (id: number) => {
  return api.get(`/fee-structures/${id}`);
};

export const createFeeStructure = (
  data: CreateFeeStructurePayload
) => {
  return api.post("/fee-structures", data);
};

export const updateFeeStructure = (
  id: number,
  data: CreateFeeStructurePayload
) => {
  return api.put(`/fee-structures/${id}`, data);
};
