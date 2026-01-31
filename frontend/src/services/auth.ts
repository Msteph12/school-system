import api from "@/services/api";

interface LoginPayload {
  email: string;
  password: string;
}

export const authService = {
  async login(payload: LoginPayload) {
    const response = await api.post("/login", payload);

    const { token, user } = response.data;

    // ✅ STORE TOKEN (single source of truth)
    localStorage.setItem("auth_token", token);

    return user;
  },

  async getMe() {
    const response = await api.get("/me");
    return response.data;
  },

  async logout() {
    try {
      await api.post("/logout");
    } finally {
      // ✅ ALWAYS CLEAR TOKEN
      localStorage.removeItem("auth_token");
    }
  },
};
