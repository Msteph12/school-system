import api from "@/services/api";

export interface DashboardStats {
  students: number;
  teachers: number;
  grades: number;

  studentsWithBalances: number;

  timetable: {
    published: number;
    total: number;
  };

  teacherAttendance: {
    present: number;
    total: number;
  };
}

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const response = await api.get("/admin/dashboard");
    return response.data;
  },
};
