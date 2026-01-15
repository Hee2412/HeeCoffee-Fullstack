// src/components/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { getUser } from "../utils/authUtils";

export function ProtectedRoute({ children, requireAdmin = false }) {
  const location = useLocation();
  const user = getUser();

  // Not logged in
  if (!user) {
    return (
      <Navigate to="/login" state={{ redirectTo: location.pathname }} replace />
    );
  }

  // Logged in but not admin (when admin required)
  if (requireAdmin && user.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  // All checks passed
  return children;
}
