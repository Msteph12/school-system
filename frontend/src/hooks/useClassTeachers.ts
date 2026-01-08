import { useEffect, useState } from "react";
import { getClassTeachers } from "@/services/classTeachers";
import type { ClassTeacher } from "@/types/classTeacher";
import api from "@/services/api";

export const useClassTeachers = () => {
  const [data, setData] = useState<ClassTeacher[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const res = await getClassTeachers();
    setData(res);
    setLoading(false);
  };

  useEffect(() => {
  const fetchData = async () => {
    const res = await api.get("/class-teachers");
    setData(res.data);
  };

  fetchData();
}, []);


  return { data, loading, refetch: fetchData };
};
