import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";

interface ProtectedRouteProps {
  children: React.ReactElement;
  requiredRole?: "admin";
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { auth } = useAuth();

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && !auth.user?.isAdmin) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default ProtectedRoute;
