import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { AuthContext, type User } from "./AuthContext";
import { authService } from "@/services/auth";
import api from "@/services/api";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  let mounted = true;

  const initAuth = async () => {
  const token = localStorage.getItem("auth_token");

  if (!token) {
    if (mounted) setLoading(false);
    return;
  }

  api.defaults.headers.common.Authorization = `Bearer ${token}`;

  try {
    const user = await authService.getMe();
    if (mounted) setUser(user);
  } finally {
    if (mounted) setLoading(false);
  }
};


    initAuth();

    return () => {
        mounted = false;
    };
    }, []);


  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        isAdmin: user?.role === "admin",
        isRegistrar: user?.role === "registrar",
        isTeacher: user?.role === "teacher",
        isAccountant: user?.role === "accountant",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
