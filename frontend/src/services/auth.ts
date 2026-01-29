import api from "@/services/api";

export interface LoginPayload {
  email: string;
  password: string;
}

export const authService = {
  async login(payload: LoginPayload) {
    const response = await api.post("/login", payload);
    const { token, user } = response.data;

    localStorage.setItem("auth_token", token);
    api.defaults.headers.common.Authorization = `Bearer ${token}`;

    return user;
  },

  async getMe() {
    const response = await api.get("/me");
    return response.data;
  },

  async forgotPassword(email: string) {
    return api.post("/forgot-password", { email });
  },

  async resetPassword(payload: {
    email: string;
    token: string;
    password: string;
    password_confirmation: string;
  }) {
    return api.post("/reset-password", payload);
  },

  async logout() {
    try {
      await api.post("/logout"); // ✅ revoke token in backend
    } finally {
      localStorage.removeItem("auth_token");
      delete api.defaults.headers.common.Authorization;
    }
  },
};
