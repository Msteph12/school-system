import { createContext } from "react";

export interface SystemContextType {
  academicYear: string | null;
  term: string | null;
  loading: boolean;
}

export const SystemContext =
  createContext<SystemContextType | undefined>(undefined);
