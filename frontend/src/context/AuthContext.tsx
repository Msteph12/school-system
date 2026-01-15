/* eslint-disable react-refresh/only-export-components */
"use client";

import type { ReactNode } from "react";
import { createContext, useState } from "react";

export type UserRole =
  | "admin"
  | "registrar"
  | "teacher"
  | "accountant"
  | null;

export interface User {
  id: number;
  name: string;
  role: UserRole;
}

export interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAdmin: boolean;
  isRegistrar: boolean;
  isTeacher: boolean;
  isAccountant: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>({
    id: 1,
    name: "Mock User",
    role: "admin", // change to test roles
  });

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
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
