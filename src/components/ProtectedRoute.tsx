import { Navigate, useLocation } from "react-router-dom";
import { useAuth, UserRole } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    const back = location.pathname + location.search;
    return <Navigate to={`/login?redirect=${encodeURIComponent(back)}`} replace />;
  }
  if (!user || !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;

  return <>{children}</>;
};

export default ProtectedRoute;
