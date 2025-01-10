import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactElement;
  requiredRole?: "admin";
}

function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    console.log("isAuthenticated is ", isAuthenticated)
    return <Navigate to="/auth" />;
  }

  if (requiredRole && !user?.is_admin) {
    console.log(user)
    return <Navigate to="/unauthorized" />;
  }

  return children;
}

export default ProtectedRoute;
