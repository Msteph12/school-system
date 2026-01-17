"use client";

import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  if (!auth) return null;

  if (!auth.isAdmin) {
    navigate("/unauthorized"); // or dashboard
    return null;
  }

  return <>{children}</>;
};

export default AdminGuard;
