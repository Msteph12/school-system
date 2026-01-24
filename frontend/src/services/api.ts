import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  withCredentials: true, // REQUIRED for Sanctum
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Optional: handle auth errors globally
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      console.error("Unauthenticated – login required");
    }
    if (error.response?.status === 403) {
      console.error("Forbidden – admin role required");
    }
    return Promise.reject(error);
  }
);

export default api;

