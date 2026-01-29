// src/components/auth/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const userRole = user.role?.toLowerCase();
  const isAllowed = allowedRoles.some(role => role.toLowerCase() === userRole);

  if (!isAllowed) {
    // Redirect to appropriate dashboard based on role
    if (userRole === 'admin') {
      return <Navigate to="/admin" replace />;
    } else if (userRole === 'registrar') {
      return <Navigate to="/registrar" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;