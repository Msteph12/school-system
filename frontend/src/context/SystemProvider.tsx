"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { SystemContext } from "./SystemContext";
import { contextService } from "@/services/context";

export const SystemProvider = ({ children }: { children: ReactNode }) => {
  const [academicYear, setAcademicYear] = useState<string | null>(null);
  const [term, setTerm] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const data = await contextService.getCurrent();
        if (mounted) {
          setAcademicYear(data.academicYear);
          setTerm(data.term);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <SystemContext.Provider value={{ academicYear, term, loading }}>
      {children}
    </SystemContext.Provider>
  );
};
