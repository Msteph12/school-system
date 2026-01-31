import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// ✅ ATTACH BEARER TOKEN TO EVERY REQUEST
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem("auth_token"); // ✅ single source of truth
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// ✅ GLOBAL AUTH ERROR HANDLING
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      console.error("401 – Unauthenticated");
      // optional: redirect to login
      // window.location.href = "/login";
    }

    if (error.response?.status === 403) {
      console.error("403 – Forbidden");
    }

    return Promise.reject(error);
  }
);

export default api;
