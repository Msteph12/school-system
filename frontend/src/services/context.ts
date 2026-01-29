import api from "@/services/api";

export interface SystemContextResponse {
  academicYear: string;
  term: string;
}

export const contextService = {
  async getCurrent(): Promise<SystemContextResponse> {
    const response = await api.get("/context/current");
    return response.data;
  },
};
