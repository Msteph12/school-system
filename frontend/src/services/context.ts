import api from "@/services/api";

export interface SystemContextResponse {
  academicYear: {
    id: number;
    name: string;
  } | null;

  term: {
    id: number;
    name: string;
  } | null;
}

export const contextService = {
  async getCurrent(): Promise<SystemContextResponse> {
    const response = await api.get("/context/current");
    return response.data;
  },
};
