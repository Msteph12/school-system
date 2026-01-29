import { createContext } from "react";

export type UserRole = "admin" | "registrar" | "teacher" | "accountant";

export interface User {
  id: number;
  name: string;
  role: UserRole;
}

export interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
  isAdmin: boolean;
  isRegistrar: boolean;
  isTeacher: boolean;
  isAccountant: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
