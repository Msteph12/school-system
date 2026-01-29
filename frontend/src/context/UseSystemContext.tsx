import { useContext } from "react";
import { SystemContext } from "./SystemContext";

export const useSystemContext = () => {
  const ctx = useContext(SystemContext);
  if (!ctx) {
    throw new Error("useSystemContext must be used inside SystemProvider");
  }
  return ctx;
};
