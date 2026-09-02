import { Navigate, Outlet } from "react-router";
import { useAuth } from "../contexts/AuthProvider";

export default function ProtectedRoute() {
  const { isAuthenticated, guestMode } = useAuth();

  if (!isAuthenticated && !guestMode) {
    return <Navigate to="/auth/log-in" replace />;
  }

  return <Outlet />;
}
